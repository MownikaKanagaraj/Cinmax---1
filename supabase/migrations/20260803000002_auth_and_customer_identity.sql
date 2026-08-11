-- ==============================================================================
-- CINMAX Global Products - Incremental Migration for Customer Auth & Identity
-- Migration: 20260803000002_auth_and_customer_identity.sql
-- ==============================================================================

-- 1. Extend Profiles Table for Identity
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'super_admin';

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb NOT NULL;

-- 2. Customer Addresses Table
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    company TEXT,
    street_line1 TEXT NOT NULL,
    street_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT DEFAULT 'US' NOT NULL,
    phone TEXT NOT NULL,
    is_default_shipping BOOLEAN DEFAULT FALSE NOT NULL,
    is_default_billing BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_addresses_user ON public.addresses(user_id);

-- 3. Customer Preferences Table
CREATE TABLE IF NOT EXISTS public.customer_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    skin_type TEXT,
    fragrance_preference TEXT,
    favorite_ingredients TEXT[] DEFAULT '{}' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Notification Settings Table
CREATE TABLE IF NOT EXISTS public.notification_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT TRUE NOT NULL,
    sms_notifications BOOLEAN DEFAULT FALSE NOT NULL,
    push_notifications BOOLEAN DEFAULT TRUE NOT NULL,
    marketing_emails BOOLEAN DEFAULT TRUE NOT NULL,
    order_updates BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Automatic Profile Creation Trigger on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        coalesce(NEW.raw_user_meta_data->>'first_name', ''),
        coalesce(NEW.raw_user_meta_data->>'last_name', ''),
        'customer'
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        updated_at = NOW();

    INSERT INTO public.notification_settings (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    INSERT INTO public.customer_preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();

-- 6. Row Level Security Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id OR role IN ('admin', 'super_admin'));

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id OR role IN ('admin', 'super_admin'));

-- Addresses RLS
CREATE POLICY "Users can manage own addresses"
ON public.addresses FOR ALL
USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
));

-- Customer Preferences RLS
CREATE POLICY "Users can manage own preferences"
ON public.customer_preferences FOR ALL
USING (auth.uid() = user_id);

-- Notification Settings RLS
CREATE POLICY "Users can manage own notification settings"
ON public.notification_settings FOR ALL
USING (auth.uid() = user_id);
