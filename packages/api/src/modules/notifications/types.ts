import type { AppNotification, NotificationType } from '@cinmax/types';

export interface SendNotificationPayload {
  userId?: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
}

export interface MarkNotificationReadPayload {
  notificationId: string;
  isRead: boolean;
}
