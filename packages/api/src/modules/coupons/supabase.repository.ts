import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@cinmax/types';
import { CouponEntity } from './entity';
import { CouponMapper } from './mapper';
import type { ICouponRepository } from './repository.interface';
import { CENTRAL_COUPON_CONFIGS, getCentralCouponByCode } from '../../config/coupons.config';

export class SupabaseCouponRepository implements ICouponRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  public async getAll(): Promise<CouponEntity[]> {
    try {
      const { data, error } = await this.supabase
        .from('coupons')
        .select('*')
        .eq('is_active', true);

      if (!error && data && data.length > 0) {
        return CouponMapper.toEntityList(data as any);
      }
    } catch {
      // Fallback to central config
    }
    return CENTRAL_COUPON_CONFIGS.map((c) => new CouponEntity(c as any));
  }

  public async getByCode(code: string): Promise<CouponEntity | null> {
    try {
      const { data, error } = await this.supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase().trim())
        .single();

      if (!error && data) {
        return CouponMapper.toEntity(data as any);
      }
    } catch {
      // Ignore database error and try fallback
    }

    const central = getCentralCouponByCode(code);
    if (central) return new CouponEntity(central as any);

    return null;
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
        message: `Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon.`,
      };
    }


    return { isValid: true, coupon, message: 'Coupon applied successfully!' };
  }

  public async create(coupon: any): Promise<CouponEntity> {
    const { data, error } = await this.supabase
      .from('coupons')
      .insert(coupon)
      .select('*')
      .single();
    if (error) throw error;
    return CouponMapper.toEntity(data as any);
  }

  public async deactivate(id: string): Promise<void> {
    await this.supabase
      .from('coupons')
      .update({ is_active: false } as any)
      .eq('id', id);
  }
}
