import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@cinmax/types';
import type { SupabaseClient } from '@supabase/supabase-js';

let browserClientInstance: SupabaseClient<Database> | null = null;

/**
 * Creates a Supabase client for Client Components in Next.js browser context.
 */
export function createCinmaxBrowserClient(
  supabaseUrl?: string,
  supabaseAnonKey?: string
): SupabaseClient<Database> {
  const url =
    supabaseUrl ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.EXPO_PUBLIC_SUPABASE_URL ||
    'https://nthyavlzdgucrldtgjeo.supabase.co';
  const key =
    supabaseAnonKey ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
    'sb_publishable_pKmwUvTt3Dz7A-XYJmXQDQ_yWZpK_mB';

  return createBrowserClient<Database>(url, key);
}

/**
 * Returns singleton or safe instance of Supabase browser client
 */
export function getSupabaseBrowserClient(): SupabaseClient<Database> | null {
  if (typeof window === 'undefined') return null;
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.EXPO_PUBLIC_SUPABASE_URL ||
    'https://nthyavlzdgucrldtgjeo.supabase.co';
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
    'sb_publishable_pKmwUvTt3Dz7A-XYJmXQDQ_yWZpK_mB';
  if (!url || !key) return null;

  if (!browserClientInstance) {
    browserClientInstance = createCinmaxBrowserClient(url, key);
  }
  return browserClientInstance;
}
