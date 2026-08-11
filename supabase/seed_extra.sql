-- ==============================================================================
-- Additional Seed Data for Coupons, Customer Profiles, and Reviews
-- ==============================================================================

-- 1. Coupons
INSERT INTO public.coupons (id, code, discount_type, discount_value, min_order_amount, is_active)
VALUES
  ('cp_welcome10', 'WELCOME10', 'percentage', 10.00, 50.00, true),
  ('cp_botanical20', 'BOTANICAL20', 'percentage', 20.00, 100.00, true),
  ('cp_luxesummer', 'LUXESUMMER', 'fixed_amount', 15.00, 75.00, true)
ON CONFLICT (code) DO NOTHING;

-- 2. Customer Profiles
INSERT INTO public.profiles (id, email, first_name, last_name, role, loyalty_tier, loyalty_points)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'aurora.vance@cinmax.luxury', 'Aurora', 'Vance', 'customer', 'gold', 480),
  ('00000000-0000-0000-0000-000000000002', 'j.sterling@designsanctuary.com', 'Julian', 'Sterling', 'customer', 'silver', 198),
  ('00000000-0000-0000-0000-000000000003', 'elena@rostovastudio.co.uk', 'Elena', 'Rostova', 'customer', 'platinum', 890)
ON CONFLICT (id) DO NOTHING;

-- 3. Verified Customer Reviews
INSERT INTO public.reviews (id, product_id, author_id, author_name, rating, title, content, is_approved, is_verified_purchase)
VALUES
  ('r1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Aurora Vance', 5, 'French Green Clay & Eucalyptus Bar', 'The lather is beyond luxurious. Truly the best cold process bar I have ever used.', true, true),
  ('r1000000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'David K.', 5, 'Activated Charcoal & Tea Tree Bar', 'Clears skin without over-drying. Fantastic natural aroma.', true, true)
ON CONFLICT (id) DO NOTHING;
