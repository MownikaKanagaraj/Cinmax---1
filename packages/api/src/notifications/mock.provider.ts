import type {
  INotificationProvider,
  PushNotificationPayload,
  EmailNotificationPayload,
  SMSNotificationPayload,
  WhatsAppNotificationPayload,
  NotificationResult,
} from './notification-provider.interface';

export class MockNotificationProvider implements INotificationProvider {
  public sentLogs: Array<{ type: string; payload: any; timestamp: string }> = [];

  public async sendPush(payload: PushNotificationPayload): Promise<NotificationResult> {
    const messageId = `mock_push_${Date.now()}`;
    this.sentLogs.push({ type: 'push', payload, timestamp: new Date().toISOString() });
    return { success: true, messageId, provider: 'mock_push' };
  }

  public async sendEmail(payload: EmailNotificationPayload): Promise<NotificationResult> {
    const messageId = `mock_email_${Date.now()}`;
    this.sentLogs.push({ type: 'email', payload, timestamp: new Date().toISOString() });
    return { success: true, messageId, provider: 'mock_email' };
  }

  public async sendSMS(payload: SMSNotificationPayload): Promise<NotificationResult> {
    const messageId = `mock_sms_${Date.now()}`;
    this.sentLogs.push({ type: 'sms', payload, timestamp: new Date().toISOString() });
    return { success: true, messageId, provider: 'mock_sms' };
  }

  public async sendWhatsApp(payload: WhatsAppNotificationPayload): Promise<NotificationResult> {
    const messageId = `mock_wa_${Date.now()}`;
    this.sentLogs.push({ type: 'whatsapp', payload, timestamp: new Date().toISOString() });
    return { success: true, messageId, provider: 'mock_whatsapp' };
  }
}
