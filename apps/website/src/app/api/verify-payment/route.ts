import { NextResponse } from 'next/server';
import { RazorpayProvider } from '@cinmax/api';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const razorpay_order_id = body.razorpay_order_id || body.razorpayOrderId;
    const razorpay_payment_id = body.razorpay_payment_id || body.razorpayPaymentId;
    const razorpay_signature = body.razorpay_signature || body.razorpaySignature;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required Razorpay payment verification fields.' },
        { status: 400 }
      );
    }

    const provider = new RazorpayProvider();
    const isValid = await provider.verifyPayment({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Signature verification failed. Payment not verified.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Razorpay payment verified successfully.',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error: any) {
    console.error('API verify-payment error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to verify payment signature' },
      { status: 500 }
    );
  }
}
