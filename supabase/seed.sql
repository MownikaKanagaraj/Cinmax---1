-- ==============================================================================
-- CINMAX Global Products - Database Seed Data
-- ==============================================================================

-- 1. Insert Luxury Categories
INSERT INTO public.categories (id, slug, name, description, sort_order, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'cold-process-soaps', 'Cold-Process Soaps', 'Traditional artisanal cold-cured botanical soap bars retaining pure natural glycerin.', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'liquid-body-washes', 'Botanical Body Washes', 'Sulfate-free foaming washes enriched with aloe vera and essential oils.', 2, true),
  ('c1000000-0000-0000-0000-000000000003', 'body-butters-balms', 'Restorative Butters & Balms', 'Whipped shea and kokum body butters formulated for deep barrier repair.', 3, true),
  ('c1000000-0000-0000-0000-000000000004', 'exfoliating-bars', 'Exfoliating Scrub Bars', 'Pumice, French clay, and poppy seed textured bars for cellular rejuvenation.', 4, true)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Hero Products
INSERT INTO public.products (
  id, slug, title, subtitle, description, how_to_use, process_type,
  category_id, base_price, compare_at_price, skin_types, fragrance_family,
  certifications, is_featured, is_new, average_rating, review_count
)
VALUES
  (
    'b1000000-0000-0000-0000-000000000001',
    'azure-marine-botanical-bar',
    'Azure Marine Botanical Bar',
    'Mineral-Rich Sea Kelp & Mediterranean Bergamot',
    'Handcrafted over a 6-week slow cold-cure process. Infused with wild-harvested Atlantic kelp, cold-pressed virgin olive oil, and organic bergamot peel for an invigorating, deeply hydrating cleansing ritual.',
    'Lather between wet palms or with a natural sisal pouch. Massage rich lather over damp skin and rinse thoroughly with warm water.',
    'cold-process',
    'c1000000-0000-0000-0000-000000000001',
    18.00,
    22.00,
    ARRAY['all', 'normal', 'dry', 'combination'],
    'aquatic',
    ARRAY['USDA Organic Oils', 'Cruelty-Free', '100% Biodegradable', 'Zero-Plastic Packaging'],
    true,
    true,
    4.95,
    128
  ),
  (
    'b1000000-0000-0000-0000-000000000002',
    'french-lavender-cashmere-soap',
    'French Lavender & Cashmere Soap',
    'High-Altitude Provence Lavender & Whipped Shea',
    'A soothing sanctuary bar blending French alpine lavender essential oil with unrefined Ghanaian shea butter. Calms stressed skin and prepares the mind for restorative sleep.',
    'Gentle enough for daily face and body use. For best longevity, keep on a free-draining stone soap dish between uses.',
    'cold-process',
    'c1000000-0000-0000-0000-000000000001',
    16.50,
    NULL,
    ARRAY['all', 'sensitive', 'dry'],
    'floral',
    ARRAY['USDA Organic Oils', 'Vegan Certified', 'Dermatologist Tested'],
    true,
    false,
    4.88,
    94
  ),
  (
    'b1000000-0000-0000-0000-000000000003',
    'nordic-pine-volcanic-ash-scrub',
    'Nordic Pine & Volcanic Ash Scrub',
    'Icelandic Pumice & Black Spruce Detoxifier',
    'Dual-action exfoliating bar enriched with microscopic volcanic ash from Iceland and purifying black spruce pine oil. Buffs away dull surface cells while boosting micro-circulation.',
    'Use 2-3 times weekly. Work into a dense micro-exfoliating lather across shoulders, back, and elbows.',
    'cold-process',
    'c1000000-0000-0000-0000-000000000004',
    19.00,
    24.00,
    ARRAY['oily', 'combination'],
    'woody',
    ARRAY['Wildcrafted Botanicals', 'Zero Microplastics', 'Leaping Bunny Certified'],
    true,
    true,
    4.91,
    76
  )
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Product Variants
INSERT INTO public.product_variants (
  id, product_id, sku, title, weight_grams, price, inventory_quantity, is_available
)
VALUES
  ('a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'AMB-BAR-150G', 'Standard Bar (150g)', 150, 18.00, 45, true),
  ('a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'AMB-BAR-300G', 'Duo Value Pack (300g)', 300, 32.00, 28, true),
  ('a1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002', 'FLC-BAR-150G', 'Standard Bar (150g)', 150, 16.50, 60, true),
  ('a1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000003', 'NPV-BAR-150G', 'Scrub Bar (150g)', 150, 19.00, 34, true)
ON CONFLICT (sku) DO NOTHING;

-- 4. Insert Organic Ingredients
INSERT INTO public.ingredients (id, product_id, name, inci_name, purpose, is_organic, is_key_botanical)
VALUES
  ('e1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Atlantic Sea Kelp', 'Macrocystis Pyrifera Extract', 'Restores vital trace minerals and reinforces lipid moisture barrier', true, true),
  ('e1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'Cold-Pressed Bergamot Peel', 'Citrus Bergamia Peel Oil', 'Natural antiseptic astringent with uplifting aromatic notes', true, true),
  ('e1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002', 'Alpine Lavender Essential Oil', 'Lavandula Angustifolia Oil', 'Soothes dermal inflammation and alleviates cellular stress', true, true),
  ('e1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000002', 'Raw Unrefined Shea Butter', 'Butyrospermum Parkii Butter', 'Rich in fatty acids A, E, F for intensive lipid replenishing', true, true),
  ('e1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000003', 'Icelandic Volcanic Ash', 'Pumice', 'Ultra-fine physical exfoliator absorbing surface impurities', true, true)
ON CONFLICT (id) DO NOTHING;
