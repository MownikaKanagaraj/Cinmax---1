-- ==============================================================================
-- CINMAX Global Products - Loyalty Points System Migration
-- Migration: 20260907000001_loyalty_system.sql
-- ==============================================================================

-- 1. Ensure loyalty_transactions table exists with proper indices & constraints
CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    transaction_type TEXT NOT NULL, -- 'EARN', 'REDEEM', 'REVIEW', 'ADJUSTMENT', 'REFUND_REVERSAL', 'REFUND_RESTORE'
    points INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Ensure Performance Indexes
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_user ON public.loyalty_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_order ON public.loyalty_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_type ON public.loyalty_transactions(transaction_type);

-- Enable RLS
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;

-- Secure Least-Privilege RLS Policies
DO $$
BEGIN
    -- Drop legacy permissive/unsafe policies if present
    DROP POLICY IF EXISTS "Allow full loyalty_transactions access" ON public.loyalty_transactions;
    DROP POLICY IF EXISTS "Users view own loyalty transactions" ON public.loyalty_transactions;
    DROP POLICY IF EXISTS "Admins can manage loyalty transactions" ON public.loyalty_transactions;

    -- 1. Users can only view their own loyalty transactions (or Admins view all). Unauthenticated guests denied.
    CREATE POLICY "Users view own loyalty transactions" ON public.loyalty_transactions
        FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

    -- 2. Direct client-side INSERT/UPDATE/DELETE restricted strictly to Admins
    CREATE POLICY "Admins can manage loyalty transactions" ON public.loyalty_transactions
        FOR ALL USING (public.is_admin());
END $$;

-- 2. Protection Trigger: Prevent Direct Client-Side Tampering of profiles.loyalty_points
CREATE OR REPLACE FUNCTION public.prevent_direct_loyalty_points_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF NEW.loyalty_points IS DISTINCT FROM OLD.loyalty_points THEN
        -- Allow update ONLY if invoked by process_loyalty_transaction RPC, service_role key, or by an Admin
        IF current_setting('cinmax.internal_loyalty_update', true) IS DISTINCT FROM 'true'
           AND current_setting('role', true) IS DISTINCT FROM 'service_role'
           AND NOT public.is_admin() THEN
            NEW.loyalty_points := OLD.loyalty_points;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_loyalty_points_trigger ON public.profiles;
CREATE TRIGGER protect_loyalty_points_trigger
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_direct_loyalty_points_update();


-- 3. Atomic Stored Procedure for Processing Loyalty Transactions
-- Guarantees row locking on public.profiles to prevent double spending and race conditions
CREATE OR REPLACE FUNCTION public.process_loyalty_transaction(
    p_user_id UUID,
    p_order_id UUID,
    p_transaction_type TEXT,
    p_points INTEGER,
    p_description TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_current_balance INTEGER;
    v_new_balance INTEGER;
    v_tx_id UUID;
    v_already_exists BOOLEAN;
    v_normalized_type TEXT;
BEGIN
    -- Normalize transaction type to uppercase
    v_normalized_type := UPPER(TRIM(p_transaction_type));

    -- Authorization & Role Verification:
    -- Non-admin client callers can only execute REDEEM for their own account.
    IF current_setting('role', true) IS DISTINCT FROM 'service_role' AND NOT public.is_admin() THEN
        IF auth.uid() IS NULL THEN
            RETURN jsonb_build_object('success', false, 'message', 'Unauthorized: Authentication required.');
        END IF;

        IF auth.uid() != p_user_id THEN
            RETURN jsonb_build_object('success', false, 'message', 'Unauthorized: Cannot modify another user loyalty points.');
        END IF;

        IF v_normalized_type NOT IN ('REDEEM') THEN
            RETURN jsonb_build_object('success', false, 'message', 'Unauthorized: Direct points earning or adjustments are restricted.');
        END IF;
    END IF;

    -- Set flag to allow profile.loyalty_points update inside this trusted procedure context
    PERFORM set_config('cinmax.internal_loyalty_update', 'true', true);

    -- Prevent duplicate EARN or REDEEM for the same order if p_order_id is passed
    IF p_order_id IS NOT NULL AND v_normalized_type IN ('EARN', 'REDEEM') THEN
        SELECT EXISTS (
            SELECT 1 FROM public.loyalty_transactions
            WHERE user_id = p_user_id
              AND order_id = p_order_id
              AND UPPER(transaction_type) = v_normalized_type
        ) INTO v_already_exists;

        IF v_already_exists THEN
            SELECT loyalty_points INTO v_current_balance
            FROM public.profiles
            WHERE id = p_user_id;

            RETURN jsonb_build_object(
                'success', true,
                'duplicate', true,
                'message', 'Transaction already processed for this order.',
                'current_balance', COALESCE(v_current_balance, 0)
            );
        END IF;
    END IF;

    -- Lock the user profile row for atomic update
    SELECT loyalty_points INTO v_current_balance
    FROM public.profiles
    WHERE id = p_user_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'User profile not found.'
        );
    END IF;

    v_current_balance := COALESCE(v_current_balance, 0);

    -- For REDEEM, ensure user has sufficient points
    IF v_normalized_type = 'REDEEM' AND ABS(p_points) > v_current_balance THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Insufficient loyalty points balance.',
            'current_balance', v_current_balance
        );
    END IF;

    -- Calculate new balance
    IF v_normalized_type = 'REDEEM' THEN
        v_new_balance := v_current_balance - ABS(p_points);
    ELSIF v_normalized_type IN ('EARN', 'REVIEW', 'REFUND_RESTORE') THEN
        v_new_balance := v_current_balance + ABS(p_points);
    ELSIF v_normalized_type IN ('REFUND_REVERSAL') THEN
        v_new_balance := GREATEST(0, v_current_balance - ABS(p_points));
    ELSIF v_normalized_type = 'ADJUSTMENT' THEN
        v_new_balance := GREATEST(0, v_current_balance + p_points);
    ELSE
        v_new_balance := GREATEST(0, v_current_balance + p_points);
    END IF;

    -- Update user profile loyalty points atomically
    UPDATE public.profiles
    SET loyalty_points = v_new_balance,
        updated_at = NOW()
    WHERE id = p_user_id;

    -- Record transaction ledger entry
    INSERT INTO public.loyalty_transactions (
        user_id,
        order_id,
        transaction_type,
        points,
        balance_after,
        description,
        created_at
    ) VALUES (
        p_user_id,
        p_order_id,
        v_normalized_type,
        CASE WHEN v_normalized_type IN ('REDEEM', 'REFUND_REVERSAL') THEN -ABS(p_points) ELSE ABS(p_points) END,
        v_new_balance,
        p_description,
        NOW()
    ) RETURNING id INTO v_tx_id;

    RETURN jsonb_build_object(
        'success', true,
        'duplicate', false,
        'transaction_id', v_tx_id,
        'previous_balance', v_current_balance,
        'new_balance', v_new_balance,
        'points_delta', CASE WHEN v_normalized_type IN ('REDEEM', 'REFUND_REVERSAL') THEN -ABS(p_points) ELSE ABS(p_points) END
    );
END;
$$;

