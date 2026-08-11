import type { Coupon, DiscountType } from '@cinmax/types';

export class CouponEntity implements Coupon {
  public id: string;
  public code: string;
  public title: string;
  public description?: string;
  public discountType: DiscountType;
  public discountValue: number;
  public minOrderAmount?: number;
  public maxDiscountAmount?: number;
  public startDate: string;
  public endDate: string;
  public usageLimit?: number;
  public usageCount: number;
  public isActive: boolean;

  constructor(props: Coupon) {
    this.id = props.id;
    this.code = props.code.toUpperCase().trim();
    this.title = props.title;
    this.description = props.description;
    this.discountType = props.discountType;
    this.discountValue = props.discountValue;
    this.minOrderAmount = props.minOrderAmount;
    this.maxDiscountAmount = props.maxDiscountAmount;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.usageLimit = props.usageLimit;
    this.usageCount = props.usageCount || 0;
    this.isActive = props.isActive !== false;
  }

  public get isExpired(): boolean {
    return new Date() > new Date(this.endDate);
  }

  public isValidForOrderAmount(amount: number): boolean {
    if (!this.isActive || this.isExpired) return false;
    if (this.minOrderAmount && amount < this.minOrderAmount) return false;
    if (this.usageLimit && this.usageCount >= this.usageLimit) return false;
    return true;
  }

  public calculateDiscount(subtotal: number): number {
    if (!this.isValidForOrderAmount(subtotal)) return 0;
    let discount = 0;
    if (this.discountType === 'percentage') {
      discount = (subtotal * this.discountValue) / 100;
    } else {
      discount = this.discountValue;
    }
    if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
      discount = this.maxDiscountAmount;
    }
    return Math.min(discount, subtotal);
  }
}
