const { createClient } = require('@supabase/supabase-js');

const url = 'https://nthyavlzdgucrldtgjeo.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aHlhdmx6ZGd1Y3JsZHRnamVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTc1NTYwMCwiZXhwIjoyMTAxMzMxNjAwfQ.WhVVQo2bsvvo3NN8isPSbaQNUPef8MloYdjG3B_LaU0';
const supabase = createClient(url, key);

function paginateArray(items, params) {
  const page = Math.max(1, params?.page || 1);
  const pageSize = params?.pageSize !== undefined
    ? Math.max(1, Math.min(100, params.pageSize))
    : (params?.page ? 12 : Math.max(100, items.length));
  const totalCount = items.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIndex = (page - 1) * pageSize;
  const paginatedItems = items.slice(startIndex, startIndex + pageSize);

  return {
    items: paginatedItems,
    meta: {
      page,
      pageSize,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

async function testFetch() {
  const { data, error } = await supabase.from('products').select(`
    *,
    category:categories(*),
    variants:product_variants(*),
    images:product_images(*)
  `).eq('is_active', true).order('is_featured', { ascending: false }).order('created_at', { ascending: false });

  const paginated = paginateArray(data, undefined);
  console.log('Total returned in paginated result without params:', paginated.items.length);
  console.log('Total count in DB:', paginated.meta.totalCount);
  console.log('Total pages:', paginated.meta.totalPages);
  
  console.log('\n--- 11 SOAPS IN PAGINATED RESULT ---');
  paginated.items.forEach((p, idx) => {
    console.log(`${idx + 1}. ${p.title} (${p.slug}) | Price: ₹${p.base_price} | Cat: ${p.category?.name} | Img: ${p.images?.[0]?.url?.slice(0, 45)}...`);
  });
}
testFetch().catch(console.error);
