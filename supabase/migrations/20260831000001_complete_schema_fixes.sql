-- ==============================================================================
-- CINMAX Global Products - Migration for Complete System Schema Fixes
-- Migration: 20260831000001_complete_schema_fixes.sql
-- ==============================================================================

-- 1. PLAYLISTS TABLE (Linked to specific Product ID)
CREATE TABLE IF NOT EXISTS public.playlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    price NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    is_published BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. PLAYLIST VIDEOS TABLE (Multiple videos inside a Playlist)
CREATE TABLE IF NOT EXISTS public.playlist_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
    youtube_url TEXT NOT NULL,
    youtube_id TEXT NOT NULL,
    title TEXT NOT NULL,
    thumbnail_url TEXT,
    duration TEXT DEFAULT '15 Mins',
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. USER PLAYLIST PURCHASES TABLE (LIFETIME ACCESS CONTROL)
CREATE TABLE IF NOT EXISTS public.user_playlist_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    payment_status TEXT DEFAULT 'verified' NOT NULL,
    purchase_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    access_status TEXT DEFAULT 'active' NOT NULL,
    UNIQUE(user_id, playlist_id)
);

-- 4. VIDEOS TABLE
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    youtube_url TEXT NOT NULL,
    youtube_id TEXT NOT NULL,
    thumbnail_url TEXT,
    price NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    is_published BOOLEAN DEFAULT TRUE NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. USER VIDEO PURCHASES TABLE
CREATE TABLE IF NOT EXISTS public.user_video_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
    payment_id TEXT,
    amount_paid NUMERIC(10, 2) NOT NULL,
    purchased_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, video_id)
);

-- 6. HOME MARKETING SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.home_marketing_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. BANNERS TABLE
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT,
    cta_text TEXT DEFAULT 'Shop Collection',
    cta_link TEXT DEFAULT '/shop',
    image_url TEXT NOT NULL,
    badge_text TEXT DEFAULT 'Special Release',
    background_color TEXT DEFAULT '#002754',
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    sort_order INTEGER DEFAULT 1 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. LOYALTY TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    transaction_type TEXT NOT NULL,
    points INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. DELIVERY RULES TABLE
CREATE TABLE IF NOT EXISTS public.delivery_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state TEXT NOT NULL UNIQUE,
    region TEXT NOT NULL DEFAULT 'South India',
    free_shipping_threshold NUMERIC(10, 2) NOT NULL DEFAULT 499.00,
    base_shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 40.00,
    bulk_shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 70.00,
    bulk_item_threshold INTEGER NOT NULL DEFAULT 4,
    estimated_days TEXT DEFAULT '2-4 Days',
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 11. CUSTOMER ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.customer_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT,
    phone TEXT NOT NULL,
    street_line1 TEXT NOT NULL,
    street_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT DEFAULT 'India' NOT NULL,
    landmark TEXT,
    address_type TEXT DEFAULT 'Home',
    is_default_shipping BOOLEAN DEFAULT FALSE NOT NULL,
    is_default_billing BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_playlists_product ON public.playlists(product_id);
CREATE INDEX IF NOT EXISTS idx_playlists_published ON public.playlists(is_published);
CREATE INDEX IF NOT EXISTS idx_playlist_videos_playlist ON public.playlist_videos(playlist_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_user_playlist_purchases_user ON public.user_playlist_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_user_playlist_purchases_playlist ON public.user_playlist_purchases(playlist_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_user ON public.loyalty_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_user ON public.customer_addresses(user_id);

-- RLS POLICIES ENABLE
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_playlist_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_video_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_marketing_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;

-- POLICIES
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read playlists') THEN
        CREATE POLICY "Allow public read playlists" ON public.playlists FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow full playlists access') THEN
        CREATE POLICY "Allow full playlists access" ON public.playlists FOR ALL USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read playlist_videos') THEN
        CREATE POLICY "Allow public read playlist_videos" ON public.playlist_videos FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow full playlist_videos access') THEN
        CREATE POLICY "Allow full playlist_videos access" ON public.playlist_videos FOR ALL USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users view own playlist purchases') THEN
        CREATE POLICY "Users view own playlist purchases" ON public.user_playlist_purchases FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow full user_playlist_purchases access') THEN
        CREATE POLICY "Allow full user_playlist_purchases access" ON public.user_playlist_purchases FOR ALL USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read home_marketing_settings') THEN
        CREATE POLICY "Allow public read home_marketing_settings" ON public.home_marketing_settings FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow full home_marketing_settings access') THEN
        CREATE POLICY "Allow full home_marketing_settings access" ON public.home_marketing_settings FOR ALL USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read banners') THEN
        CREATE POLICY "Allow public read banners" ON public.banners FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow full banners access') THEN
        CREATE POLICY "Allow full banners access" ON public.banners FOR ALL USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow full loyalty_transactions access') THEN
        CREATE POLICY "Allow full loyalty_transactions access" ON public.loyalty_transactions FOR ALL USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow full notifications access') THEN
        CREATE POLICY "Allow full notifications access" ON public.notifications FOR ALL USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read delivery_rules') THEN
        CREATE POLICY "Allow public read delivery_rules" ON public.delivery_rules FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow full delivery_rules access') THEN
        CREATE POLICY "Allow full delivery_rules access" ON public.delivery_rules FOR ALL USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow full customer_addresses access') THEN
        CREATE POLICY "Allow full customer_addresses access" ON public.customer_addresses FOR ALL USING (true);
    END IF;
END $$;

-- SEED SEED DATA FOR BANNERS IF EMPTY
INSERT INTO public.banners (id, title, subtitle, cta_text, cta_link, image_url, badge_text, background_color, is_active, sort_order)
VALUES
    ('b1000000-0000-0000-0000-000000000001', 'Monsoon Care Collection', 'Flat 40% OFF on all Gift Hampers & Combo Packs', 'Shop Collection', '/shop', 'https://images.unsplash.com/photo-1607006314147-759088fd21c2?w=1600&auto=format&fit=crop&q=80', 'New Release', '#002754', true, 1),
    ('b1000000-0000-0000-0000-000000000002', 'Artisan Cold-Processed Soaps', 'Pure Neem, Aloe Vera & Sandalwood Formulations', 'Explore Soaps', '/category/soaps', 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=1600&auto=format&fit=crop&q=80', 'Signature Series', '#002754', true, 2)
ON CONFLICT (id) DO NOTHING;

-- SEED DEFAULT DELIVERY RULES FOR SOUTH INDIA & REST OF INDIA
INSERT INTO public.delivery_rules (id, state, region, free_shipping_threshold, base_shipping_fee, bulk_shipping_fee, bulk_item_threshold, estimated_days, is_active)
VALUES
    ('d1000000-0000-0000-0000-000000000001', 'Tamil Nadu', 'South India', 499.00, 40.00, 70.00, 4, '1-2 Days', true),
    ('d1000000-0000-0000-0000-000000000002', 'Puducherry', 'South India', 499.00, 40.00, 70.00, 4, '1-2 Days', true),
    ('d1000000-0000-0000-0000-000000000003', 'Kerala', 'South India', 499.00, 40.00, 70.00, 4, '2-3 Days', true),
    ('d1000000-0000-0000-0000-000000000004', 'Karnataka', 'South India', 499.00, 40.00, 70.00, 4, '2-3 Days', true),
    ('d1000000-0000-0000-0000-000000000005', 'Andhra Pradesh', 'South India', 499.00, 40.00, 70.00, 4, '2-3 Days', true),
    ('d1000000-0000-0000-0000-000000000006', 'Telangana', 'South India', 499.00, 40.00, 70.00, 4, '2-3 Days', true),
    ('d1000000-0000-0000-0000-000000000007', 'Other States', 'Rest of India', 799.00, 60.00, 90.00, 4, '3-5 Days', true)
ON CONFLICT (state) DO NOTHING;
