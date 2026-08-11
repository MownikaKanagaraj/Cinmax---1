import type { Coupon } from '@cinmax/types';
import type { CouponDTO } from './dto';
import { CouponEntity } from './entity';

export class CouponMapper {
  public static toEntity(dto: CouponDTO): CouponEntity {
    return new CouponEntity({
      id: dto.id,
      code: dto.code,
      title: dto.title,
      description: dto.description ?? undefined,
      discountType: dto.discount_type as any,
      discountValue: Number(dto.discount_value),
      minOrderAmount: dto.min_order_amount ? Number(dto.min_order_amount) : undefined,
      maxDiscountAmount: dto.max_discount_amount ? Number(dto.max_discount_amount) : undefined,
      startDate: dto.start_date,
      endDate: dto.end_date,
      usageLimit: dto.usage_limit ?? undefined,
      usageCount: dto.usage_count,
      isActive: dto.is_active,
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
