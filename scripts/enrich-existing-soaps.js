const { createClient } = require('@supabase/supabase-js');

const url = 'https://nthyavlzdgucrldtgjeo.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aHlhdmx6ZGd1Y3JsZHRnamVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTc1NTYwMCwiZXhwIjoyMTAxMzMxNjAwfQ.WhVVQo2bsvvo3NN8isPSbaQNUPef8MloYdjG3B_LaU0';
const supabase = createClient(url, serviceKey);

const soapsData = [
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
    imageUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&auto=format&fit=crop&q=80',
    stock: 45
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
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1607006482172-35891d9e1158?w=600&auto=format&fit=crop&q=80',
    stock: 35
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
    imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&auto=format&fit=crop&q=80',
    stock: 30
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
    imageUrl: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=600&auto=format&fit=crop&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&auto=format&fit=crop&q=80',
    stock: 35
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
    imageUrl: 'https://images.unsplash.com/photo-1607006482172-35891d9e1158?w=600&auto=format&fit=crop&q=80',
    stock: 50
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
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&auto=format&fit=crop&q=80',
    stock: 30
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
    imageUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&auto=format&fit=crop&q=80',
    stock: 45
  }
];

async function updateExistingSoaps() {
  console.log('--- Updating Existing 11 Soaps in Supabase ---');
  
  for (const s of soapsData) {
    // 1. Update products table
    const { error: pErr } = await supabase
      .from('products')
      .update({
        subtitle: s.subtitle,
        description: s.description,
        base_price: s.base_price,
        compare_at_price: s.compare_at_price,
        skin_types: s.skin_types,
        fragrance_family: s.fragrance_family,
        process_type: 'cold-process',
        is_active: true,
        category_id: 'c1000000-0000-0000-0000-000000000001'
      })
      .eq('id', s.id);

    if (pErr) console.error(`Error updating product ${s.title}:`, pErr);
    else console.log(`✓ Updated product: ${s.title}`);

    // 2. Update existing variant or insert if none
    const { data: existingVars } = await supabase
      .from('product_variants')
      .select('id')
      .eq('product_id', s.id);

    if (existingVars && existingVars.length > 0) {
      await supabase
        .from('product_variants')
        .update({
          price: s.base_price,
          compare_at_price: s.compare_at_price,
          inventory_quantity: s.stock,
          is_available: true,
          title: 'Single Bar (100g)'
        })
        .eq('id', existingVars[0].id);
    } else {
      await supabase
        .from('product_variants')
        .insert({
          product_id: s.id,
          sku: `CINMAX-${s.slug.toUpperCase()}-100G`,
          title: 'Single Bar (100g)',
          price: s.base_price,
          compare_at_price: s.compare_at_price,
          inventory_quantity: s.stock,
          is_available: true,
          weight_grams: 100
        });
    }

    // 3. Update existing image or insert if none
    const { data: existingImgs } = await supabase
      .from('product_images')
      .select('id')
      .eq('product_id', s.id);

    if (existingImgs && existingImgs.length > 0) {
      await supabase
        .from('product_images')
        .update({
          url: s.imageUrl,
          alt: s.title,
          is_primary: true
        })
        .eq('id', existingImgs[0].id);
    } else {
      await supabase
        .from('product_images')
        .insert({
          product_id: s.id,
          url: s.imageUrl,
          alt: s.title,
          is_primary: true,
          sort_order: 0
        });
    }
  }

  console.log('\n--- ALL 11 EXISTING SOAPS SUCCESSFULLY ENRICHED ---');
}

updateExistingSoaps().catch(console.error);
