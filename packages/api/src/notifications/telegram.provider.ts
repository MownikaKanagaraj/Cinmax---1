/**
 * Telegram Bot Notification Service for CINMAX Internal Admin Alerts
 * Bot tokens and chat IDs are kept secure on the backend.
 */

export interface TelegramConfig {
  botToken?: string;
  adminChatId?: string;
}

export interface NewOrderAlertPayload {
  orderId: string;
  customerName: string;
  amount: number | string;
  paymentMethod: string;
  itemCount?: number;
}

export interface LowStockAlertPayload {
  productName: string;
  stockLeft: number;
  threshold?: number;
}

export class TelegramNotificationProvider {
  private botToken: string;
  private chatId: string;

  constructor(config?: TelegramConfig) {
    this.botToken = config?.botToken || process.env.TELEGRAM_BOT_TOKEN || '';
    this.chatId = config?.adminChatId || process.env.TELEGRAM_ADMIN_CHAT_ID || '';
  }

  /**
   * Send a formatted Telegram message to the internal admin channel/chat
   */
  async sendMessage(text: string): Promise<{ success: boolean; error?: string }> {
    if (!this.botToken || !this.chatId) {
      // In development or mock mode, log to console
      console.log('[Telegram Admin Alert]', text);
      return { success: true };
    }

    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: text,
          parse_mode: 'HTML',
        }),
      });

      const data = await response.json();
      if (!data.ok) {
        return { success: false, error: data.description || 'Telegram API error' };
      }

      return { success: true };
    } catch (err: any) {
      console.error('[Telegram Notification Error]', err);
      return { success: false, error: err?.message || 'Network error' };
    }
  }

  /**
   * Alert admin when a new order is received
   */
  async sendNewOrderAlert(payload: NewOrderAlertPayload): Promise<{ success: boolean; error?: string }> {
    const message = `<b>[NEW ORDER RECEIVED]</b>\n\n` +
      `<b>Order ID:</b> <code>${payload.orderId}</code>\n` +
      `<b>Customer:</b> ${payload.customerName}\n` +
      `<b>Amount:</b> ₹${payload.amount}\n` +
      `<b>Payment:</b> ${payload.paymentMethod}\n` +
      (payload.itemCount ? `<b>Items:</b> ${payload.itemCount}\n` : '') +
      `\n🔗 <a href="${process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001'}/orders/${payload.orderId}">View in Admin Dashboard</a>`;

    return this.sendMessage(message);
  }

  /**
   * Alert admin when product stock is low
   */
  async sendLowStockAlert(payload: LowStockAlertPayload): Promise<{ success: boolean; error?: string }> {
    const message = `<b>[LOW STOCK ALERT]</b>\n\n` +
      `<b>Product:</b> ${payload.productName}\n` +
      `<b>Stock Left:</b> <b>${payload.stockLeft}</b> units left\n` +
      `\n🔗 <a href="${process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001'}/products">Manage Products</a>`;

    return this.sendMessage(message);
  }
}

export const telegramNotifier = new TelegramNotificationProvider();
