const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://nthyavlzdgucrldtgjeo.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aHlhdmx6ZGd1Y3JsZHRnamVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTc1NTYwMCwiZXhwIjoyMTAxMzMxNjAwfQ.WhVVQo2bsvvo3NN8isPSbaQNUPef8MloYdjG3B_LaU0';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function updateLegacyProducts() {
  const legacyUpdates = [
    {
      id: 'b1000000-0000-0000-0000-000000000001',
      base_price: 399,
      compare_at_price: 499,
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'b1000000-0000-0000-0000-000000000002',
      base_price: 349,
      compare_at_price: 449,
      imageUrl: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'b1000000-0000-0000-0000-000000000003',
      base_price: 449,
      compare_at_price: 549,
      imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&auto=format&fit=crop&q=80',
    },
  ];

  for (const item of legacyUpdates) {
    await supabase
      .from('products')
      .update({
        base_price: item.base_price,
        compare_at_price: item.compare_at_price,
      })
      .eq('id', item.id);

    const { data: existingImgs } = await supabase
      .from('product_images')
      .select('id')
      .eq('product_id', item.id);

    if (existingImgs && existingImgs.length > 0) {
      await supabase
        .from('product_images')
        .update({ url: item.imageUrl, is_primary: true })
        .eq('id', existingImgs[0].id);
    } else {
      await supabase.from('product_images').insert({
        product_id: item.id,
        url: item.imageUrl,
        alt: 'Botanical Soap Bar',
        is_primary: true,
        sort_order: 0,
      });
    }
  }

  console.log('✓ Legacy products updated with INR prices and images');
}

updateLegacyProducts().catch(console.error);
