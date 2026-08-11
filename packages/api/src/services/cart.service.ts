import type { Product, ProductVariant } from '@cinmax/types';
import type { ICartRepository, CartEntity } from '../modules/cart';
import type { PricingEngineOutput, InventoryCartValidationResult } from '../engines';
import {
  GetCartUseCase,
  AddItemToCartUseCase,
  UpdateCartItemQuantityUseCase,
  RemoveCartItemUseCase,
  ApplyCouponToCartUseCase,
  RemoveCouponFromCartUseCase,
  ClearCartUseCase,
} from '../modules/cart/useCases';

export class CartService {
  private getCartUseCase: GetCartUseCase;
  private addItemUseCase: AddItemToCartUseCase;
  private updateQuantityUseCase: UpdateCartItemQuantityUseCase;
  private removeItemUseCase: RemoveCartItemUseCase;
  private applyCouponUseCase: ApplyCouponToCartUseCase;
  private removeCouponUseCase: RemoveCouponFromCartUseCase;
  private clearCartUseCase: ClearCartUseCase;

  constructor(private cartRepo: ICartRepository) {
    this.getCartUseCase = new GetCartUseCase(cartRepo);
    this.addItemUseCase = new AddItemToCartUseCase(cartRepo);
    this.updateQuantityUseCase = new UpdateCartItemQuantityUseCase(cartRepo);
    this.removeItemUseCase = new RemoveCartItemUseCase(cartRepo);
    this.applyCouponUseCase = new ApplyCouponToCartUseCase(cartRepo);
    this.removeCouponUseCase = new RemoveCouponFromCartUseCase(cartRepo);
    this.clearCartUseCase = new ClearCartUseCase(cartRepo);
  }

  public async getCart(userIdOrAnonId?: string | null): Promise<CartEntity> {
    return this.getCartUseCase.execute(userIdOrAnonId);
  }

  public async addToCart(
    userIdOrAnonId: string | null,
    product: Product,
    variant?: ProductVariant,
    quantity = 1
  ): Promise<CartEntity> {
    return this.addItemUseCase.execute(userIdOrAnonId, product, variant, quantity);
  }

  public async addItem(
    userIdOrAnonId: string | null,
    product: Product,
    variant?: ProductVariant,
    quantity = 1
  ): Promise<CartEntity> {
    return this.addItemUseCase.execute(userIdOrAnonId, product, variant, quantity);
  }

  public async updateQuantity(
    userIdOrAnonId: string | null,
    itemId: string,
    quantity: number
  ): Promise<CartEntity> {
    return this.updateQuantityUseCase.execute(userIdOrAnonId, itemId, quantity);
  }

  public async removeFromCart(userIdOrAnonId: string | null, itemId: string): Promise<CartEntity> {
    return this.removeItemUseCase.execute(userIdOrAnonId, itemId);
  }

  public async removeItem(userIdOrAnonId: string | null, itemId: string): Promise<CartEntity> {
    return this.removeItemUseCase.execute(userIdOrAnonId, itemId);
  }

  public async applyCoupon(userIdOrAnonId: string | null, code: string): Promise<CartEntity> {
    return this.applyCouponUseCase.execute(userIdOrAnonId, code);
  }

  public async removeCoupon(userIdOrAnonId: string | null): Promise<CartEntity> {
    return this.removeCouponUseCase.execute(userIdOrAnonId);
  }

  public async clearCart(userIdOrAnonId: string | null): Promise<CartEntity> {
    return this.clearCartUseCase.execute(userIdOrAnonId);
  }

  public async mergeGuestCart(guestAnonId: string, loggedUserId: string): Promise<CartEntity> {
    return this.cartRepo.mergeGuestCart(guestAnonId, loggedUserId);
  }

  public async calculateTotals(userIdOrAnonId: string | null): Promise<PricingEngineOutput> {
    return this.cartRepo.calculateTotals(userIdOrAnonId);
  }

  public async validateInventory(userIdOrAnonId: string | null): Promise<InventoryCartValidationResult> {
    return this.cartRepo.validateInventory(userIdOrAnonId);
  }

  public async saveForLater(userIdOrAnonId: string | null, itemId: string): Promise<CartEntity> {
    return this.cartRepo.saveForLater(userIdOrAnonId, itemId);
  }

  public async moveToWishlist(userIdOrAnonId: string | null, itemId: string): Promise<CartEntity> {
    return this.cartRepo.moveToWishlist(userIdOrAnonId, itemId);
  }
}
