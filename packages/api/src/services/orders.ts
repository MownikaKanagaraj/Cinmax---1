import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Order, OrderItem } from '@cinmax/types';

export class OrderService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getOrdersByUser(userId: string): Promise<Order[]> {
    const { data, error } = await this.supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(this.mapDbOrderToDomain);
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.getOrdersByUser(userId);
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    const { data, error } = await this.supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('id', orderId)
      .single();

    if (error || !data) return null;
    return this.mapDbOrderToDomain(data);
  }

  private mapDbOrderToDomain(row: any): Order {
    return {
      id: row.id,
      orderNumber: row.order_number,
      userId: row.user_id,
      guestEmail: row.guest_email,
      status: row.status as any,
      paymentStatus: row.payment_status as any,
      paymentMethod: row.payment_method as any,
      paymentIntentId: row.payment_intent_id || undefined,
      subtotal: Number(row.subtotal),
      discountTotal: Number(row.discount_total || 0),
      taxTotal: Number(row.tax_total || 0),
      shippingTotal: Number(row.shipping_total || 0),
      grandTotal: Number(row.grand_total),
      currency: row.currency || 'USD',
      shippingAddress: row.shipping_address as any,
      billingAddress: row.billing_address as any,
      items: (row.items || []).map((i: any): OrderItem => ({
        id: i.id,
        orderId: i.order_id,
        productId: i.product_id,
        variantId: i.variant_id,
        productTitle: i.product_title,
        variantTitle: i.variant_title,
        sku: i.sku,
        unitPrice: Number(i.unit_price),
        quantity: i.quantity,
        totalPrice: Number(i.total_price),
        imageUrl: i.image_url || undefined,
      })),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
