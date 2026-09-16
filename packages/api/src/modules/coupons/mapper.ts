import type { Coupon } from '@cinmax/types';
import type { CouponDTO } from './dto';
import { CouponEntity } from './entity';

export class CouponMapper {
  public static toEntity(dto: any): CouponEntity {
    const minOrder = dto.min_order_amount ?? dto.min_purchase_amount;
    const startDate = dto.start_date ?? dto.starts_at;
    const endDate = dto.end_date ?? dto.expires_at;

    return new CouponEntity({
      id: dto.id,
      code: dto.code,
      title: dto.title || dto.code,
      description: dto.description ?? undefined,
      discountType: dto.discount_type as any,
      discountValue: Number(dto.discount_value),
      minOrderAmount: minOrder !== undefined && minOrder !== null ? Number(minOrder) : undefined,
      maxDiscountAmount: dto.max_discount_amount ? Number(dto.max_discount_amount) : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      usageLimit: dto.usage_limit ?? undefined,
      usageCount: Number(dto.usage_count) || 0,
      isActive: dto.is_active !== false,
    });
  }


  public static toDTO(entity: Coupon | CouponEntity): CouponDTO {
    return {
      id: entity.id,
      code: entity.code,
      title: entity.title,
      description: entity.description ?? null,
      discount_type: entity.discountType,
      discount_value: entity.discountValue,
      min_order_amount: entity.minOrderAmount ?? null,
      max_discount_amount: entity.maxDiscountAmount ?? null,
      start_date: entity.startDate,
      end_date: entity.endDate,
      usage_limit: entity.usageLimit ?? null,
      usage_count: entity.usageCount,
      is_active: entity.isActive,
    };
  }

  public static toEntityList(dtos: CouponDTO[]): CouponEntity[] {
    return dtos.map(this.toEntity);
  }
}
