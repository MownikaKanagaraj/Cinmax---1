import type { INotificationRepository, NotificationEntity } from '../modules/notifications';
import {
  GetNotificationsUseCase,
  GetUnreadNotificationsCountUseCase,
  MarkNotificationAsReadUseCase,
  MarkAllNotificationsAsReadUseCase,
} from '../modules/notifications/useCases';

export class NotificationService {
  private getNotificationsUseCase: GetNotificationsUseCase;
  private getUnreadCountUseCase: GetUnreadNotificationsCountUseCase;
  private markAsReadUseCase: MarkNotificationAsReadUseCase;
  private markAllAsReadUseCase: MarkAllNotificationsAsReadUseCase;

  constructor(private notificationRepo: INotificationRepository) {
    this.getNotificationsUseCase = new GetNotificationsUseCase(notificationRepo);
    this.getUnreadCountUseCase = new GetUnreadNotificationsCountUseCase(notificationRepo);
    this.markAsReadUseCase = new MarkNotificationAsReadUseCase(notificationRepo);
    this.markAllAsReadUseCase = new MarkAllNotificationsAsReadUseCase(notificationRepo);
  }

  public async getNotifications(userId?: string): Promise<NotificationEntity[]> {
    return this.getNotificationsUseCase.execute(userId);
  }

  public async getUnreadCount(userId?: string): Promise<number> {
    return this.getUnreadCountUseCase.execute(userId);
  }

  public async markAsRead(id: string): Promise<NotificationEntity> {
    return this.markAsReadUseCase.execute(id);
  }

  public async markAllAsRead(userId?: string): Promise<void> {
    return this.markAllAsReadUseCase.execute(userId);
  }
}
