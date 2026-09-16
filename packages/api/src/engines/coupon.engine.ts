export interface CouponRule {
  id?: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed_amount' | 'free_shipping';
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  applicableCategoryId?: string;
  applicableProductId?: string;
  firstOrderOnly?: boolean;
  usageLimit?: number;
  usageCount?: number;
  customerLimit?: number;
  startsAt?: string;
  expiresAt?: string;
  isActive?: boolean;
}

export interface CouponEvaluationParams {
  coupon: CouponRule;
  subtotal: number;
  items?: Array<{ productId: string; categoryId?: string; price: number; quantity: number }>;
  isFirstOrder?: boolean;
  customerRedemptionCount?: number;
}

export interface CouponEvaluationResult {
  isValid: boolean;
  discountAmount: number;
  code: string;
  message?: string;
}

export class CouponEngine {
  public static evaluate(params: CouponEvaluationParams): CouponEvaluationResult {
    const { coupon, subtotal, items = [], isFirstOrder = false, customerRedemptionCount = 0 } = params;

    if (coupon.isActive === false) {
      return { isValid: false, discountAmount: 0, code: coupon.code, message: 'Coupon is inactive' };
    }

    const now = new Date();
    if (coupon.startsAt && new Date(coupon.startsAt) > now) {
      return { isValid: false, discountAmount: 0, code: coupon.code, message: 'Coupon promotion has not started yet' };
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
      return { isValid: false, discountAmount: 0, code: coupon.code, message: 'Coupon promotion has expired' };
    }

    if (coupon.usageLimit && (coupon.usageCount || 0) >= coupon.usageLimit) {
      return { isValid: false, discountAmount: 0, code: coupon.code, message: 'Coupon global usage limit reached' };
    }

    if (coupon.customerLimit && customerRedemptionCount >= coupon.customerLimit) {
      return { isValid: false, discountAmount: 0, code: coupon.code, message: 'You have already reached the maximum redemption limit for this coupon' };
    }

    if (coupon.firstOrderOnly && !isFirstOrder) {
      return { isValid: false, discountAmount: 0, code: coupon.code, message: 'This coupon is valid for first-time orders only' };
    }

    const minAmount = coupon.minPurchaseAmount || 0;
    if (subtotal < minAmount) {
      return {
        isValid: false,
        discountAmount: 0,
        code: coupon.code,
        message: `Minimum order purchase of ₹${minAmount.toFixed(0)} required for this coupon`,
      };
    }

    // Category / Product restriction evaluation
    let eligibleSubtotal = subtotal;
    if (coupon.applicableCategoryId || coupon.applicableProductId) {
      const eligibleItems = items.filter((item) => {
        if (coupon.applicableProductId && item.productId === coupon.applicableProductId) return true;
        if (coupon.applicableCategoryId && item.categoryId === coupon.applicableCategoryId) return true;
        return false;
      });

      if (eligibleItems.length === 0) {
        return {
          isValid: false,
          discountAmount: 0,
          code: coupon.code,
          message: 'Coupon is not applicable to any items in your parcel',
        };
      }

      eligibleSubtotal = eligibleItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((eligibleSubtotal * (coupon.discountValue / 100)) * 100) / 100;
      if (coupon.maxDiscountAmount && coupon.maxDiscountAmount > 0) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
      }
    } else if (coupon.discountType === 'fixed_amount') {
      discountAmount = Math.min(coupon.discountValue, eligibleSubtotal);
    } else if (coupon.discountType === 'free_shipping') {
      discountAmount = 60; // Standard flat shipping cost ₹60
    }

    return {
      isValid: true,
      discountAmount,
      code: coupon.code,
      message: 'Coupon applied successfully',
    };
  }
}
