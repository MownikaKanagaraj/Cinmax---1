import { NextResponse } from 'next/server';
import { RazorpayProvider, getContainer } from '@cinmax/api';

export const runtime = 'edge';

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

    if (!playlistId) {
      return NextResponse.json(
        { error: 'Playlist ID is required for playlist purchase verification.' },
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
      userId: userId || 'guest_patron',
      playlistId,
      productId: productId || undefined,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      amountPaid: Number(amount) || 0,
      paymentStatus: 'verified',
    });

    // 3. Record in `payment_transactions` for central Admin Treasury ledger
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nthyavlzdgucrldtgjeo.supabase.co';
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aHlhdmx6ZGd1Y3JsZHRnamVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTc1NTYwMCwiZXhwIjoyMTAxMzMxNjAwfQ.WhVVQo2bsvvo3NN8isPSbaQNUPef8MloYdjG3B_LaU0';
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: existingTx } = await supabase
        .from('payment_transactions')
        .select('id')
        .or(`razorpay_payment_id.eq.${paymentId},transaction_id.eq.${paymentId}`)
        .maybeSingle();

      if (existingTx) {
        return NextResponse.json({
          success: true,
          message: 'Playlist payment already verified.',
          playlistId,
          duplicate: true,
        });
      }

      if (!existingTx) {
        const isUuid = (val?: string) =>
          typeof val === 'string' &&
          /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(val);

        const validUserId = isUuid(userId) ? userId : null;

        let resolvedMethod = '';
        let customerEmail = body.email || body.guestEmail || '';
        let customerName = body.customerName || body.fullName || '';

        try {
          const rzpDetails = await provider.fetchPaymentDetails(paymentId);
          if (rzpDetails) {
            if (rzpDetails.method) {
              resolvedMethod = rzpDetails.method;
            } else if (rzpDetails.vpa) {
              resolvedMethod = 'upi';
            } else if (rzpDetails.card) {
              resolvedMethod = 'card';
            } else if (rzpDetails.bank) {
              resolvedMethod = 'netbanking';
            } else if (rzpDetails.wallet) {
              resolvedMethod = 'wallet';
            }
            if (rzpDetails.email && !customerEmail) customerEmail = rzpDetails.email;
          }
        } catch (e) {}

        if (!resolvedMethod) {
          resolvedMethod = body.paymentMethod || body.method || body.razorpay_payment_method || 'upi';
        }

        if (validUserId) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name, email')
            .eq('id', validUserId)
            .maybeSingle();
          if (profile) {
            if (profile.first_name && !customerName) customerName = `${profile.first_name} ${profile.last_name || ''}`.trim();
            if (profile.email && !customerEmail) customerEmail = profile.email;
          }
        }

        const { error: insertErr } = await supabase.from('payment_transactions').insert({
          user_id: validUserId,
          provider: 'razorpay',
          transaction_id: paymentId,
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature,
          status: 'captured',
          amount: Number(amount) || 0,
          currency: body.currency || 'INR',
          metadata: {
            type: 'masterclass',
            playlistId,
            productId: productId || null,
            paymentMethod: resolvedMethod,
            customerName: customerName || null,
            customerEmail: customerEmail || null,
            orderNumber: orderId,
          },
        });

        if (insertErr) {
          console.error('Error inserting playlist payment_transaction into Supabase:', insertErr);
        }
      }
    } catch (dbErr) {
      console.error('Error inserting playlist payment transaction:', dbErr);
    }

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
