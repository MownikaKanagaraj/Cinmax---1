-- ==============================================================================
-- CINMAX Global Products - Incremental Migration for Commerce Engine
-- Migration: 20260804000001_commerce_engine.sql
-- ==============================================================================

-- 1. Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_shipping')),
    discount_value NUMERIC(10, 2) NOT NULL,
    min_purchase_amount NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    max_discount_amount NUMERIC(10, 2),
    applicable_category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    applicable_product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    first_order_only BOOLEAN DEFAULT FALSE NOT NULL,
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0 NOT NULL,
    customer_limit INTEGER DEFAULT 1 NOT NULL,
    starts_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON public.coupons(is_active, starts_at, expires_at);

-- 2. Coupon Redemptions Log Table
CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    redeemed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_user ON public.coupon_redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_coupon ON public.coupon_redemptions(coupon_id);

-- 3. Tax Rules Table (GST / Regional)
CREATE TABLE IF NOT EXISTS public.tax_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_code TEXT NOT NULL,
    country TEXT DEFAULT 'IN' NOT NULL,
    gst_rate NUMERIC(5, 2) DEFAULT 18.00 NOT NULL,
    cgst_rate NUMERIC(5, 2) DEFAULT 9.00 NOT NULL,
    sgst_rate NUMERIC(5, 2) DEFAULT 9.00 NOT NULL,
    igst_rate NUMERIC(5, 2) DEFAULT 18.00 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Shipping Rules Table
CREATE TABLE IF NOT EXISTS public.shipping_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    min_order_amount NUMERIC(10, 2) DEFAULT 50.00 NOT NULL,
    flat_rate NUMERIC(10, 2) DEFAULT 5.99 NOT NULL,
    weight_rate_per_kg NUMERIC(10, 2) DEFAULT 2.50 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Saved For Later Items Table
CREATE TABLE IF NOT EXISTS public.saved_for_later (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, product_id, variant_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_for_later_user ON public.saved_for_later(user_id);

-- 6. Row Level Security Policies
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_for_later ENABLE ROW LEVEL SECURITY;

-- Public Read for Active Coupons, Tax Rules & Shipping Rules
CREATE POLICY "Public Read Active Coupons"
ON public.coupons FOR SELECT
USING (is_active = true);

CREATE POLICY "Public Read Active Tax Rules"
ON public.tax_rules FOR SELECT
USING (is_active = true);

CREATE POLICY "Public Read Active Shipping Rules"
ON public.shipping_rules FOR SELECT
USING (is_active = true);

-- User RLS for Saved For Later & Coupon Redemptions
CREATE POLICY "Users can manage own saved for later"
ON public.saved_for_later FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Users can view own coupon redemptions"
ON public.coupon_redemptions FOR SELECT
USING (auth.uid() = user_id);

-- Seed Default Rules
INSERT INTO public.tax_rules (region_code, country, gst_rate, cgst_rate, sgst_rate, igst_rate)
VALUES ('DEFAULT', 'IN', 18.00, 9.00, 9.00, 18.00)
ON CONFLICT DO NOTHING;

INSERT INTO public.shipping_rules (name, min_order_amount, flat_rate, weight_rate_per_kg)
VALUES ('Standard Botanical Express', 50.00, 5.99, 2.50)
ON CONFLICT DO NOTHING;

INSERT INTO public.coupons (code, description, discount_type, discount_value, min_purchase_amount, max_discount_amount, usage_limit, first_order_only)
VALUES 
    ('BOTANICAL10', 'Enjoy 10% off your entire botanical order', 'percentage', 10.00, 30.00, 20.00, 1000, false),
    ('WELCOME20', 'Flat $20 off your first artisan soap order', 'fixed_amount', 20.00, 60.00, 20.00, 500, true),
    ('FREESHIP', 'Free shipping on all order values', 'free_shipping', 5.99, 0.00, 5.99, 5000, false)
ON CONFLICT (code) DO NOTHING;
