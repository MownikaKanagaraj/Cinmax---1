import type { OrderStatus, Order } from '@cinmax/types';
import type { PaginatedResult, PaginationParams } from '../../pagination';
import { OrderEntity } from './entity';

export interface OrderFilter {
  userId?: string;
  status?: OrderStatus;
  searchQuery?: string;
}

export interface CreateOrderInput extends Partial<Order> {
  items: Order['items'];
  shippingAddress: Order['shippingAddress'];
  subtotal: number;
  grandTotal: number;
}

export interface IOrderRepository {
  getAll(filter?: OrderFilter, pagination?: PaginationParams): Promise<PaginatedResult<OrderEntity>>;
  getOrders(filter?: OrderFilter, pagination?: PaginationParams): Promise<PaginatedResult<OrderEntity>>;
  getById(id: string): Promise<OrderEntity | null>;
  getOrder(id: string): Promise<OrderEntity | null>;
  getByOrderNumber(orderNumber: string): Promise<OrderEntity | null>;
  getByUserId(userId: string, pagination?: PaginationParams): Promise<PaginatedResult<OrderEntity>>;
  getCustomerOrders(userId: string, pagination?: PaginationParams): Promise<PaginatedResult<OrderEntity>>;
  create(order: CreateOrderInput): Promise<OrderEntity>;
  updateStatus(id: string, status: OrderStatus, reason?: string, actorId?: string): Promise<OrderEntity>;
  cancel(id: string, reason?: string): Promise<OrderEntity>;
  returnOrder(id: string, reason: string): Promise<OrderEntity>;
  refundOrder(id: string, amount?: number): Promise<OrderEntity>;
}
