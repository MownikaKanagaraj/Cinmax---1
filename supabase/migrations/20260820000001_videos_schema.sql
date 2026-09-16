-- ==============================================================================
-- CINMAX Global Products - Migration for Video Management & Paid Video Access
-- Migration: 20260820000001_videos_schema.sql
-- ==============================================================================

-- 1. VIDEOS TABLE
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

-- 2. USER VIDEO PURCHASES TABLE (LIFETIME ACCESS)
CREATE TABLE IF NOT EXISTS public.user_video_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
    payment_id TEXT,
    amount_paid NUMERIC(10, 2) NOT NULL,
    purchased_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, video_id)
);

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_videos_published ON public.videos(is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_video_purchases_user ON public.user_video_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_video_purchases_video ON public.user_video_purchases(video_id);

-- 4. RLS POLICIES
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_video_purchases ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published videos
CREATE POLICY "Public Read Published Videos"
ON public.videos FOR SELECT
USING (is_published = true);

-- Allow full access for admin role / service role
CREATE POLICY "Admin Full Access Videos"
ON public.videos FOR ALL
USING (true);

-- Users can view their own video purchases
CREATE POLICY "Users view own video purchases"
ON public.user_video_purchases FOR SELECT
USING (auth.uid() = user_id);

-- Users or service role can insert video purchases
CREATE POLICY "Users insert own video purchases"
ON public.user_video_purchases FOR INSERT
WITH CHECK (true);

-- 5. SEED INITIAL CINMAX BOTANICAL MASTERCLASS VIDEOS
INSERT INTO public.videos (title, description, youtube_url, youtube_id, thumbnail_url, price, is_published, sort_order)
VALUES
    ('Artisanal Cold-Process Soapmaking Masterclass', 'Learn the traditional cold-process formulation techniques, lye safety, botanical infusion, and essential oil blending from master artisans.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', 299.00, true, 1),
    ('Organic Herbal Balm & Salve Crafting', 'Step-by-step guide to formulating soothing botanical salves, beeswax melting ratios, and calendula oil extraction for ultra-hydrating skin balms.', 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ', '3JZ_D3ELwOQ', 'https://img.youtube.com/vi/3JZ_D3ELwOQ/hqdefault.jpg', 199.00, true, 2),
    ('Natural Skin Therapeutics & Essential Oil Blending', 'Discover how to craft custom aromatherapy scent profiles and select non-comedogenic carrier oils for therapeutic body soaps.', 'https://www.youtube.com/watch?v=L_LUpnjgPso', 'L_LUpnjgPso', 'https://img.youtube.com/vi/L_LUpnjgPso/hqdefault.jpg', 0.00, true, 3)
ON CONFLICT DO NOTHING;
