import type { AppNotification } from '@cinmax/types';
import type { NotificationDTO } from './dto';
import { NotificationEntity } from './entity';

export class NotificationMapper {
  public static toEntity(dto: NotificationDTO): NotificationEntity {
    return new NotificationEntity({
      id: dto.id,
      userId: dto.user_id ?? undefined,
      type: dto.type as any,
      title: dto.title,
      message: dto.message,
      link: dto.link ?? undefined,
      isRead: dto.is_read,
      createdAt: dto.created_at,
    });
  }

  public static toDTO(entity: AppNotification | NotificationEntity): NotificationDTO {
    return {
      id: entity.id,
      user_id: entity.userId ?? null,
      type: entity.type,
      title: entity.title,
      message: entity.message,
      link: entity.link ?? null,
      is_read: entity.isRead,
      created_at: entity.createdAt,
    };
  }

  public static toEntityList(dtos: NotificationDTO[]): NotificationEntity[] {
    return dtos.map(this.toEntity.bind(this));
  }
}
