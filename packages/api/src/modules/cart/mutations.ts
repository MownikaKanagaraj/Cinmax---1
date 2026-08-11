import type { SupabaseClient } from '@supabase/supabase-js';
import type { AddToCartPayload, UpdateCartItemQuantityPayload } from './types';

export async function addCartItem(
  supabase: SupabaseClient,
  payload: AddToCartPayload
) {
  // Add item mutation adapter
  const { data, error } = await supabase
    .from('cart_items')
    .insert({
      cart_id: payload.cartId,
      product_id: payload.product.id,
      variant_id: payload.variant.id,
      quantity: payload.quantity ?? 1,
      unit_price: payload.variant.price,
      total_price: payload.variant.price * (payload.quantity ?? 1),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCartItemQuantity(
  supabase: SupabaseClient,
  payload: UpdateCartItemQuantityPayload
) {
  if (payload.quantity <= 0) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', payload.cartItemId);
    if (error) throw error;
    return null;
  }

  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity: payload.quantity })
    .eq('id', payload.cartItemId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
