import type { SupabaseClient } from '@supabase/supabase-js';
import type { Cart } from '@cinmax/types';

export async function fetchActiveCart(
  supabase: SupabaseClient,
  cartIdOrUserId: string
): Promise<Cart | null> {
  const { data: cart } = await supabase
    .from('carts')
    .select('*, cart_items(*)')
    .or(`id.eq.${cartIdOrUserId},user_id.eq.${cartIdOrUserId}`)
    .single();

  if (!cart) return null;
  return cart as unknown as Cart;
}
