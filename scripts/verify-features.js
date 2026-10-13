const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const envPath = path.resolve(__dirname, '../apps/website/.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/^DATABASE_URL=(.+)$/m);
    if (match) return match[1].trim();
  }
  return null;
}

async function testVerification() {
  const connectionString = getDatabaseUrl();
  if (!connectionString) {
    console.error('DATABASE_URL not set in environment or apps/website/.env.local');
    process.exit(1);
  }

  const client = new Client({ connectionString });
  await client.connect();

  console.log('--- VERIFICATION: 1. MIN ORDER QUANTITY & QUANTITY PRICING ---');
  const prodRes = await client.query(`
    SELECT id, title, slug, base_price, min_order_quantity, quantity_price 
    FROM public.products 
    LIMIT 5;
  `);
  console.log('Sample Products:', prodRes.rows);

  console.log('\n--- VERIFICATION: 2. MINIMUM DISPATCH TIME ---');
  const appSettingsRes = await client.query(`
    SELECT id, dispatch_time_days, updated_at FROM public.app_settings;
  `);
  console.log('app_settings row:', appSettingsRes.rows);

  const homeMarketingRes = await client.query(`
    SELECT id, settings->>'dispatchTimeDays' as dispatch_time_days FROM public.home_marketing_settings LIMIT 1;
  `);
  console.log('home_marketing_settings dispatchTimeDays:', homeMarketingRes.rows);

  await client.end();
  console.log('\nVerification queries completed successfully!');
}

testVerification().catch((err) => {
  console.error('Error during verification:', err);
  process.exit(1);
});
