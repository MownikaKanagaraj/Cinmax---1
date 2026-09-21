export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { TelegramNotificationProvider } from '@cinmax/api';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { botToken, chatId, messageType, customMessage } = body;

    const provider = new TelegramNotificationProvider({
      botToken: botToken || process.env.TELEGRAM_BOT_TOKEN,
      adminChatId: chatId || process.env.TELEGRAM_ADMIN_CHAT_ID,
    });

    let result;
    if (messageType === 'new_order') {
      result = await provider.sendNewOrderAlert({
        orderId: 'CGP202608000001',
        customerName: 'Aarav Sharma',
        amount: '1,599',
        paymentMethod: 'Razorpay Online (UPI)',
        itemCount: 3,
      });
    } else if (messageType === 'low_stock') {
      result = await provider.sendLowStockAlert({
        productName: 'French Green Clay & Eucalyptus Bar',
        stockLeft: 4,
      });
    } else {
      result = await provider.sendMessage(
        customMessage || '<b>[CINMAX TEST ALERT]</b>\n\nTelegram Admin Notification channel connected successfully!'
      );
    }

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
