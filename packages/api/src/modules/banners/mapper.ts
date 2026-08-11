import type { PromoBanner } from '@cinmax/types';
import type { BannerDTO } from './dto';
import { BannerEntity } from './entity';

export class BannerMapper {
  public static toEntity(dto: BannerDTO): BannerEntity {
    return new BannerEntity({
      id: dto.id,
      title: dto.title,
      subtitle: dto.subtitle ?? undefined,
      ctaText: dto.cta_text,
      ctaLink: dto.cta_link,
      imageUrl: dto.image_url,
      mobileImageUrl: dto.mobile_image_url ?? undefined,
      badgeText: dto.badge_text ?? undefined,
      backgroundColor: dto.background_color ?? undefined,
      isActive: dto.is_active,
      sortOrder: dto.sort_order,
    });
  }

  public static toDTO(entity: PromoBanner | BannerEntity): BannerDTO {
    return {
      id: entity.id,
      title: entity.title,
      subtitle: entity.subtitle ?? null,
      cta_text: entity.ctaText,
      cta_link: entity.ctaLink,
      image_url: entity.imageUrl,
      mobile_image_url: entity.mobileImageUrl ?? null,
      badge_text: entity.badgeText ?? null,
      background_color: entity.backgroundColor ?? null,
      is_active: entity.isActive,
      sort_order: entity.sortOrder,
    };
  }

  public static toEntityList(dtos: BannerDTO[]): BannerEntity[] {
    return dtos.map(this.toEntity.bind(this));
  }
}
