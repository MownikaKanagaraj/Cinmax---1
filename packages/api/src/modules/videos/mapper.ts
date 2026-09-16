import { VideoEntity, UserVideoPurchaseEntity } from './entity';
import type { VideoDTO, UserVideoPurchaseDTO } from './dto';

export class VideoMapper {
  public static toEntity(dto: VideoDTO): VideoEntity {
    return new VideoEntity(
      dto.id,
      dto.title,
      dto.description,
      dto.youtube_url,
      dto.youtube_id,
      dto.thumbnail_url || `https://img.youtube.com/vi/${dto.youtube_id}/hqdefault.jpg`,
      Number(dto.price) || 0,
      Boolean(dto.is_published),
      Number(dto.sort_order) || 0,
      dto.created_at,
      dto.updated_at
    );
  }

  public static purchaseToEntity(dto: UserVideoPurchaseDTO): UserVideoPurchaseEntity {
    return new UserVideoPurchaseEntity(
      dto.id,
      dto.user_id,
      dto.video_id,
      dto.payment_id,
      Number(dto.amount_paid) || 0,
      dto.purchased_at
    );
  }
}
