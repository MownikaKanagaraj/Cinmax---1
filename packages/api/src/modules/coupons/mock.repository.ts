import { mockCouponsData } from '../../mockData';
import { CouponEntity } from './entity';
import type { ICouponRepository } from './repository.interface';

export class MockCouponRepository implements ICouponRepository {
  private coupons: CouponEntity[];

  constructor(initialData?: CouponEntity[]) {
    this.coupons = initialData || mockCouponsData.map((c) => new CouponEntity(c));
  }

  public async getAll(): Promise<CouponEntity[]> {
    return this.coupons;
  }

  public async getByCode(code: string): Promise<CouponEntity | null> {
    const found = this.coupons.find((c) => c.code.toLowerCase() === code.trim().toLowerCase());
    return found || null;
  }

  public async validate(
    code: string,
    orderAmount = 0
  ): Promise<{ isValid: boolean; coupon?: CouponEntity; message?: string }> {
    const coupon = await this.getByCode(code);
    if (!coupon) {
      return { isValid: false, message: 'Invalid coupon code.' };
    }

    if (!coupon.isActive) {
      return { isValid: false, message: 'This coupon is no longer active.' };
    }

    if (coupon.isExpired) {
      return { isValid: false, message: 'This coupon has expired.' };
    }

    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      return {
        isValid: false,
        coupon,
        message: `Minimum order amount of $${coupon.minOrderAmount} required for this coupon.`,
      };
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return { isValid: false, message: 'Coupon usage limit reached.' };
    }

    return { isValid: true, coupon, message: 'Coupon applied successfully!' };
  }

  public async create(coupon: any): Promise<CouponEntity> {
    const newCoupon = new CouponEntity({
      ...coupon,
      id: `c_${Date.now()}`,
      isActive: true,
      timesUsed: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    this.coupons.push(newCoupon);
    return newCoupon;
  }

  public async deactivate(id: string): Promise<void> {
    const found = this.coupons.find((c) => c.id === id);
    if (found) {
      (found as any).isActive = false;
    }
  }
}
