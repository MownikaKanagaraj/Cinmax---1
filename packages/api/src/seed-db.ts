import { createClient } from '@supabase/supabase-js';
import { CENTRAL_COUPON_CONFIGS } from './config/coupons.config';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nthyavlzdgucrldtgjeo.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aHlhdmx6ZGd1Y3JsZHRnamVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTc1NTYwMCwiZXhwIjoyMTAxMzMxNjAwfQ.WhVVQo2bsvvo3NN8isPSbaQNUPef8MloYdjG3B_LaU0';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function seed() {
  console.log('🌱 Starting Supabase Database Seed...');

  // 1. Categories
  const categories = [
    { id: 'c1000000-0000-0000-0000-000000000001', slug: 'cold-process-soaps', name: 'Cold-Process Soaps', description: 'Traditional artisanal cold-cured botanical soap bars retaining pure natural glycerin.', sort_order: 1, is_active: true },
    { id: 'c1000000-0000-0000-0000-000000000002', slug: 'liquid-body-washes', name: 'Botanical Body Washes', description: 'Sulfate-free foaming washes enriched with aloe vera and essential oils.', sort_order: 2, is_active: true },
    { id: 'c1000000-0000-0000-0000-000000000003', slug: 'body-butters-balms', name: 'Restorative Butters & Balms', description: 'Whipped shea and kokum body butters formulated for deep barrier repair.', sort_order: 3, is_active: true },
    { id: 'c1000000-0000-0000-0000-000000000004', slug: 'exfoliating-bars', name: 'Exfoliating Scrub Bars', description: 'Pumice, French clay, and poppy seed textured bars for cellular rejuvenation.', sort_order: 4, is_active: true },
  ];

  const { error: catErr } = await supabase.from('categories').upsert(categories, { onConflict: 'id' });
  if (catErr) console.error('Error seeding categories:', catErr.message);
  else console.log('✅ Categories seeded successfully.');

  // 2. Products
  const products = [
    {
      id: 'p1000000-0000-0000-0000-000000000001',
      slug: 'azure-marine-botanical-bar',
      title: 'Azure Marine Botanical Bar',
      subtitle: 'Mineral-Rich Sea Kelp & Mediterranean Bergamot',
      description: 'Handcrafted over a 6-week slow cold-cure process. Infused with wild-harvested Atlantic kelp, cold-pressed virgin olive oil, and organic bergamot peel.',
      how_to_use: 'Lather between wet palms or with a natural sisal pouch.',
      process_type: 'cold-process',
      category_id: 'c1000000-0000-0000-0000-000000000001',
      base_price: 399.00,
      compare_at_price: 499.00,
      skin_types: ['all', 'normal', 'dry'],
      fragrance_family: 'aquatic',
      certifications: ['USDA Organic Oils', 'Cruelty-Free', '100% Biodegradable'],
      is_featured: true,
      is_new: true,
      average_rating: 4.95,
      review_count: 128,
    },
    {
      id: 'p1000000-0000-0000-0000-000000000002',
      slug: 'french-lavender-cashmere-soap',
      title: 'French Lavender & Cashmere Soap',
      subtitle: 'High-Altitude Provence Lavender & Whipped Shea',
      description: 'A soothing sanctuary bar blending French alpine lavender essential oil with unrefined Ghanaian shea butter.',
      how_to_use: 'Gentle enough for daily face and body use.',
      process_type: 'cold-process',
      category_id: 'c1000000-0000-0000-0000-000000000001',
      base_price: 349.00,
      compare_at_price: 449.00,
      skin_types: ['all', 'sensitive', 'dry'],
      fragrance_family: 'floral',
      certifications: ['USDA Organic Oils', 'Vegan Certified'],
      is_featured: true,
      is_new: false,
      average_rating: 4.88,
      review_count: 94,
    },
    {
      id: 'p1000000-0000-0000-0000-000000000003',
      slug: 'nordic-pine-volcanic-ash-scrub',
      title: 'Nordic Pine & Volcanic Ash Scrub',
      subtitle: 'Deep Detoxification & Cellular Renewal',
      description: 'Triple-milled bar embedded with Icelandic black volcanic ash and Siberian fir needle oil to purge pores.',
      how_to_use: 'Glide directly over rough areas 2-3 times per week.',
      process_type: 'triple-milled',
      category_id: 'c1000000-0000-0000-0000-000000000004',
      base_price: 449.00,
      compare_at_price: 549.00,
      skin_types: ['oily', 'combination'],
      fragrance_family: 'woody',
      certifications: ['100% Natural Origin', 'Microplastic-Free'],
      is_featured: true,
      is_new: true,
      average_rating: 4.91,
      review_count: 76,
    },
  ];

  const { error: prodErr } = await supabase.from('products').upsert(products, { onConflict: 'id' });
  if (prodErr) console.error('Error seeding products:', prodErr.message);
  else console.log('✅ Products seeded successfully.');

  // 2b. Product Images
  const productImages = [
    { id: 'img1000000-0000-0000-0000-000000000001', product_id: 'p1000000-0000-0000-0000-000000000001', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80', alt: 'Azure Marine Botanical Bar', sort_order: 1, is_primary: true },
    { id: 'img1000000-0000-0000-0000-000000000002', product_id: 'p1000000-0000-0000-0000-000000000002', url: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800&auto=format&fit=crop&q=80', alt: 'French Lavender & Cashmere Soap', sort_order: 1, is_primary: true },
    { id: 'img1000000-0000-0000-0000-000000000003', product_id: 'p1000000-0000-0000-0000-000000000003', url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop&q=80', alt: 'Nordic Pine & Volcanic Ash Scrub', sort_order: 1, is_primary: true },
  ];

  const { error: imgErr } = await supabase.from('product_images').upsert(productImages, { onConflict: 'id' });
  if (imgErr) console.log('Notice: product_images seed:', imgErr.message);
  else console.log('✅ Product images seeded successfully.');

  // 3. Product Variants
  const variants = [
    { id: 'v1000000-0000-0000-0000-000000000001', product_id: 'p1000000-0000-0000-0000-000000000001', sku: 'CNX-COLD-AZUR-150', title: 'Single Bar (150g / 5.3 oz)', weight_grams: 150, price: 399.00, compare_at_price: 499.00, inventory_quantity: 450, is_available: true },
    { id: 'v1000000-0000-0000-0000-000000000002', product_id: 'p1000000-0000-0000-0000-000000000001', sku: 'CNX-COLD-AZUR-3PK', title: 'Trio Bundle (3 x 150g)', weight_grams: 450, price: 999.00, compare_at_price: 1299.00, inventory_quantity: 180, is_available: true },
    { id: 'v1000000-0000-0000-0000-000000000003', product_id: 'p1000000-0000-0000-0000-000000000002', sku: 'CNX-COLD-LAVN-150', title: 'Single Bar (150g / 5.3 oz)', weight_grams: 150, price: 349.00, compare_at_price: 449.00, inventory_quantity: 320, is_available: true },
    { id: 'v1000000-0000-0000-0000-000000000004', product_id: 'p1000000-0000-0000-0000-000000000003', sku: 'CNX-EXFO-PINE-170', title: 'Single Bar (170g / 6.0 oz)', weight_grams: 170, price: 449.00, compare_at_price: 549.00, inventory_quantity: 210, is_available: true },
  ];

  const { error: varErr } = await supabase.from('product_variants').upsert(variants, { onConflict: 'id' });
  if (varErr) console.error('Error seeding product_variants:', varErr.message);
  else console.log('✅ Product variants seeded successfully.');

  // 4. Coupons
  const coupons = CENTRAL_COUPON_CONFIGS.map((c) => ({
    id: c.id,
    code: c.code,
    discount_type: c.discountType,
    discount_value: c.discountValue,
    min_order_amount: c.minOrderAmount || 0,
    is_active: c.isActive,
  }));

  const { error: cpnErr } = await supabase.from('coupons').upsert(coupons, { onConflict: 'id' });
  if (cpnErr) console.error('Error seeding coupons:', cpnErr.message);
  else console.log('✅ Coupons seeded successfully.');

  // 5. Customer Profiles
  const profiles = [
    { id: '00000000-0000-0000-0000-000000000001', email: 'aurora.vance@cinmax.luxury', first_name: 'Aurora', last_name: 'Vance', role: 'customer', loyalty_tier: 'gold', loyalty_points: 480 },
    { id: '00000000-0000-0000-0000-000000000002', email: 'j.sterling@designsanctuary.com', first_name: 'Julian', last_name: 'Sterling', role: 'customer', loyalty_tier: 'silver', loyalty_points: 198 },
    { id: '00000000-0000-0000-0000-000000000003', email: 'elena@rostovastudio.co.uk', first_name: 'Elena', last_name: 'Rostova', role: 'customer', loyalty_tier: 'platinum', loyalty_points: 890 },
  ];

  const { error: profErr } = await supabase.from('profiles').upsert(profiles, { onConflict: 'id' });
  if (profErr) console.error('Error seeding profiles:', profErr.message);
  else console.log('✅ Customer profiles seeded successfully.');

  console.log('🎉 Supabase Database Seed Completed Cleanly!');
}

seed().catch(console.error);
