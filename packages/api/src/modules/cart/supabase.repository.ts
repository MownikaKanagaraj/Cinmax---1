import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Product, ProductVariant, CartItem } from '@cinmax/types';
import { CartEntity } from './entity';
import { CartMapper } from './mapper';
import type { ICartRepository } from './repository.interface';
import { PricingEngine, type PricingEngineOutput, InventoryEngine, type InventoryCartValidationResult } from '../../engines';

export class SupabaseCartRepository implements ICartRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  public async getCart(userIdOrAnonId?: string | null): Promise<CartEntity> {
    let query = this.supabase
      .from('carts')
      .select('*, items:cart_items(*)')
      .limit(1);

    if (userIdOrAnonId?.startsWith('usr_')) {
      query = query.eq('user_id', userIdOrAnonId);
    } else if (userIdOrAnonId) {
      query = query.eq('anonymous_id', userIdOrAnonId);
    }

    const { data, error } = await query.maybeSingle();
    if (error || !data) {
      return new CartEntity({
        id: `cart_${Date.now()}`,
        userId: userIdOrAnonId?.startsWith('usr_') ? userIdOrAnonId : null,
        anonymousId: !userIdOrAnonId?.startsWith('usr_') ? userIdOrAnonId : null,
        items: [],
        subtotal: 0,
        discountTotal: 0,
        taxTotal: 0,
        shippingTotal: 0,
        grandTotal: 0,
        currency: 'USD',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return CartMapper.toEntity(data as any);
  }

  public async addToCart(
    userIdOrAnonId: string | null,
    product: Product,
    variant?: ProductVariant,
    quantity = 1
  ): Promise<CartEntity> {
    return this.addItem(userIdOrAnonId, product, variant, quantity);
  }

  public async addItem(
    userIdOrAnonId: string | null,
    product: Product,
    variant?: ProductVariant,
    quantity = 1
  ): Promise<CartEntity> {
    const cart = await this.getCart(userIdOrAnonId);
    const existingItem = cart.items.find(
      (i) => i.productId === product.id && i.variantId === (variant?.id || i.variantId)
    );

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      return this.updateQuantity(userIdOrAnonId, existingItem.id, newQty);
    }

    const unitPrice = variant ? variant.price : product.basePrice;

    await this.supabase.from('cart_items').insert({
      cart_id: cart.id,
      product_id: product.id,
      variant_id: variant?.id,
      quantity,
      unit_price: unitPrice,
      total_price: unitPrice * quantity,
    } as any);

    return this.getCart(userIdOrAnonId);
  }

  public async updateQuantity(
    userIdOrAnonId: string | null,
    itemId: string,
    quantity: number
  ): Promise<CartEntity> {
    if (quantity <= 0) {
      return this.removeItem(userIdOrAnonId, itemId);
    }

    const maxAllowedQty = Math.min(quantity, InventoryEngine.MAX_QUANTITY_PER_ITEM);

    await this.supabase
      .from('cart_items')
      .update({ quantity: maxAllowedQty } as any)
      .eq('id', itemId);

    return this.getCart(userIdOrAnonId);
  }

  public async removeFromCart(userIdOrAnonId: string | null, itemId: string): Promise<CartEntity> {
    return this.removeItem(userIdOrAnonId, itemId);
  }

  public async removeItem(userIdOrAnonId: string | null, itemId: string): Promise<CartEntity> {
    await this.supabase.from('cart_items').delete().eq('id', itemId);
    return this.getCart(userIdOrAnonId);
  }

  public async clearCart(userIdOrAnonId: string | null): Promise<CartEntity> {
    const cart = await this.getCart(userIdOrAnonId);
    await this.supabase.from('cart_items').delete().eq('cart_id', cart.id);
    return this.getCart(userIdOrAnonId);
  }

  public async mergeGuestCart(guestAnonId: string, loggedUserId: string): Promise<CartEntity> {
    const guestCart = await this.getCart(guestAnonId);
    if (!guestCart.items || guestCart.items.length === 0) {
      return this.getCart(loggedUserId);
    }

    for (const item of guestCart.items) {
      if (item.product) {
        await this.addItem(loggedUserId, item.product as any, item.variant as any, item.quantity);
      }
    }

    await this.clearCart(guestAnonId);
    return this.getCart(loggedUserId);
  }

  public async syncCart(userIdOrAnonId: string | null, items: CartItem[]): Promise<CartEntity> {
    await this.clearCart(userIdOrAnonId);
    for (const item of items) {
      if (item.product) {
        await this.addItem(userIdOrAnonId, item.product as any, item.variant as any, item.quantity);
      }
    }
    return this.getCart(userIdOrAnonId);
  }

  public async calculateTotals(userIdOrAnonId: string | null): Promise<PricingEngineOutput> {
    const cart = await this.getCart(userIdOrAnonId);
    return PricingEngine.calculate({
      items: cart.items,
      coupon: cart.appliedDiscount ? {
        code: cart.appliedDiscount.code,
        discountType: cart.appliedDiscount.discountType as any,
        discountValue: cart.appliedDiscount.discountValue,
      } : null,
    });
  }

  public async validateInventory(userIdOrAnonId: string | null): Promise<InventoryCartValidationResult> {
    const cart = await this.getCart(userIdOrAnonId);
    return InventoryEngine.validateCart(
      cart.items.map((i) => ({
        id: i.id,
        productId: i.productId,
        quantity: i.quantity,
        availableStock: (i.variant as any)?.inventoryQuantity,
      }))
    );
  }

  public async saveForLater(userIdOrAnonId: string | null, itemId: string): Promise<CartEntity> {
    const cart = await this.getCart(userIdOrAnonId);
    const item = cart.items.find((i) => i.id === itemId);

    if (item && userIdOrAnonId?.startsWith('usr_')) {
      await this.supabase.from('saved_for_later').insert({
        user_id: userIdOrAnonId,
        product_id: item.productId,
        variant_id: item.variantId,
      } as any);
    }

    return this.removeItem(userIdOrAnonId, itemId);
  }

  public async moveToWishlist(userIdOrAnonId: string | null, itemId: string): Promise<CartEntity> {
    const cart = await this.getCart(userIdOrAnonId);
    const item = cart.items.find((i) => i.id === itemId);

    if (item) {
      await this.supabase.from('wishlists').insert({
        user_id: userIdOrAnonId?.startsWith('usr_') ? userIdOrAnonId : null,
        product_id: item.productId,
      } as any);
    }

    return this.removeItem(userIdOrAnonId, itemId);
  }

  public async applyCoupon(userIdOrAnonId: string | null, code: string): Promise<CartEntity> {
    const { data: couponData } = await this.supabase
      .from('coupons')
      .select('*')
      .eq('code', code.trim().toUpperCase())
      .eq('is_active', true)
      .maybeSingle();

    const cart = await this.getCart(userIdOrAnonId);

    if (!couponData) {
      return cart;
    }

    await this.supabase
      .from('carts')
      .update({
        applied_discount: {
          code: couponData.code,
          discountType: couponData.discount_type,
          discountValue: couponData.discount_value,
        },
      } as any)
      .eq('id', cart.id);

    return this.getCart(userIdOrAnonId);
  }

  public async removeCoupon(userIdOrAnonId: string | null): Promise<CartEntity> {
    const cart = await this.getCart(userIdOrAnonId);
    await this.supabase
      .from('carts')
      .update({ applied_discount: null } as any)
      .eq('id', cart.id);

    return this.getCart(userIdOrAnonId);
  }
}
