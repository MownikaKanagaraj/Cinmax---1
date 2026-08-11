-- ==============================================================================
-- CINMAX Global Products - Incremental Migration for Checkout & Order Engine
-- Migration: 20260804000002_checkout_and_orders.sql
-- ==============================================================================

-- 1. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'payment_pending', 'paid', 'confirmed', 'processing',
        'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled',
        'returned', 'refunded'
    )),
    payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN (
        'unpaid', 'authorized', 'paid', 'failed', 'refunded'
    )),
    shipping_address JSONB NOT NULL,
    billing_address JSONB NOT NULL,
    items_subtotal NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    tax_amount NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    shipping_amount NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    grand_total NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,
    payment_method TEXT DEFAULT 'razorpay' NOT NULL,
    payment_transaction_id TEXT,
    notes TEXT,
    tracking_number TEXT,
    courier_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);

-- 2. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    product_title TEXT NOT NULL,
    variant_title TEXT,
    sku TEXT,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    total_price NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- 3. Payment Transactions Table
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    provider TEXT DEFAULT 'razorpay' NOT NULL,
    transaction_id TEXT,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'authorized', 'captured', 'failed', 'refunded')),
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_payment_tx_order ON public.payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_tx_razorpay ON public.payment_transactions(razorpay_order_id, razorpay_payment_id);

-- 4. Order Status History Timeline Table
CREATE TABLE IF NOT EXISTS public.order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    previous_status TEXT,
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_status_history_order ON public.order_status_history(order_id);

-- 5. Returns & Refunds Tables
CREATE TABLE IF NOT EXISTS public.returns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'approved', 'rejected', 'completed')),
    reason TEXT NOT NULL,
    refund_amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    return_id UUID REFERENCES public.returns(id) ON DELETE SET NULL,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'processed' CHECK (status IN ('pending', 'processed', 'failed')),
    razorpay_refund_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. Invoices Table
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL UNIQUE,
    pdf_url TEXT,
    subtotal NUMERIC(10, 2) NOT NULL,
    tax_amount NUMERIC(10, 2) NOT NULL,
    grand_total NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_invoices_order ON public.invoices(order_id);

-- 7. Shipment Tracking & Labels Tables
CREATE TABLE IF NOT EXISTS public.shipment_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    courier TEXT DEFAULT 'Standard Express' NOT NULL,
    tracking_number TEXT NOT NULL,
    current_status TEXT NOT NULL,
    estimated_delivery TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.shipping_labels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    label_url TEXT NOT NULL,
    tracking_code TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    entity_name TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. Row Level Security Policies
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_tracking ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
CREATE POLICY "Users can create orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
CREATE POLICY "Users can view own order items"
ON public.order_items FOR SELECT
USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)));

DROP POLICY IF EXISTS "Users can view own invoices" ON public.invoices;
CREATE POLICY "Users can view own invoices"
ON public.invoices FOR SELECT
USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = invoices.order_id AND (orders.user_id = auth.uid())));
