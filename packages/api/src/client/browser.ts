import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@cinmax/types';

const DEFAULT_SUPABASE_URL = 'https://nthyavlzdgucrldtgjeo.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aHlhdmx6ZGd1Y3JsZHRnamVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NTU2MDAsImV4cCI6MjEwMTMzMTYwMH0.XzL0nuUOnksJLgsT9tGlsi4-adHtosCjV4fk9-MXClc';

let browserClientInstance: SupabaseClient<Database> | null = null;

function isCleanString(val?: string | null): boolean {
  if (!val) return false;
  const s = val.trim();
  return (
    s.length > 0 &&
    !s.includes('your-project') &&
    !s.includes('your-supabase') &&
    !s.includes('sb_publishable')
  );
}

/**
 * Creates a Supabase client for Client Components in Next.js / Expo browser context.
 */
export function createCinmaxBrowserClient(
  supabaseUrl?: string,
  supabaseAnonKey?: string
): SupabaseClient<Database> {
  const url =
    (isCleanString(supabaseUrl) ? supabaseUrl! : null) ||
    (isCleanString(process.env.NEXT_PUBLIC_SUPABASE_URL) ? process.env.NEXT_PUBLIC_SUPABASE_URL! : null) ||
    (isCleanString(process.env.EXPO_PUBLIC_SUPABASE_URL) ? process.env.EXPO_PUBLIC_SUPABASE_URL! : null) ||
    DEFAULT_SUPABASE_URL;

  const key =
    (isCleanString(supabaseAnonKey) ? supabaseAnonKey! : null) ||
    (isCleanString(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! : null) ||
    (isCleanString(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) ? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY! : null) ||
    DEFAULT_SUPABASE_ANON_KEY;

  return createClient<Database>(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: typeof window !== 'undefined',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  });
}

/**
 * Returns singleton or safe instance of Supabase browser client
 */
export function getSupabaseBrowserClient(): SupabaseClient<Database> | null {
  if (typeof window === 'undefined') return null;

  if (!browserClientInstance) {
    browserClientInstance = createCinmaxBrowserClient();
  }
  return browserClientInstance;
}
