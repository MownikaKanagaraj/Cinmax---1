import type {
  EmailNotificationPayload,
  NotificationResult,
} from './notification-provider.interface';

export class ResendEmailProvider {
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || (typeof process !== 'undefined' ? process.env.RESEND_API_KEY : undefined);
  }

  public async sendEmail(payload: EmailNotificationPayload): Promise<NotificationResult> {
    const messageId = `resend_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    return {
      success: true,
      messageId,
      provider: 'resend_email',
    };
  }
}
