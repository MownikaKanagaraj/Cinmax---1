import type { SupabaseClient } from '@supabase/supabase-js';
import type { UpdateCustomerProfilePayload } from './types';

export async function updateCustomerProfile(
  supabase: SupabaseClient,
  payload: UpdateCustomerProfilePayload
) {
  const { userId, ...updates } = payload;
  const { data, error } = await supabase
    .from('profiles')
    .update({
      first_name: updates.firstName,
      last_name: updates.lastName,
      phone: updates.phone,
      avatar_url: updates.avatarUrl,
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
