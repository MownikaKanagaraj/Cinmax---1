import type { SupabaseClient } from '@supabase/supabase-js';
import type { CustomerProfile } from '@cinmax/types';

export async function fetchCurrentProfile(
  supabase: SupabaseClient,
  userId?: string
): Promise<CustomerProfile | null> {
  if (!userId) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;
  return data as unknown as CustomerProfile;
}
