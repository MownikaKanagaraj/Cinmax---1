import type { Product, ProductVariant, CartItem } from '@cinmax/types';
import { mockCartData, mockCouponsData } from '../../mockData';
import { InvalidCouponError } from '../../errors';
import { CartEntity } from './entity';
import type { ICartRepository } from './repository.interface';
import { PricingEngine, type PricingEngineOutput, InventoryEngine, type InventoryCartValidationResult } from '../../engines';

export class MockCartRepository implements ICartRepository {
  private cart: CartEntity;

  constructor(initialData?: CartEntity) {
    this.cart = initialData || new CartEntity(mockCartData);
  }

  private recalculateCart(cart: CartEntity): CartEntity {
    const subtotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    let discountTotal = 0;

    if (cart.appliedDiscount) {
      const discountVal = (cart.appliedDiscount as any).discountValue ?? (cart.appliedDiscount as any).amount ?? 0;
      if (cart.appliedDiscount.discountType === 'percentage') {
        discountTotal = (subtotal * discountVal) / 100;
      } else {
        discountTotal = discountVal;
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discountTotal);
    const taxTotal = Math.round(discountedSubtotal * 0.18 * 100) / 100;
    const shippingTotal = discountedSubtotal >= 50 || subtotal === 0 ? 0 : 5.99;
    const grandTotal = Math.round((discountedSubtotal + taxTotal + shippingTotal) * 100) / 100;

    return new CartEntity({
      ...cart,
      subtotal,
      discountTotal,
      taxTotal,
      shippingTotal,
      grandTotal,
      updatedAt: new Date().toISOString(),
    });
  }

  public async getCart(_userIdOrAnonId?: string | null): Promise<CartEntity> {
    return this.cart;
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
    _userIdOrAnonId: string | null,
    product: Product,
    variant?: ProductVariant,
    quantity = 1
  ): Promise<CartEntity> {
    const existingIndex = this.cart.items.findIndex(
      (item) => item.productId === product.id && (!variant || item.variantId === variant.id)
    );

    const unitPrice = variant ? variant.price : product.basePrice;
    let items = [...this.cart.items];

    if (existingIndex !== -1) {
      const existing = items[existingIndex];
      const newQty = Math.min(existing.quantity + quantity, InventoryEngine.MAX_QUANTITY_PER_ITEM);
      items[existingIndex] = {
        ...existing,
        quantity: newQty,
        totalPrice: newQty * existing.unitPrice,
        updatedAt: new Date().toISOString(),
      };
    } else {
      items.push({
        id: `cart_item_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        cartId: this.cart.id,
        productId: product.id,
        variantId: variant?.id,
        product: {
          id: product.id,
          title: product.title,
          slug: product.slug,
          images: product.images,
          processType: product.processType,
        },
        variant: variant
          ? {
              id: variant.id,
              sku: variant.sku,
              title: variant.title,
              price: variant.price,
              weightGrams: variant.weightGrams,
              volumeMl: variant.volumeMl,
              options: variant.options,
            }
          : {
              id: product.id,
              sku: 'DEFAULT',
              title: 'Default',
              price: unitPrice,
              weightGrams: undefined,
              volumeMl: undefined,
              options: {},
            },
        quantity,
        unitPrice,
        totalPrice: unitPrice * quantity,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    this.cart = this.recalculateCart(new CartEntity({ ...this.cart, items }));
    return this.cart;
  }

  public async updateQuantity(
    _userIdOrAnonId: string | null,
    itemId: string,
    quantity: number
  ): Promise<CartEntity> {
    if (quantity <= 0) {
      return this.removeItem(_userIdOrAnonId, itemId);
    }

    const items = this.cart.items.map((item) => {
      if (item.id === itemId) {
        const validQty = Math.min(quantity, InventoryEngine.MAX_QUANTITY_PER_ITEM);
        return {
          ...item,
          quantity: validQty,
          totalPrice: validQty * item.unitPrice,
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    });

    this.cart = this.recalculateCart(new CartEntity({ ...this.cart, items }));
    return this.cart;
  }

  public async removeFromCart(_userIdOrAnonId: string | null, itemId: string): Promise<CartEntity> {
    return this.removeItem(_userIdOrAnonId, itemId);
  }

  public async removeItem(_userIdOrAnonId: string | null, itemId: string): Promise<CartEntity> {
    const items = this.cart.items.filter((item) => item.id !== itemId);
    this.cart = this.recalculateCart(new CartEntity({ ...this.cart, items }));
    return this.cart;
  }

  public async applyCoupon(_userIdOrAnonId: string | null, code: string): Promise<CartEntity> {
    const foundCoupon = mockCouponsData.find(
      (c) => c.code.toLowerCase() === code.trim().toLowerCase() && c.isActive
    );

    if (!foundCoupon) {
      throw new InvalidCouponError(code);
    }

    this.cart = this.recalculateCart(
      new CartEntity({
        ...this.cart,
        appliedDiscount: {
          code: foundCoupon.code,
          discountType: foundCoupon.discountType as any,
          discountValue: foundCoupon.discountValue,
          description: foundCoupon.description,
        },
      })
    );

    return this.cart;
  }

  public async removeCoupon(_userIdOrAnonId: string | null): Promise<CartEntity> {
    this.cart = this.recalculateCart(
      new CartEntity({
        ...this.cart,
        appliedDiscount: null,
      })
    );
    return this.cart;
  }

  public async clearCart(_userIdOrAnonId: string | null): Promise<CartEntity> {
    this.cart = this.recalculateCart(
      new CartEntity({
        ...this.cart,
        items: [],
        appliedDiscount: null,
      })
    );
    return this.cart;
  }

  public async mergeGuestCart(_guestAnonId: string, _loggedUserId: string): Promise<CartEntity> {
    return this.cart;
  }

  public async syncCart(_userIdOrAnonId: string | null, items: CartItem[]): Promise<CartEntity> {
    this.cart = this.recalculateCart(new CartEntity({ ...this.cart, items }));
    return this.cart;
  }

  public async calculateTotals(_userIdOrAnonId: string | null): Promise<PricingEngineOutput> {
    return PricingEngine.calculate({
      items: this.cart.items,
      coupon: this.cart.appliedDiscount ? {
        code: this.cart.appliedDiscount.code,
        discountType: this.cart.appliedDiscount.discountType as any,
        discountValue: this.cart.appliedDiscount.discountValue,
      } : null,
    });
  }

  public async validateInventory(_userIdOrAnonId: string | null): Promise<InventoryCartValidationResult> {
    return InventoryEngine.validateCart(
      this.cart.items.map((i) => ({
        id: i.id,
        productId: i.productId,
        quantity: i.quantity,
        availableStock: (i.variant as any)?.inventoryQuantity,
      }))
    );
  }

  public async saveForLater(_userIdOrAnonId: string | null, itemId: string): Promise<CartEntity> {
    return this.removeItem(_userIdOrAnonId, itemId);
  }

  public async moveToWishlist(_userIdOrAnonId: string | null, itemId: string): Promise<CartEntity> {
    return this.removeItem(_userIdOrAnonId, itemId);
  }
}
