import { NextResponse } from 'next/server';
import { RazorpayProvider, getContainer } from '@cinmax/api';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      playlistId,
      productId,
      amount,
    } = body;

    const orderId = razorpay_order_id || body.razorpayOrderId;
    const paymentId = razorpay_payment_id || body.razorpayPaymentId;
    const signature = razorpay_signature || body.razorpaySignature;

    if (!userId || !playlistId) {
      return NextResponse.json(
        { error: 'User ID and Playlist ID are required for playlist purchase verification.' },
        { status: 400 }
      );
    }

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { error: 'Missing required Razorpay payment verification fields.' },
        { status: 400 }
      );
    }

    // 1. Verify Razorpay Signature
    const provider = new RazorpayProvider();
    const isValid = await provider.verifyPayment({
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
    });

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Signature verification failed. Payment not verified.' },
        { status: 400 }
      );
    }

    // 2. Write Purchase Record into Supabase Database
    const container = getContainer();
    const purchase = await container.playlistRepo.recordPlaylistPurchase({
      userId,
      playlistId,
      productId: productId || undefined,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      amountPaid: Number(amount) || 0,
      paymentStatus: 'verified',
    });

    return NextResponse.json({
      success: true,
      message: 'Razorpay payment verified successfully. Playlist unlocked permanently for user.',
      playlistId,
      purchaseId: purchase.id,
      accessStatus: 'active',
    });
  } catch (error: any) {
    console.error('API verify-playlist-payment error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to verify playlist payment signature' },
      { status: 500 }
    );
  }
}
