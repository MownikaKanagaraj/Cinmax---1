import type {
  WhatsAppNotificationPayload,
  NotificationResult,
} from './notification-provider.interface';

export class WhatsAppProvider {
  public async sendWhatsApp(payload: WhatsAppNotificationPayload): Promise<NotificationResult> {
    const messageId = `wa_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    return {
      success: true,
      messageId,
      provider: 'whatsapp_business',
    };
  }
}
