-- ====================================================================
-- CINMAX Database Migration: Minimum Order Quantity & Dispatch Time
-- Adds min_order_quantity & quantity_price to products
-- Creates app_settings with dispatch_time_days
-- ====================================================================

-- 1. Products table additions
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS min_order_quantity INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS quantity_price NUMERIC NULL;

UPDATE public.products 
SET min_order_quantity = 1 
WHERE min_order_quantity IS NULL;

-- 2. App Settings table
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

-- 3. Update home_marketing_settings jsonb with default dispatchTimeDays
UPDATE public.home_marketing_settings
SET settings = jsonb_set(
  settings,
  '{dispatchTimeDays}',
  COALESCE(settings->'dispatchTimeDays', '20'::jsonb)
)
WHERE id = 'default';
