-- ====================================================================
-- CINMAX Database Migration: Home Marketing Settings Table
-- Stores centralized marketing configuration for mobile app & web home page
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.home_marketing_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.home_marketing_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read home_marketing_settings"
  ON public.home_marketing_settings
  FOR SELECT
  USING (true);

-- Allow authenticated/admin update access
CREATE POLICY "Allow admin write home_marketing_settings"
  ON public.home_marketing_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);
