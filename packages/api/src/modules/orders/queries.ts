import type { SupabaseClient } from '@supabase/supabase-js';
import type { Order } from '@cinmax/types';
import { OrderService } from '../../services/orders';

export async function fetchUserOrders(
  supabase: SupabaseClient,
  userId: string
): Promise<Order[]> {
  const service = new OrderService(supabase as any);
  return service.getUserOrders(userId);
}

export async function fetchOrderById(
  supabase: SupabaseClient,
  orderId: string
): Promise<Order | null> {
  const service = new OrderService(supabase as any);
  return service.getOrderById(orderId);
}
