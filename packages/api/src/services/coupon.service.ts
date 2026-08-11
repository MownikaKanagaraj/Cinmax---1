import type { ICouponRepository } from '../modules/coupons';
import type { CouponEntity } from '../modules/coupons';
import { GetCouponsUseCase, ValidateCouponUseCase } from '../modules/coupons/useCases';

export class CouponService {
  private getCouponsUseCase: GetCouponsUseCase;
  private validateCouponUseCase: ValidateCouponUseCase;

  constructor(private couponRepo: ICouponRepository) {
    this.getCouponsUseCase = new GetCouponsUseCase(couponRepo);
    this.validateCouponUseCase = new ValidateCouponUseCase(couponRepo);
  }

  public async getAvailableCoupons(): Promise<CouponEntity[]> {
    return this.getCouponsUseCase.execute();
  }

  public async validateCoupon(
    code: string,
    subtotal?: number
  ): Promise<{ isValid: boolean; coupon?: CouponEntity; message?: string }> {
    return this.validateCouponUseCase.execute(code, subtotal);
  }

  public async createCoupon(coupon: any): Promise<CouponEntity> {
    return this.couponRepo.create(coupon);
  }

  public async deactivateCoupon(id: string): Promise<void> {
    return this.couponRepo.deactivate(id);
  }
}
