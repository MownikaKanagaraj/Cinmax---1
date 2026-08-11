export interface PushNotificationPayload {
  targetTokenOrTopic: string;
  title: string;
  body: string;
  imageUrl?: string;
  data?: Record<string, string>;
  deepLink?: string;
}

export interface EmailNotificationPayload {
  to: string;
  subject: string;
  template: 'welcome' | 'order_confirmation' | 'invoice' | 'password_reset' | 'order_shipped' | 'order_delivered' | 'refund' | 'return_approved' | 'newsletter';
  variables: Record<string, any>;
  attachments?: Array<{
    filename: string;
    content: string; // Base64 or HTML string
  }>;
}

export interface SMSNotificationPayload {
  phone: string;
  message: string;
  templateId?: string;
}

export interface WhatsAppNotificationPayload {
  phone: string;
  templateName: string;
  languageCode?: string;
  parameters: Array<{
    type: 'text' | 'currency' | 'date_time';
    text?: string;
  }>;
  trackingLink?: string;
}

export interface NotificationResult {
  success: boolean;
  messageId: string;
  provider: string;
  error?: string;
}

export interface INotificationProvider {
  sendPush(payload: PushNotificationPayload): Promise<NotificationResult>;
  sendEmail(payload: EmailNotificationPayload): Promise<NotificationResult>;
  sendSMS(payload: SMSNotificationPayload): Promise<NotificationResult>;
  sendWhatsApp(payload: WhatsAppNotificationPayload): Promise<NotificationResult>;
}
