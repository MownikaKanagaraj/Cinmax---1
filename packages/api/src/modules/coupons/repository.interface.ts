import { CouponEntity } from './entity';

export interface ICouponRepository {
  getAll(): Promise<CouponEntity[]>;
  getByCode(code: string): Promise<CouponEntity | null>;
  validate(code: string, orderAmount?: number): Promise<{ isValid: boolean; coupon?: CouponEntity; message?: string }>;
  create(coupon: any): Promise<CouponEntity>;
  deactivate(id: string): Promise<void>;
}
