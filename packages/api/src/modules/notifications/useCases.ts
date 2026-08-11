import { NotificationEntity } from './entity';
import type { INotificationRepository } from './repository.interface';

export class GetNotificationsUseCase {
  constructor(private notificationRepo: INotificationRepository) {}

  public async execute(userId?: string): Promise<NotificationEntity[]> {
    return this.notificationRepo.getAll(userId);
  }
}

export class GetUnreadNotificationsCountUseCase {
  constructor(private notificationRepo: INotificationRepository) {}

  public async execute(userId?: string): Promise<number> {
    return this.notificationRepo.getUnreadCount(userId);
  }
}

export class MarkNotificationAsReadUseCase {
  constructor(private notificationRepo: INotificationRepository) {}

  public async execute(id: string): Promise<NotificationEntity> {
    return this.notificationRepo.markAsRead(id);
  }
}

export class MarkAllNotificationsAsReadUseCase {
  constructor(private notificationRepo: INotificationRepository) {}

  public async execute(userId?: string): Promise<void> {
    return this.notificationRepo.markAllAsRead(userId);
  }
}
