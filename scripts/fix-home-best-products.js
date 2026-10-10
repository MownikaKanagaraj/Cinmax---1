const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://nthyavlzdgucrldtgjeo.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aHlhdmx6ZGd1Y3JsZHRnamVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTc1NTYwMCwiZXhwIjoyMTAxMzMxNjAwfQ.WhVVQo2bsvvo3NN8isPSbaQNUPef8MloYdjG3B_LaU0';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Curated unique high-resolution botanical soap images for each of the 11 CINMAX soap products
const SOAP_CATALOG_DATA = [
  {
    id: 'd72e3a9c-edf2-469f-985b-8dd5ea1c1822',
    slug: 'aroma-soap',
    title: 'Aroma Soap',
    subtitle: 'Organic Essential Oil Blend & Shea Butter',
    description: 'Formulated with pure aromatherapy-grade botanical essential oils to soothe senses and gently cleanse without stripping natural skin moisture.',
    base_price: 249,
    compare_at_price: 299,
    skin_types: ['all', 'sensitive', 'normal'],
    fragrance_family: 'floral',
    is_featured: true,
    is_new: false,
    average_rating: 4.95,
    review_count: 142,
    imageUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&auto=format&fit=crop&q=80',
    stock: 50
  },
  {
    id: 'de25a5f5-b39f-42d1-910e-c35adb92ab68',
    slug: 'aloe-vera-soap',
    title: 'Aloe Vera Soap',
    subtitle: 'Fresh Pure Aloe Gel & Coconut Oil',
    description: 'Cold-saponified with pure extracted aloe vera leaf pulp and virgin cold-pressed coconut oil for deep cooling hydration.',
    base_price: 249,
    compare_at_price: 299,
    skin_types: ['all', 'dry', 'sensitive'],
    fragrance_family: 'herbal',
    is_featured: true,
    is_new: false,
    average_rating: 4.92,
    review_count: 118,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
    stock: 50
  },
  {
    id: '1725e950-d1ee-4416-833c-bbe4388789e8',
    slug: 'kasturi-manjal-soap',
    title: 'Kasturi Manjal Soap',
    subtitle: 'Wild Turmeric & Kashmiri Saffron',
    description: 'Traditional Ayurvedic formulation featuring wild Kasturi turmeric known for brightening complexion and reducing blemishes.',
    base_price: 299,
    compare_at_price: 349,
    skin_types: ['all', 'oily', 'combination'],
    fragrance_family: 'herbal',
    is_featured: true,
    is_new: false,
    average_rating: 4.98,
    review_count: 184,
    imageUrl: 'https://images.unsplash.com/photo-1607006482172-35891d9e1158?w=600&auto=format&fit=crop&q=80',
    stock: 45
  },
  {
    id: '1c873642-d6c5-4f83-aaf0-71114c793e97',
    slug: 'neem-oil-soap',
    title: 'Neem Oil Soap',
    subtitle: 'Cold-Pressed Organic Neem & Basil',
    description: 'Antimicrobial clarifying bar made with organic cold-pressed neem seed oil to soothe acne-prone skin and purify pores.',
    base_price: 249,
    compare_at_price: 299,
    skin_types: ['oily', 'acne-prone', 'combination'],
    fragrance_family: 'herbal',
    is_featured: true,
    is_new: false,
    average_rating: 4.89,
    review_count: 96,
    imageUrl: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=600&auto=format&fit=crop&q=80',
    stock: 40
  },
  {
    id: '9dd0c291-7b4f-44ec-98a3-8003b51c9b18',
    slug: 'manjistha-soap',
    title: 'Manjistha Soap',
    subtitle: 'Indian Madder Root & Red Sandalwood',
    description: 'Detoxifying Ayurvedic bar powered by wild Manjistha root extract to enhance natural skin glow and even skin tone.',
    base_price: 299,
    compare_at_price: 349,
    skin_types: ['all', 'dull', 'mature'],
    fragrance_family: 'woody',
    is_featured: true,
    is_new: false,
    average_rating: 4.94,
    review_count: 110,
    imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&auto=format&fit=crop&q=80',
    stock: 35
  },
  {
    id: 'd8ed71e3-f452-4249-af7e-94aecd665888',
    slug: 'charcoal-soap',
    title: 'Charcoal Soap',
    subtitle: 'Activated Bamboo Charcoal & Tea Tree',
    description: 'Deep-pore detoxifying bar with microscopic activated bamboo charcoal that draws out impurities, toxins, and excess sebum.',
    base_price: 279,
    compare_at_price: 329,
    skin_types: ['oily', 'combination'],
    fragrance_family: 'earthy',
    is_featured: true,
    is_new: false,
    average_rating: 4.91,
    review_count: 125,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    stock: 45
  },
  {
    id: '34d5e22c-58f2-4303-8df9-89d3ffdfc9f8',
    slug: 'avarampoo-soap',
    title: 'Avarampoo Soap',
    subtitle: 'Golden Senna Auriculata & Sweet Almond',
    description: 'Formulated with sun-dried golden Avarampoo blossoms to treat skin pigmentation, sun damage, and dryness.',
    base_price: 289,
    compare_at_price: 339,
    skin_types: ['all', 'dry', 'sun-damaged'],
    fragrance_family: 'floral',
    is_featured: true,
    is_new: false,
    average_rating: 4.93,
    review_count: 104,
    imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80',
    stock: 40
  },
  {
    id: 'ccfa8b02-0910-49de-a697-d45ca057d274',
    slug: 'rose-soap',
    title: 'Rose Soap',
    subtitle: 'Damask Rose Petals & Rosehip Oil',
    description: 'Luxurious moisturizing bar infused with steam-distilled Damask rose water and organic rosehip seed oil.',
    base_price: 299,
    compare_at_price: 349,
    skin_types: ['all', 'dry', 'sensitive', 'mature'],
    fragrance_family: 'floral',
    is_featured: true,
    is_new: false,
    average_rating: 4.97,
    review_count: 165,
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80',
    stock: 55
  },
  {
    id: 'e6f52139-9335-4c93-b649-18db3bf028e7',
    slug: 'vettiver-soap',
    title: 'Vettiver Soap',
    subtitle: 'Earthy Khus Roots & Castor Oil',
    description: 'Cooling and grounding bar crafted with pure South Indian vetiver root extract to refresh tired skin and calm body heat.',
    base_price: 289,
    compare_at_price: 339,
    skin_types: ['all', 'normal', 'oily'],
    fragrance_family: 'earthy',
    is_featured: true,
    is_new: false,
    average_rating: 4.90,
    review_count: 88,
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
    stock: 40
  },
  {
    id: '9c7fdfc2-cedb-4670-bfbd-b5ca0313abff',
    slug: 'veppalai-soap',
    title: 'Veppalai Soap',
    subtitle: 'Wrightia Tinctoria & Extra Virgin Olive',
    description: 'Traditional Siddha formulation with Wrightia Tinctoria leaves known for deep skin barrier support and scaling relief.',
    base_price: 299,
    compare_at_price: 349,
    skin_types: ['sensitive', 'dry', 'problematic'],
    fragrance_family: 'herbal',
    is_featured: true,
    is_new: false,
    average_rating: 4.96,
    review_count: 132,
    imageUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80',
    stock: 35
  },
  {
    id: 'd79fd48e-ab4a-4572-9f8a-bc50ee56ae6e',
    slug: 'papaya-soap',
    title: 'Papaya Soap',
    subtitle: 'Natural Papain Enzyme & Kokum Butter',
    description: 'Gentle exfoliating enzyme bar with ripe papaya pulp and rich kokum butter to brighten dull skin and smooth texture.',
    base_price: 279,
    compare_at_price: 329,
    skin_types: ['all', 'dull', 'uneven'],
    fragrance_family: 'citrus',
    is_featured: true,
    is_new: false,
    average_rating: 4.92,
    review_count: 114,
    imageUrl: 'https://images.unsplash.com/photo-1512290900676-26c2a48f4134?w=600&auto=format&fit=crop&q=80',
    stock: 45
  }
];

async function runAuditFix() {
  console.log('=== FIXING SUPABASE PRODUCTS AND IMAGES ===');

  // 1. Deactivate demo / test products and audit duplicates
  const testSlugs = ['test-product', 'audited-herbal-bar-1787208313077', 'audited-herbal-bar-1787208332037'];
  const { error: deactErr } = await supabase
    .from('products')
    .update({ is_active: false, is_featured: false })
    .in('slug', testSlugs);

  if (deactErr) {
    console.error('Error deactivating test items:', deactErr);
  } else {
    console.log('✓ Successfully deactivated test/demo and duplicate audit products in Supabase.');
  }

  // 2. Also ensure any product with title containing "test" is deactivated
  const { error: testTitleErr } = await supabase
    .from('products')
    .update({ is_active: false, is_featured: false })
    .ilike('title', '%test product%');
  if (testTitleErr) console.error('Error deactivating test product by title:', testTitleErr);

  // 3. Update the 11 real CINMAX soaps with their unique images, pricing, and active status
  for (const soap of SOAP_CATALOG_DATA) {
    const { error: pErr } = await supabase
      .from('products')
      .update({
        title: soap.title,
        subtitle: soap.subtitle,
        description: soap.description,
        base_price: soap.base_price,
        compare_at_price: soap.compare_at_price,
        skin_types: soap.skin_types,
        fragrance_family: soap.fragrance_family,
        process_type: 'cold-process',
        is_active: true,
        is_featured: soap.is_featured,
        is_new: soap.is_new,
        average_rating: soap.average_rating,
        review_count: soap.review_count,
        category_id: 'c1000000-0000-0000-0000-000000000001'
      })
      .eq('id', soap.id);

    if (pErr) console.error(`Error updating product ${soap.title}:`, pErr);
    else console.log(`✓ Product updated: ${soap.title} (₹${soap.base_price})`);

    // Ensure variant exists & matches
    const { data: vars } = await supabase.from('product_variants').select('id').eq('product_id', soap.id);
    if (vars && vars.length > 0) {
      await supabase
        .from('product_variants')
        .update({
          price: soap.base_price,
          compare_at_price: soap.compare_at_price,
          inventory_quantity: soap.stock,
          is_available: true,
          title: 'Single Bar (100g)'
        })
        .eq('id', vars[0].id);
    } else {
      await supabase
        .from('product_variants')
        .insert({
          product_id: soap.id,
          sku: `CINMAX-${soap.slug.toUpperCase()}-100G`,
          title: 'Single Bar (100g)',
          price: soap.base_price,
          compare_at_price: soap.compare_at_price,
          inventory_quantity: soap.stock,
          is_available: true,
          weight_grams: 100
        });
    }

    // Ensure distinct product image exists & is primary
    const { data: existingImgs } = await supabase.from('product_images').select('id').eq('product_id', soap.id);
    if (existingImgs && existingImgs.length > 0) {
      await supabase
        .from('product_images')
        .update({
          url: soap.imageUrl,
          alt: `${soap.title} - Handcrafted Artisanal Soap`,
          is_primary: true
        })
        .eq('id', existingImgs[0].id);
    } else {
      await supabase
        .from('product_images')
        .insert({
          product_id: soap.id,
          url: soap.imageUrl,
          alt: `${soap.title} - Handcrafted Artisanal Soap`,
          is_primary: true,
          sort_order: 0
        });
    }
  }

  console.log('=== SUPABASE DATABASE AUDIT & FIX COMPLETED ===');
}

runAuditFix().catch(console.error);
