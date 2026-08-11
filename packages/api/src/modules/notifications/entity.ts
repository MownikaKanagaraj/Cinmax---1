import type { AppNotification, NotificationType } from '@cinmax/types';

export class NotificationEntity implements AppNotification {
  public id: string;
  public userId?: string;
  public type: NotificationType;
  public title: string;
  public message: string;
  public link?: string;
  public isRead: boolean;
  public createdAt: string;

  constructor(props: AppNotification) {
    this.id = props.id;
    this.userId = props.userId;
    this.type = props.type;
    this.title = props.title;
    this.message = props.message;
    this.link = props.link;
    this.isRead = props.isRead ?? false;
    this.createdAt = props.createdAt || new Date().toISOString();
  }

  public markAsRead(): NotificationEntity {
    return new NotificationEntity({
      ...this,
      isRead: true,
    });
  }
}
