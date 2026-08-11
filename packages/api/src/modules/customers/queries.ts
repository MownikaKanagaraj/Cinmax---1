import type { SupabaseClient } from '@supabase/supabase-js';
import type { CustomerProfile } from '@cinmax/types';

export async function fetchCustomersList(
  supabase: SupabaseClient
): Promise<CustomerProfile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as unknown as CustomerProfile[];
}

export async function fetchCustomerDetails(
  supabase: SupabaseClient,
  userId: string
): Promise<CustomerProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;
  return data as unknown as CustomerProfile;
}
