-- ==============================================================================
-- CINMAX Global Products - Incremental Migration for Product Search & Storage
-- Migration: 20260803000001_product_search_and_storage.sql
-- ==============================================================================

-- 1. Full-Text Search Vector Column & Index for Products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS fts tsvector
GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(subtitle, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
) STORED;

CREATE INDEX IF NOT EXISTS idx_products_fts ON public.products USING GIN (fts);

-- 2. Performance Indexes for Sorting & Filtering
CREATE INDEX IF NOT EXISTS idx_products_created_at_desc ON public.products (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_rating_desc ON public.products (average_rating DESC, review_count DESC);
CREATE INDEX IF NOT EXISTS idx_products_price_asc ON public.products (base_price ASC);
CREATE INDEX IF NOT EXISTS idx_products_price_desc ON public.products (base_price DESC);
CREATE INDEX IF NOT EXISTS idx_products_category_active ON public.products (category_id, is_active);

-- 3. Storage Buckets Setup
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('products', 'products', true),
    ('categories', 'categories', true),
    ('banners', 'banners', true),
    ('blogs', 'blogs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public Storage Access RLS Policies
CREATE POLICY "Public Read Storage Access for Products"
ON storage.objects FOR SELECT
USING (bucket_id IN ('products', 'categories', 'banners', 'blogs'));

CREATE POLICY "Authenticated Insert Storage Access for Products"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id IN ('products', 'categories', 'banners', 'blogs'));
