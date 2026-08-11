import type { OrderStatus } from '@cinmax/types';
import type { IOrderRepository, OrderFilter, OrderEntity, CreateOrderInput } from '../modules/orders';
import type { PaginatedResult, PaginationParams } from '../pagination';
import { InvoiceEngine, type InvoiceDetails } from '../engines';
import {
  GetOrdersUseCase,
  GetOrderByIdUseCase,
  GetCustomerOrdersUseCase,
  CreateOrderUseCase,
  CancelOrderUseCase,
} from '../modules/orders/useCases';

export class OrderService {
  private getOrdersUseCase: GetOrdersUseCase;
  private getOrderByIdUseCase: GetOrderByIdUseCase;
  private getCustomerOrdersUseCase: GetCustomerOrdersUseCase;
  private createOrderUseCase: CreateOrderUseCase;
  private cancelOrderUseCase: CancelOrderUseCase;

  constructor(private orderRepo: IOrderRepository) {
    this.getOrdersUseCase = new GetOrdersUseCase(orderRepo);
    this.getOrderByIdUseCase = new GetOrderByIdUseCase(orderRepo);
    this.getCustomerOrdersUseCase = new GetCustomerOrdersUseCase(orderRepo);
    this.createOrderUseCase = new CreateOrderUseCase(orderRepo);
    this.cancelOrderUseCase = new CancelOrderUseCase(orderRepo);
  }

  public async getOrders(
    filter?: OrderFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<OrderEntity>> {
    return this.getOrdersUseCase.execute(filter, pagination);
  }

  public async getUserOrders(
    userId: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<OrderEntity>> {
    return this.getCustomerOrdersUseCase.execute(userId, pagination);
  }

  public async getCustomerOrders(
    userId: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<OrderEntity>> {
    return this.getCustomerOrdersUseCase.execute(userId, pagination);
  }

  public async getOrderById(id: string): Promise<OrderEntity> {
    return this.getOrderByIdUseCase.execute(id);
  }

  public async getOrder(id: string): Promise<OrderEntity | null> {
    return this.orderRepo.getOrder(id);
  }

  public async createOrder(order: CreateOrderInput): Promise<OrderEntity> {
    return this.createOrderUseCase.execute(order);
  }

  public async updateStatus(
    id: string,
    status: OrderStatus,
    reason?: string,
    actorId?: string
  ): Promise<OrderEntity> {
    return this.orderRepo.updateStatus(id, status, reason, actorId);
  }

  public async cancelOrder(id: string, reason?: string): Promise<OrderEntity> {
    return this.cancelOrderUseCase.execute(id, reason);
  }

  public async returnOrder(id: string, reason: string): Promise<OrderEntity> {
    return this.orderRepo.returnOrder(id, reason);
  }

  public async refundOrder(id: string, amount?: number): Promise<OrderEntity> {
    return this.orderRepo.refundOrder(id, amount);
  }

  public async generateInvoice(order: OrderEntity): Promise<InvoiceDetails> {
    return InvoiceEngine.createInvoice(order);
  }
}
