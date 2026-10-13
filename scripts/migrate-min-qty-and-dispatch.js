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

async function runMigration() {
  const connectionString = getDatabaseUrl();
  if (!connectionString) {
    console.error('DATABASE_URL not found');
    process.exit(1);
  }

  const client = new Client({ connectionString });
  await client.connect();
  console.log('Successfully connected to Postgres database.');

  // 1. Add min_order_quantity and quantity_price to products
  console.log('Ensuring min_order_quantity & quantity_price columns exist in products...');
  await client.query(`
    ALTER TABLE public.products 
    ADD COLUMN IF NOT EXISTS min_order_quantity INTEGER DEFAULT 1,
    ADD COLUMN IF NOT EXISTS quantity_price NUMERIC NULL;
  `);

  await client.query(`
    UPDATE public.products 
    SET min_order_quantity = 1 
    WHERE min_order_quantity IS NULL;
  `);
  console.log('products columns ready.');

  // 2. Create app_settings table
  console.log('Ensuring app_settings table exists...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.app_settings (
      id TEXT PRIMARY KEY DEFAULT 'default',
      app_name TEXT DEFAULT 'CINMAX Global Products',
      currency TEXT DEFAULT 'INR',
      tax_rate NUMERIC DEFAULT 0,
      free_shipping_threshold NUMERIC DEFAULT 499,
      standard_shipping_fee NUMERIC DEFAULT 60,
      contact_email TEXT DEFAULT 'concierge@cinmaxglobal.com',
      support_phone TEXT DEFAULT '+91 98765 43210',
      dispatch_time_days INTEGER DEFAULT 20,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'app_settings' AND policyname = 'Allow public read app_settings') THEN
        CREATE POLICY "Allow public read app_settings" ON public.app_settings FOR SELECT USING (true);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'app_settings' AND policyname = 'Allow all write app_settings') THEN
        CREATE POLICY "Allow all write app_settings" ON public.app_settings FOR ALL USING (true) WITH CHECK (true);
      END IF;
    END $$;

    INSERT INTO public.app_settings (id, app_name, currency, tax_rate, free_shipping_threshold, standard_shipping_fee, contact_email, support_phone, dispatch_time_days)
    VALUES ('default', 'CINMAX Global Products', 'INR', 0, 499, 60, 'concierge@cinmaxglobal.com', '+91 98765 43210', 20)
    ON CONFLICT (id) DO UPDATE SET 
      dispatch_time_days = COALESCE(public.app_settings.dispatch_time_days, 20);
  `);
  console.log('app_settings table ready.');

  // 3. Update home_marketing_settings jsonb with dispatchTimeDays = 20 if missing
  console.log('Updating home_marketing_settings dispatchTimeDays...');
  await client.query(`
    UPDATE public.home_marketing_settings
    SET settings = jsonb_set(
      settings,
      '{dispatchTimeDays}',
      COALESCE(settings->'dispatchTimeDays', '20'::jsonb)
    )
    WHERE id = 'default';
  `);
  console.log('home_marketing_settings updated.');

  const res = await client.query('SELECT id, dispatch_time_days FROM public.app_settings WHERE id = $1', ['default']);
  console.log('Active dispatch time in app_settings:', res.rows[0]);

  await client.end();
  console.log('Migration completed successfully.');
}

runMigration().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
