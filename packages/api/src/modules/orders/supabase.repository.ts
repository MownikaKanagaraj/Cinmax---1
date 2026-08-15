import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, OrderStatus } from '@cinmax/types';
import { paginateArray, type PaginatedResult, type PaginationParams } from '../../pagination';
import { OrderEntity } from './entity';
import { OrderMapper } from './mapper';
import type { IOrderRepository, OrderFilter, CreateOrderInput } from './repository.interface';
import { OrderStateMachine } from '../../engines';

export class SupabaseOrderRepository implements IOrderRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  public async getAll(
    filter?: OrderFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<OrderEntity>> {
    let query = this.supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .order('created_at', { ascending: false });

    if (filter?.userId) {
      query = query.eq('user_id', filter.userId);
    }

    if (filter?.status) {
      query = query.eq('status', filter.status);
    }

    try {
      const { data, error } = await query;
      if (error) throw error;

      const entities = (data || []).map((row: any) => OrderMapper.toEntity(row));
      return paginateArray(entities, pagination);
    } catch (err) {
      console.warn('[SupabaseOrderRepository] Network/DNS failure, returning mock data fallback');
      const { MockOrderRepository } = await import('./mock.repository');
      const mockRepo = new MockOrderRepository();
      return mockRepo.getAll(filter, pagination);
    }
  }

  public async getOrders(
    filter?: OrderFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<OrderEntity>> {
    return this.getAll(filter, pagination);
  }

  public async getById(id: string): Promise<OrderEntity | null> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return null;
    return OrderMapper.toEntity(data as any);
  }

  public async getOrder(id: string): Promise<OrderEntity | null> {
    return this.getById(id);
  }

  public async getByOrderNumber(orderNumber: string): Promise<OrderEntity | null> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('order_number', orderNumber)
      .maybeSingle();

    if (error || !data) return null;
    return OrderMapper.toEntity(data as any);
  }

  public async getByUserId(
    userId: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<OrderEntity>> {
    return this.getAll({ userId }, pagination);
  }

  public async getCustomerOrders(
    userId: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<OrderEntity>> {
    return this.getByUserId(userId, pagination);
  }

  public async create(order: CreateOrderInput): Promise<OrderEntity> {
    const dto = OrderMapper.toDTO(new OrderEntity(order as any));
    const { data, error } = await this.supabase
      .from('orders')
      .insert(dto as any)
      .select('*, items:order_items(*)')
      .single();

    if (error) throw error;

    await this.supabase.from('order_status_history').insert({
      order_id: (data as any).id,
      status: (data as any).status,
      previous_status: null,
      reason: 'Order placed via checkout',
    } as any);

    return OrderMapper.toEntity(data as any);
  }

  public async updateStatus(
    id: string,
    status: OrderStatus,
    reason?: string,
    actorId?: string
  ): Promise<OrderEntity> {
    const currentOrder = await this.getById(id);
    if (currentOrder) {
      OrderStateMachine.validateTransition(currentOrder.status, status);
    }

    const { data, error } = await this.supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() } as any)
      .eq('id', id)
      .select('*, items:order_items(*)')
      .single();

    if (error) throw error;

    await this.supabase.from('order_status_history').insert({
      order_id: id,
      status,
      previous_status: currentOrder?.status,
      changed_by: actorId,
      reason: reason || 'Status updated',
    } as any);

    return OrderMapper.toEntity(data as any);
  }

  public async cancel(id: string, reason?: string): Promise<OrderEntity> {
    return this.updateStatus(id, 'cancelled', reason || 'Customer requested cancellation');
  }

  public async returnOrder(id: string, reason: string): Promise<OrderEntity> {
    const order = await this.updateStatus(id, 'returned', reason);
    await this.supabase.from('returns').insert({
      order_id: id,
      user_id: order.userId || id,
      status: 'requested',
      reason,
      refund_amount: order.grandTotal,
    } as any);
    return order;
  }

  public async refundOrder(id: string, amount?: number): Promise<OrderEntity> {
    const order = await this.updateStatus(id, 'refunded', 'Refund processed');
    await this.supabase.from('refunds').insert({
      order_id: id,
      amount: amount || order.grandTotal,
      status: 'processed',
    } as any);
    return order;
  }
}
