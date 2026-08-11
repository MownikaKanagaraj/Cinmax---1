import { NotificationEntity } from './entity';

export interface INotificationRepository {
  getAll(userId?: string): Promise<NotificationEntity[]>;
  getUnreadCount(userId?: string): Promise<number>;
  markAsRead(id: string): Promise<NotificationEntity>;
  markAllAsRead(userId?: string): Promise<void>;
}
