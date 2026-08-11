import type {
  PushNotificationPayload,
  NotificationResult,
} from './notification-provider.interface';

export class FirebasePushProvider {
  public async sendPush(payload: PushNotificationPayload): Promise<NotificationResult> {
    const messageId = `fcm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    return {
      success: true,
      messageId,
      provider: 'firebase_cloud_messaging',
    };
  }
}
