import type { SupabaseClient } from '@supabase/supabase-js';
import type { CreateOrderPayload, UpdateOrderStatusPayload } from './types';
import { generateOrderNumber } from '@cinmax/utils';

export async function createOrder(
  supabase: SupabaseClient,
  payload: CreateOrderPayload
) {
  const orderNumber = generateOrderNumber();
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: payload.userId,
      guest_email: payload.guestEmail,
      status: 'pending',
      payment_status: 'paid',
      payment_method: payload.paymentMethod,
      subtotal: payload.subtotal,
      discount_total: payload.discountTotal,
      tax_total: payload.taxTotal,
      shipping_total: payload.shippingTotal,
      grand_total: payload.grandTotal,
      shipping_address: payload.shippingAddress,
      billing_address: payload.billingAddress,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // Insert Order Items
  const itemsToInsert = payload.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    variant_id: item.variantId,
    product_title: item.product.title,
    variant_title: item.variant.title,
    sku: item.variant.sku,
    unit_price: item.unitPrice,
    quantity: item.quantity,
    total_price: item.totalPrice,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(itemsToInsert);

  if (itemsError) throw itemsError;
  return order;
}

export async function updateOrderStatus(
  supabase: SupabaseClient,
  payload: UpdateOrderStatusPayload
) {
  const { data, error } = await supabase
    .from('orders')
    .update({
      status: payload.status,
      tracking_number: payload.trackingNumber,
      carrier: payload.carrier,
    })
    .eq('id', payload.orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
