import type { SupabaseClient } from '@supabase/supabase-js';
import type { ToggleWishlistPayload } from './types';

export async function toggleWishlistProduct(
  supabase: SupabaseClient,
  payload: ToggleWishlistPayload
) {
  if (!payload.userId) return;

  const { data: profile } = await supabase
    .from('profiles')
    .select('wishlist_product_ids')
    .eq('id', payload.userId)
    .single();

  const currentIds: string[] = profile?.wishlist_product_ids || [];
  const exists = currentIds.includes(payload.productId);
  const updatedIds = exists
    ? currentIds.filter((id) => id !== payload.productId)
    : [...currentIds, payload.productId];

  const { error } = await supabase
    .from('profiles')
    .update({ wishlist_product_ids: updatedIds })
    .eq('id', payload.userId);

  if (error) throw error;
  return updatedIds;
}
