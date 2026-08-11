import type { OrderStatus } from '@cinmax/types';
import type { PaginatedResult, PaginationParams } from '../../pagination';
import { OrderNotFoundError } from '../../errors';
import { OrderEntity } from './entity';
import type { IOrderRepository, OrderFilter, CreateOrderInput } from './repository.interface';

export class GetOrdersUseCase {
  constructor(private orderRepo: IOrderRepository) {}

  public async execute(
    filter?: OrderFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<OrderEntity>> {
    return this.orderRepo.getAll(filter, pagination);
  }
}

export class GetOrderByIdUseCase {
  constructor(private orderRepo: IOrderRepository) {}

  public async execute(id: string): Promise<OrderEntity> {
    const order = await this.orderRepo.getById(id);
    if (!order) {
      throw new OrderNotFoundError(id);
    }
    return order;
  }
}

export class GetOrderByOrderNumberUseCase {
  constructor(private orderRepo: IOrderRepository) {}

  public async execute(orderNumber: string): Promise<OrderEntity> {
    const order = await this.orderRepo.getByOrderNumber(orderNumber);
    if (!order) {
      throw new OrderNotFoundError(orderNumber);
    }
    return order;
  }
}

export class GetCustomerOrdersUseCase {
  constructor(private orderRepo: IOrderRepository) {}

  public async execute(
    userId: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<OrderEntity>> {
    return this.orderRepo.getByUserId(userId, pagination);
  }
}

export class CreateOrderUseCase {
  constructor(private orderRepo: IOrderRepository) {}

  public async execute(order: CreateOrderInput): Promise<OrderEntity> {
    return this.orderRepo.create(order);
  }
}

export class UpdateOrderStatusUseCase {
  constructor(private orderRepo: IOrderRepository) {}

  public async execute(id: string, status: OrderStatus): Promise<OrderEntity> {
    return this.orderRepo.updateStatus(id, status);
  }
}

export class CancelOrderUseCase {
  constructor(private orderRepo: IOrderRepository) {}

  public async execute(id: string, reason?: string): Promise<OrderEntity> {
    return this.orderRepo.cancel(id, reason);
  }
}
