import type { Product, ProductVariant, CartItem } from '@cinmax/types';
import { CartEntity } from './entity';
import type { PricingEngineOutput, InventoryCartValidationResult } from '../../engines';

export interface ICartRepository {
  getCart(userIdOrAnonId?: string | null): Promise<CartEntity>;
  addToCart(
    userIdOrAnonId: string | null,
    product: Product,
    variant?: ProductVariant,
    quantity?: number
  ): Promise<CartEntity>;
  addItem(
    userIdOrAnonId: string | null,
    product: Product,
    variant?: ProductVariant,
    quantity?: number
  ): Promise<CartEntity>;
  removeFromCart(userIdOrAnonId: string | null, itemId: string): Promise<CartEntity>;
  removeItem(userIdOrAnonId: string | null, itemId: string): Promise<CartEntity>;
  updateQuantity(userIdOrAnonId: string | null, itemId: string, quantity: number): Promise<CartEntity>;
  clearCart(userIdOrAnonId: string | null): Promise<CartEntity>;
  mergeGuestCart(guestAnonId: string, loggedUserId: string): Promise<CartEntity>;
  syncCart(userIdOrAnonId: string | null, items: CartItem[]): Promise<CartEntity>;
  calculateTotals(userIdOrAnonId: string | null): Promise<PricingEngineOutput>;
  validateInventory(userIdOrAnonId: string | null): Promise<InventoryCartValidationResult>;
  saveForLater(userIdOrAnonId: string | null, itemId: string): Promise<CartEntity>;
  moveToWishlist(userIdOrAnonId: string | null, itemId: string): Promise<CartEntity>;
  applyCoupon(userIdOrAnonId: string | null, code: string): Promise<CartEntity>;
  removeCoupon(userIdOrAnonId: string | null): Promise<CartEntity>;
}
