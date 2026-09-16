import type { OrderStatus } from '@cinmax/types';
import { calculateDeliveryCharge } from '@cinmax/utils';
import { mockOrdersData } from '../../mockData';
import { paginateArray, type PaginatedResult, type PaginationParams } from '../../pagination';
import { OrderNotFoundError } from '../../errors';
import { OrderEntity } from './entity';
import type { IOrderRepository, OrderFilter, CreateOrderInput } from './repository.interface';
import { OrderStateMachine } from '../../engines';

export class MockOrderRepository implements IOrderRepository {
  private orders: OrderEntity[];

  constructor(initialData?: OrderEntity[]) {
    this.orders = initialData || mockOrdersData.map((o) => new OrderEntity(o as any));
  }

  public async getAll(
    filter?: OrderFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<OrderEntity>> {
    let filtered = [...this.orders];

    if (filter?.userId) {
      filtered = filtered.filter((o) => o.userId === filter.userId);
    }

    if (filter?.status) {
      filtered = filtered.filter((o) => o.status === filter.status);
    }

    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.shippingAddress.firstName.toLowerCase().includes(q) ||
          o.shippingAddress.lastName.toLowerCase().includes(q)
      );
    }

    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return paginateArray(filtered, pagination);
  }

  public async getOrders(
    filter?: OrderFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<OrderEntity>> {
    return this.getAll(filter, pagination);
  }

  public async getById(id: string): Promise<OrderEntity | null> {
    const order = this.orders.find((o) => o.id === id);
    return order || null;
  }

  public async getOrder(id: string): Promise<OrderEntity | null> {
    return this.getById(id);
  }

  public async getByOrderNumber(orderNumber: string): Promise<OrderEntity | null> {
    const order = this.orders.find((o) => o.orderNumber === orderNumber);
    return order || null;
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
    const totalProducts = (order.items || []).reduce((acc, i) => acc + (i.quantity || 1), 0);
    const deliveryCalc = calculateDeliveryCharge(order.shippingAddress?.state, totalProducts);
    const shippingTotal = deliveryCalc.deliveryCharge;
    const subtotal = order.subtotal || 0;
    const discountTotal = order.discountTotal || 0;
    const taxTotal = order.taxTotal || 0;
    const grandTotal = Math.max(0, subtotal - discountTotal + taxTotal + shippingTotal);

    const newOrder = new OrderEntity({
      id: order.id || `ord_${Date.now()}`,
      orderNumber: order.orderNumber || `CNX-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: order.userId || null,
      guestEmail: order.guestEmail || null,
      status: order.status || 'confirmed',
      paymentStatus: order.paymentStatus || 'paid',
      paymentMethod: order.paymentMethod || 'upi',
      paymentIntentId: order.paymentIntentId,
      subtotal,
      discountTotal,
      taxTotal,
      shippingTotal,
      grandTotal,
      currency: order.currency || 'INR',
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress || order.shippingAddress,
      items: order.items,
      delivery: {
        state: deliveryCalc.state,
        totalProducts: deliveryCalc.totalProducts,
        charge: deliveryCalc.deliveryCharge,
        isFree: deliveryCalc.isFreeDelivery,
      },
      trackingNumber: order.trackingNumber,
      carrier: order.carrier,
      estimatedDeliveryDate: order.estimatedDeliveryDate,
      timeline: order.timeline || [
        {
          id: `tl_${Date.now()}`,
          title: 'Order Confirmed',
          description: 'Your order was confirmed and paid successfully.',
          timestamp: new Date().toISOString(),
          status: 'confirmed',
        },
      ],
      createdAt: order.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    this.orders.unshift(newOrder);
    return newOrder;
  }

  public async updateStatus(
    id: string,
    status: OrderStatus,
    reason?: string,
    _actorId?: string,
    trackingNumber?: string,
    carrier?: string,
    estimatedDeliveryDate?: string
  ): Promise<OrderEntity> {
    const index = this.orders.findIndex((o) => o.id === id);
    if (index === -1) {
      throw new OrderNotFoundError(id);
    }

    const order = this.orders[index];
    OrderStateMachine.validateTransition(order.status, status);

    const updated = new OrderEntity({
      ...order,
      status,
      trackingNumber: trackingNumber || order.trackingNumber,
      carrier: carrier || order.carrier,
      estimatedDeliveryDate: estimatedDeliveryDate || order.estimatedDeliveryDate,
      timeline: [
        ...(order.timeline || []),
        {
          id: `tl_${Date.now()}`,
          title: `Status updated to ${status}`,
          description: reason || `Order status updated to ${status}.`,
          timestamp: new Date().toISOString(),
          status,
        },
      ],
      updatedAt: new Date().toISOString(),
    });

    this.orders[index] = updated;
    return updated;
  }

  public async cancel(id: string, reason?: string): Promise<OrderEntity> {
    return this.updateStatus(id, 'cancelled', reason || 'Customer requested cancellation.');
  }

  public async returnOrder(id: string, reason: string): Promise<OrderEntity> {
    return this.updateStatus(id, 'returned', reason);
  }

  public async refundOrder(id: string, _amount?: number): Promise<OrderEntity> {
    return this.updateStatus(id, 'refunded', 'Order refunded.');
  }
}
