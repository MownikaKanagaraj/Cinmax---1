import { CouponEntity } from './entity';
import type { ICouponRepository } from './repository.interface';

export class GetCouponsUseCase {
  constructor(private couponRepo: ICouponRepository) {}

  public async execute(): Promise<CouponEntity[]> {
    return this.couponRepo.getAll();
  }
}

export class ValidateCouponUseCase {
  constructor(private couponRepo: ICouponRepository) {}

  public async execute(
    code: string,
    orderAmount?: number
  ): Promise<{ isValid: boolean; coupon?: CouponEntity; message?: string }> {
    return this.couponRepo.validate(code, orderAmount);
  }
}
