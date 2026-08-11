import type { SupabaseClient } from '@supabase/supabase-js';
import type { Product } from '@cinmax/types';

export async function fetchUserWishlist(
  supabase: SupabaseClient,
  userId: string
): Promise<Product[]> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('wishlist_product_ids')
    .eq('id', userId)
    .single();

  if (!profile?.wishlist_product_ids?.length) return [];

  const { data: products } = await supabase
    .from('products')
    .select('*, product_images(*), product_variants(*)')
    .in('id', profile.wishlist_product_ids);

  return (products as any) || [];
}
