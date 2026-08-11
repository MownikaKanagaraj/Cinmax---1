import type { CartItem, LoyaltyTier } from '@cinmax/types';
import { TaxEngine, type TaxResult } from './tax.engine';
import { ShippingEngine, type ShippingResult } from './shipping.engine';
import { CouponEngine, type CouponRule, type CouponEvaluationResult } from './coupon.engine';
import { InventoryEngine, type InventoryCartValidationResult } from './inventory.engine';
import { RewardPointEngine, type RewardCalculationResult } from './reward.engine';

export interface PricingEngineInput {
  items: CartItem[];
  coupon?: CouponRule | null;
  loyaltyTier?: LoyaltyTier;
  isIntraState?: boolean;
  isFirstOrder?: boolean;
  customerRedemptionCount?: number;
  totalWeightGrams?: number;
}

export interface PricingEngineOutput {
  subtotal: number;
  basePriceTotal: number;
  campaignDiscountTotal: number;
  couponResult: CouponEvaluationResult | null;
  taxResult: TaxResult;
  shippingResult: ShippingResult;
  inventoryValidation: InventoryCartValidationResult;
  rewardResult: RewardCalculationResult;
  grandTotal: number;
  totalPatronSavings: number;
  currency: string;
}

export class PricingEngine {
  public static calculate(input: PricingEngineInput): PricingEngineOutput {
    const {
      items,
      coupon,
      loyaltyTier = 'bronze',
      isIntraState = true,
      isFirstOrder = false,
      customerRedemptionCount = 0,
      totalWeightGrams = 0,
    } = input;

    let subtotal = 0;
    let basePriceTotal = 0;

    items.forEach((item) => {
      const itemPrice = item.unitPrice ?? (item.variant?.price || (item.product as any)?.basePrice || 0);
      const itemCompareAt = (item.variant as any)?.compareAtPrice ?? (item.product as any)?.compareAtPrice ?? itemPrice;
      const qty = item.quantity;

      subtotal += itemPrice * qty;
      basePriceTotal += itemCompareAt * qty;
    });

    subtotal = Math.round(subtotal * 100) / 100;
    basePriceTotal = Math.round(basePriceTotal * 100) / 100;
    const campaignDiscountTotal = Math.max(0, Math.round((basePriceTotal - subtotal) * 100) / 100);

    // Evaluate Coupon
    let couponResult: CouponEvaluationResult | null = null;
    let couponDiscount = 0;
    if (coupon) {
      const couponInputItems = items.map((i) => ({
        productId: i.productId,
        categoryId: (i.product as any)?.categoryId,
        price: i.unitPrice ?? i.variant?.price ?? 0,
        quantity: i.quantity,
      }));

      couponResult = CouponEngine.evaluate({
        coupon,
        subtotal,
        items: couponInputItems,
        isFirstOrder,
        customerRedemptionCount,
      });

      if (couponResult.isValid) {
        couponDiscount = couponResult.discountAmount;
      }
    }

    const discountedSubtotal = Math.max(0, Math.round((subtotal - couponDiscount) * 100) / 100);

    // Tax Engine
    const taxResult = TaxEngine.calculateTax({
      subtotal: discountedSubtotal,
      gstRate: 18,
      isIntraState,
    });

    // Shipping Engine
    const shippingResult = ShippingEngine.calculateShipping({
      subtotal: discountedSubtotal,
      totalWeightGrams,
    });

    // Inventory Engine
    const inventoryValidation = InventoryEngine.validateCart(
      items.map((i) => ({
        id: i.id,
        productId: i.productId,
        quantity: i.quantity,
        availableStock: (i.variant as any)?.inventoryQuantity,
      }))
    );

    const grandTotal = Math.round((discountedSubtotal + taxResult.taxTotal + shippingResult.shippingTotal) * 100) / 100;

    // Reward Point Engine
    const rewardResult = RewardPointEngine.calculatePoints(grandTotal, loyaltyTier);

    const totalPatronSavings = Math.round((campaignDiscountTotal + couponDiscount) * 100) / 100;

    return {
      subtotal,
      basePriceTotal,
      campaignDiscountTotal,
      couponResult,
      taxResult,
      shippingResult,
      inventoryValidation,
      rewardResult,
      grandTotal,
      totalPatronSavings,
      currency: 'USD',
    };
  }
}
