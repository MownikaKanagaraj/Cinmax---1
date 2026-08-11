import type { ProductReview } from '@cinmax/types/domain';
import type { ReviewDTO } from './dto';
import { ReviewEntity } from './entity';

export class ReviewMapper {
  public static toEntity(dto: ReviewDTO): ReviewEntity {
    return new ReviewEntity({
      id: dto.id,
      productId: dto.product_id,
      userId: dto.user_id,
      authorName: dto.author_name,
      rating: Number(dto.rating),
      title: dto.title,
      content: dto.content,
      scentRating: dto.scent_rating ?? undefined,
      latherRating: dto.lather_rating ?? undefined,
      moistureRating: dto.moisture_rating ?? undefined,
      isVerifiedPurchaser: dto.is_verified_purchaser,
      helpfulCount: dto.helpful_count,
      images: dto.images || [],
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
    });
  }

  public static toDTO(entity: ProductReview | ReviewEntity): ReviewDTO {
    return {
      id: entity.id,
      product_id: entity.productId,
      user_id: entity.userId || '',
      author_name: entity.authorName,
      rating: entity.rating,
      title: entity.title,
      content: entity.content,
      scent_rating: entity.scentRating ?? null,
      lather_rating: entity.latherRating ?? null,
      moisture_rating: entity.moistureRating ?? null,
      is_verified_purchaser: entity.isVerifiedPurchaser,
      helpful_count: entity.helpfulCount,
      images: entity.images ?? null,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    };
  }

  public static toEntityList(dtos: ReviewDTO[]): ReviewEntity[] {
    return dtos.map(this.toEntity.bind(this));
  }
}
