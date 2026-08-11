import { createClient } from '@supabase/supabase-js';
import type { Database } from '@cinmax/types';

export interface MobileStorageAdapter {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

/**
 * Creates a Supabase client for React Native Expo Mobile App with persistent storage adapter.
 */
export function createCinmaxMobileClient(
  supabaseUrl: string,
  supabaseAnonKey: string,
  storage: MobileStorageAdapter
) {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}
