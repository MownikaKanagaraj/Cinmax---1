import { mockNotificationsData } from '../../mockData';
import { NotificationEntity } from './entity';
import type { INotificationRepository } from './repository.interface';

export class MockNotificationRepository implements INotificationRepository {
  private notifications: NotificationEntity[];

  constructor(initialData?: NotificationEntity[]) {
    this.notifications =
      initialData || mockNotificationsData.map((n) => new NotificationEntity(n));
  }

  public async getAll(userId?: string): Promise<NotificationEntity[]> {
    const result = userId
      ? this.notifications.filter((n) => !n.userId || n.userId === userId)
      : this.notifications;
    return [...result].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public async getUnreadCount(userId?: string): Promise<number> {
    const list = await this.getAll(userId);
    return list.filter((n) => !n.isRead).length;
  }

  public async markAsRead(id: string): Promise<NotificationEntity> {
    const index = this.notifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      this.notifications[index] = this.notifications[index].markAsRead();
      return this.notifications[index];
    }
    throw new Error(`Notification ${id} not found`);
  }

  public async markAllAsRead(userId?: string): Promise<void> {
    this.notifications = this.notifications.map((n) => {
      if (!userId || !n.userId || n.userId === userId) {
        return n.markAsRead();
      }
      return n;
    });
  }
}
