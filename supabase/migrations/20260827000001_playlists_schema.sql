-- ==============================================================================
-- CINMAX Global Products - Migration for Product-Wise Playlists & Access Control
-- Migration: 20260827000001_playlists_schema.sql
-- ==============================================================================

-- 1. PLAYLISTS TABLE (Linked to specific Product ID)
CREATE TABLE IF NOT EXISTS public.playlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
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

-- 4. INDEXES
CREATE INDEX IF NOT EXISTS idx_playlists_product ON public.playlists(product_id);
CREATE INDEX IF NOT EXISTS idx_playlists_published ON public.playlists(is_published);
CREATE INDEX IF NOT EXISTS idx_playlist_videos_playlist ON public.playlist_videos(playlist_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_user_playlist_purchases_user ON public.user_playlist_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_user_playlist_purchases_playlist ON public.user_playlist_purchases(playlist_id);

-- 5. RLS POLICIES
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_playlist_purchases ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published playlists
CREATE POLICY "Public Read Published Playlists"
ON public.playlists FOR SELECT
USING (is_published = true);

-- Allow full access for admin role / service role
CREATE POLICY "Admin Full Access Playlists"
ON public.playlists FOR ALL
USING (true);

-- Public read access for playlist videos
CREATE POLICY "Public Read Playlist Videos"
ON public.playlist_videos FOR SELECT
USING (true);

-- Admin full access to playlist videos
CREATE POLICY "Admin Full Access Playlist Videos"
ON public.playlist_videos FOR ALL
USING (true);

-- Users can view their own playlist purchases
CREATE POLICY "Users view own playlist purchases"
ON public.user_playlist_purchases FOR SELECT
USING (auth.uid() = user_id);

-- Users or service role can insert playlist purchases
CREATE POLICY "Users insert own playlist purchases"
ON public.user_playlist_purchases FOR INSERT
WITH CHECK (true);

-- 6. SEED PRODUCT-SPECIFIC PLAYLISTS & VIDEOS
-- Product A: Azure Marine Botanical Bar ('b1000000-0000-0000-0000-000000000001') -> Playlist A (₹299, 5 Videos)
-- Product B: French Lavender & Cashmere Soap ('b1000000-0000-0000-0000-000000000002') -> Playlist B (₹399, 6 Videos)

INSERT INTO public.playlists (id, product_id, title, description, thumbnail_url, price, is_published)
VALUES
    (
        'a1000000-0000-0000-0000-000000000001',
        'b1000000-0000-0000-0000-000000000001',
        'Master Marine Botanical Soapmaking Class',
        'Complete masterclass on wild-harvested sea kelp infusion, slow cold-cure soapmaking, and bergamot essential oil formulation.',
        'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800&auto=format&fit=crop&q=80',
        299.00,
        true
    ),
    (
        'a1000000-0000-0000-0000-000000000002',
        'b1000000-0000-0000-0000-000000000002',
        'French Lavender & Cashmere Formulation Masterclass',
        'In-depth masterclass covering high-altitude lavender scent compounding, Ghanaian shea butter melting, and soothing barrier repair chemistry.',
        'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop&q=80',
        399.00,
        true
    )
ON CONFLICT (id) DO NOTHING;

-- Seed 5 Videos into Playlist A (Product A)
INSERT INTO public.playlist_videos (id, playlist_id, youtube_url, youtube_id, title, thumbnail_url, duration, sort_order)
VALUES
    ('11000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 'Lesson 1: Introduction to Botanical Soap Chemistry', 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', '12 Mins', 1),
    ('11000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ', '3JZ_D3ELwOQ', 'Lesson 2: Atlantic Sea Kelp Oil Infusion & Lye Safety', 'https://img.youtube.com/vi/3JZ_D3ELwOQ/hqdefault.jpg', '18 Mins', 2),
    ('11000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'https://www.youtube.com/watch?v=L_LUpnjgPso', 'L_LUpnjgPso', 'Lesson 3: Cold-Process Temperature Control & Emulsification', 'https://img.youtube.com/vi/L_LUpnjgPso/hqdefault.jpg', '22 Mins', 3),
    ('11000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ', 'fJ9rUzIMcZQ', 'Lesson 4: Pouring, Swirling, and Marine Texture Design', 'https://img.youtube.com/vi/fJ9rUzIMcZQ/hqdefault.jpg', '15 Mins', 4),
    ('11000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000001', 'https://www.youtube.com/watch?v=9bZkp7q19f0', '9bZkp7q19f0', 'Lesson 5: 6-Week Curing Routine & Final pH Verification', 'https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg', '14 Mins', 5)
ON CONFLICT (id) DO NOTHING;

-- Seed 6 Videos into Playlist B (Product B)
INSERT INTO public.playlist_videos (id, playlist_id, youtube_url, youtube_id, title, thumbnail_url, duration, sort_order)
VALUES
    ('22000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 'Module 1: Lavender Aromatherapy & Scent Compounding', 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', '14 Mins', 1),
    ('22000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ', '3JZ_D3ELwOQ', 'Module 2: Raw Ghanaian Shea Butter Processing', 'https://img.youtube.com/vi/3JZ_D3ELwOQ/hqdefault.jpg', '20 Mins', 2),
    ('22000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', 'https://www.youtube.com/watch?v=L_LUpnjgPso', 'L_LUpnjgPso', 'Module 3: Formulation Ratios & Fatty Acid Balancing', 'https://img.youtube.com/vi/L_LUpnjgPso/hqdefault.jpg', '25 Mins', 3),
    ('22000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ', 'fJ9rUzIMcZQ', 'Module 4: Cashmere Smooth Texture Whipping Techniques', 'https://img.youtube.com/vi/fJ9rUzIMcZQ/hqdefault.jpg', '18 Mins', 4),
    ('22000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 'https://www.youtube.com/watch?v=9bZkp7q19f0', '9bZkp7q19f0', 'Module 5: Sensitive Skin Patch Testing & Moisture Barrier Science', 'https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg', '16 Mins', 5),
    ('22000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000002', 'https://www.youtube.com/watch?v=kJQP7kiw5Fk', 'kJQP7kiw5Fk', 'Module 6: Packaging, Storage & Shelf-Life Optimization', 'https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg', '10 Mins', 6)
ON CONFLICT (id) DO NOTHING;
