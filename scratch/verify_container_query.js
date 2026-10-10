const { getContainer } = require('./packages/api/src/di/container.ts');
// In node, let's test with the Supabase client directly
const { createClient } = require('@supabase/supabase-js');
const { SupabaseProductRepository } = require('./packages/api/src/modules/products/supabase.repository.ts');
const { ProductService } = require('./packages/api/src/services/product.service.ts');

const url = 'https://nthyavlzdgucrldtgjeo.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aHlhdmx6ZGd1Y3JsZHRnamVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTc1NTYwMCwiZXhwIjoyMTAxMzMxNjAwfQ.WhVVQo2bsvvo3NN8isPSbaQNUPef8MloYdjG3B_LaU0';
const supabase = createClient(url, key);

async function testContainer() {
  const repo = new SupabaseProductRepository(supabase);
  const result = await repo.getAll();
  console.log('Result total items returned:', result.items.length);
  console.log('Result totalCount meta:', result.meta.totalCount);
  console.log('Result totalPages meta:', result.meta.totalPages);
  result.items.forEach((p, idx) => {
    console.log(`${idx + 1}. ${p.title} (${p.slug}) - ₹${p.basePrice} [${p.category ? p.category.name : 'No Category'}] - ${p.images.length} images`);
  });
}

testContainer().catch(console.error);
