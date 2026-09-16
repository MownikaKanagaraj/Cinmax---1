import type { CartItem, LoyaltyTier } from '@cinmax/types';
import { TaxEngine, type TaxResult } from './tax.engine';
import { ShippingEngine, type ShippingResult } from './shipping.engine';
import { CouponEngine, type CouponRule, type CouponEvaluationResult } from './coupon.engine';
import { InventoryEngine, type InventoryCartValidationResult } from './inventory.engine';
import { RewardPointEngine, type RewardCalculationResult } from './reward.engine';

export interface PricingEngineInput {
  items: CartItem[];
  shippingState?: string | null;
  coupon?: CouponRule | null;
  loyaltyTier?: LoyaltyTier;
  userLoyaltyBalance?: number;
  loyaltyPointsRedeemed?: number;
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
  maxLoyaltyRedemption: number;
  loyaltyDiscount: number;
  loyaltyPointsRedeemed: number;
  netProductPrice: number;
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
      shippingState,
      coupon,
      loyaltyTier = 'bronze',
      userLoyaltyBalance = 0,
      loyaltyPointsRedeemed = 0,
      isIntraState = true,
      isFirstOrder = false,
      customerRedemptionCount = 0,
    } = input;

    let subtotal = 0;
    let basePriceTotal = 0;
    let totalProducts = 0;

    items.forEach((item) => {
      const itemPrice = item.unitPrice ?? (item.variant?.price || (item.product as any)?.basePrice || 0);
      const itemCompareAt = (item.variant as any)?.compareAtPrice ?? (item.product as any)?.compareAtPrice ?? itemPrice;
      const qty = item.quantity || 0;

      subtotal += itemPrice * qty;
      basePriceTotal += itemCompareAt * qty;
      totalProducts += qty;
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

    const afterCoupon = Math.max(0, Math.round((subtotal - couponDiscount) * 100) / 100);

    // Loyalty Points Validation (Max 20% of net product subtotal after coupon)
    const maxLoyaltyRedemption = Math.floor(afterCoupon * 0.20);
    const validPointsToRedeem = Math.max(0, Math.min(Math.floor(userLoyaltyBalance), maxLoyaltyRedemption, Math.floor(loyaltyPointsRedeemed)));
    const loyaltyDiscount = validPointsToRedeem; // 1 Point = ₹1

    const netProductPrice = Math.max(0, Math.round((afterCoupon - loyaltyDiscount) * 100) / 100);

    // Tax Engine
    const taxResult = TaxEngine.calculateTax({
      subtotal: netProductPrice,
      gstRate: 18,
      isIntraState,
    });

    // Shipping Engine (Centralized Delivery Charge Algorithm)
    const shippingResult = ShippingEngine.calculateShipping({
      subtotal: netProductPrice,
      state: shippingState,
      totalProducts,
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

    const grandTotal = Math.round((netProductPrice + shippingResult.shippingTotal) * 100) / 100;

    // Reward Point Engine (1 Point per ₹1 of eligible net product amount)
    const rewardResult = RewardPointEngine.calculatePoints(netProductPrice, loyaltyTier);

    const totalPatronSavings = Math.round((campaignDiscountTotal + couponDiscount + loyaltyDiscount) * 100) / 100;

    return {
      subtotal,
      basePriceTotal,
      campaignDiscountTotal,
      couponResult,
      maxLoyaltyRedemption,
      loyaltyDiscount,
      loyaltyPointsRedeemed: validPointsToRedeem,
      netProductPrice,
      taxResult,
      shippingResult,
      inventoryValidation,
      rewardResult,
      grandTotal,
      totalPatronSavings,
      currency: 'INR',
    };
  }
}
