import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { Database } from '@cinmax/types';

export interface CookieStoreAdapter {
  get(name: string): { value: string } | undefined | Promise<{ value: string } | undefined>;
  set(name: string, value: string, options: CookieOptions): void | Promise<void>;
  remove(name: string, options: CookieOptions): void | Promise<void>;
}

/**
 * Creates a Supabase client for Server Components, Server Actions, and Route Handlers in Next.js.
 */
export function createCinmaxServerClient(
  cookieStore: CookieStoreAdapter,
  options?: {
    supabaseUrl?: string;
    supabaseAnonKey?: string;
    useServiceRole?: boolean;
  }
) {
  const url = options?.supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-cinmax.supabase.co';
  const key = options?.useServiceRole
    ? process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-role-key'
    : options?.supabaseAnonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';

  return createServerClient<Database>(url, key, {
    cookies: {
      async get(name: string) {
        const cookie = await cookieStore.get(name);
        return cookie?.value;
      },
      async set(name: string, value: string, options: CookieOptions) {
        try {
          await cookieStore.set(name, value, options);
        } catch {
          // Handled for Server Components where set is restricted
        }
      },
      async remove(name: string, options: CookieOptions) {
        try {
          await cookieStore.remove(name, options);
        } catch {
          // Handled for Server Components where remove is restricted
        }
      },
    },
  });
}
