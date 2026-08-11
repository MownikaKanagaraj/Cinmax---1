import type { Cart, Address, AppliedCoupon } from '@cinmax/types';
import { PricingEngine, type PricingEngineOutput } from './pricing.engine';
import { InventoryEngine, type InventoryCartValidationResult } from './inventory.engine';
import { RazorpayProvider } from '../payments/razorpay.provider';

export interface CreateCheckoutSessionInput {
  userIdOrAnonId: string | null;
  cart: Cart;
  shippingAddress: Address;
  billingAddress?: Address;
  coupon?: AppliedCoupon | null;
}

export interface CheckoutSessionResult {
  sessionId: string;
  orderPreview: PricingEngineOutput;
  inventoryValidation: InventoryCartValidationResult;
  razorpayOrder: {
    providerOrderId: string;
    amount: number;
    currency: string;
    keyId?: string;
  };
  isValid: boolean;
  validationMessage?: string;
}

export class CheckoutEngine {
  public static async createCheckoutSession(
    input: CreateCheckoutSessionInput
  ): Promise<CheckoutSessionResult> {
    const { cart, shippingAddress, billingAddress = shippingAddress } = input;

    if (!cart.items || cart.items.length === 0) {
      throw new Error('Cannot initiate checkout with an empty parcel.');
    }

    // 1. Inventory Validation
    const inventoryValidation = InventoryEngine.validateCart(
      cart.items.map((i) => ({
        id: i.id,
        productId: i.productId,
        quantity: i.quantity,
        availableStock: (i.variant as any)?.inventoryQuantity ?? 50,
      }))
    );

    if (!inventoryValidation.isValid) {
      return {
        sessionId: `chk_invalid_${Date.now()}`,
        orderPreview: null as any,
        inventoryValidation,
        razorpayOrder: null as any,
        isValid: false,
        validationMessage: 'Stock levels insufficient for selected items.',
      };
    }

    // 2. Pricing, Tax, Shipping & Coupon Validation
    const orderPreview = PricingEngine.calculate({
      items: cart.items,
      coupon: cart.appliedDiscount
        ? {
            code: cart.appliedDiscount.code,
            discountType: cart.appliedDiscount.discountType as any,
            discountValue: cart.appliedDiscount.discountValue,
          }
        : null,
    });

    // 3. Create Payment Intent (Razorpay Provider)
    const razorpayProvider = new RazorpayProvider();
    const razorpayOrder = await razorpayProvider.createOrder({
      amount: orderPreview.grandTotal,
      currency: orderPreview.currency,
      receipt: `rcpt_${Date.now()}`,
      notes: {
        customer: shippingAddress.email || shippingAddress.firstName,
      },
    });

    const sessionId = `chk_sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    return {
      sessionId,
      orderPreview,
      inventoryValidation,
      razorpayOrder,
      isValid: true,
    };
  }
}
