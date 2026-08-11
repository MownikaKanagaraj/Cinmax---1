import type { Product, ProductVariant } from '@cinmax/types';
import { CartEntity } from './entity';
import type { ICartRepository } from './repository.interface';

export class GetCartUseCase {
  constructor(private cartRepo: ICartRepository) {}

  public async execute(userIdOrAnonId?: string | null): Promise<CartEntity> {
    return this.cartRepo.getCart(userIdOrAnonId);
  }
}

export class AddItemToCartUseCase {
  constructor(private cartRepo: ICartRepository) {}

  public async execute(
    userIdOrAnonId: string | null,
    product: Product,
    variant?: ProductVariant,
    quantity = 1
  ): Promise<CartEntity> {
    return this.cartRepo.addItem(userIdOrAnonId, product, variant, quantity);
  }
}

export class UpdateCartItemQuantityUseCase {
  constructor(private cartRepo: ICartRepository) {}

  public async execute(
    userIdOrAnonId: string | null,
    itemId: string,
    quantity: number
  ): Promise<CartEntity> {
    return this.cartRepo.updateQuantity(userIdOrAnonId, itemId, quantity);
  }
}

export class RemoveCartItemUseCase {
  constructor(private cartRepo: ICartRepository) {}

  public async execute(userIdOrAnonId: string | null, itemId: string): Promise<CartEntity> {
    return this.cartRepo.removeItem(userIdOrAnonId, itemId);
  }
}

export class ApplyCouponToCartUseCase {
  constructor(private cartRepo: ICartRepository) {}

  public async execute(userIdOrAnonId: string | null, code: string): Promise<CartEntity> {
    return this.cartRepo.applyCoupon(userIdOrAnonId, code);
  }
}

export class RemoveCouponFromCartUseCase {
  constructor(private cartRepo: ICartRepository) {}

  public async execute(userIdOrAnonId: string | null): Promise<CartEntity> {
    return this.cartRepo.removeCoupon(userIdOrAnonId);
  }
}

export class ClearCartUseCase {
  constructor(private cartRepo: ICartRepository) {}

  public async execute(userIdOrAnonId: string | null): Promise<CartEntity> {
    return this.cartRepo.clearCart(userIdOrAnonId);
  }
}
