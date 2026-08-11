import { NextResponse } from 'next/server';
import { RazorpayProvider } from '@cinmax/api';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { amount, currency = 'INR', receipt, notes } = body;

    // Amount in paise (minimum ₹1 = 100 paise)
    const rawAmount = Number(amount) || 100;
    const amountInPaise = Math.max(100, Math.round(rawAmount < 100 ? rawAmount * 100 : rawAmount));

    if (amountInPaise < 100) {
      return NextResponse.json(
        { error: 'Invalid amount. Minimum amount is 100 paise (₹1).' },
        { status: 400 }
      );
    }

    const provider = new RazorpayProvider();
    const result = await provider.createOrder({
      amount: amountInPaise,
      currency: currency || 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    });

    return NextResponse.json({
      order_id: result.providerOrderId,
      providerOrderId: result.providerOrderId,
      amount: result.amount,
      currency: result.currency,
      key_id: result.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TND5mOhcC1aMBW',
    });
  } catch (error: any) {
    console.error('API create-order error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create Razorpay order' },
      { status: 500 }
    );
  }
}
