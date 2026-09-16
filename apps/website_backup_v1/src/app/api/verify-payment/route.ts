import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { RazorpayProvider, RewardPointEngine } from '@cinmax/api';
import { calculateDeliveryCharge } from '@cinmax/utils';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nthyavlzdgucrldtgjeo.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aHlhdmx6ZGd1Y3JsZHRnamVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTc1NTYwMCwiZXhwIjoyMTAxMzMxNjAwfQ.WhVVQo2bsvvo3NN8isPSbaQNUPef8MloYdjG3B_LaU0';

const supabase = createClient(supabaseUrl, supabaseKey);

function getCorsHeaders(request?: Request) {
  const origin = request?.headers.get('origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin === 'null' ? '*' : origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
  };
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}

export async function POST(request: Request) {
  const corsHeaders = getCorsHeaders(request);
  try {
    const body = await request.json().catch(() => ({}));
    const razorpay_order_id = body.razorpay_order_id || body.razorpayOrderId;
    const razorpay_payment_id = body.razorpay_payment_id || body.razorpayPaymentId;
    const razorpay_signature = body.razorpay_signature || body.razorpaySignature;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required Razorpay payment verification fields.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // 1. HMAC Signature Verification
    const provider = new RazorpayProvider();
    const isValid = await provider.verifyPayment({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Signature verification failed. Payment not verified.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // 2. Duplicate Payment / Order Prevention Check
    const { data: existingTx } = await supabase
      .from('payment_transactions')
      .select('id, order_id, orders(order_number)')
      .eq('razorpay_payment_id', razorpay_payment_id)
      .maybeSingle();

    if (existingTx) {
      const existingOrderNum = (existingTx.orders as any)?.order_number || 'EXISTING';
      return NextResponse.json(
        {
          success: true,
          message: 'Payment already processed and verified.',
          paymentId: razorpay_payment_id,
          orderId: existingTx.order_id,
          orderNumber: existingOrderNum,
          duplicate: true,
        },
        { status: 200, headers: corsHeaders }
      );
    }

    // 3. Prepare Order & Pricing Amounts with Centralized Backend Delivery Charge Algorithm
    const subtotal = Number(body.subtotal) || 0;
    const discountAmount = Number(body.discountAmount) || Number(body.couponDiscount) || 0;
    const netProductPrice = Math.max(0, subtotal - discountAmount);

    const shippingAddress = body.shippingAddress || {
      firstName: 'Aanya',
      lastName: 'Sharma',
      street: 'Villa 42, Lotus Boulevard, Sector 100',
      city: 'Chennai',
      state: body.deliveryState || 'Tamil Nadu',
      postalCode: '600001',
      country: 'India',
    };

    const totalProductsQty = Array.isArray(body.cartItems) && body.cartItems.length > 0
      ? body.cartItems.reduce((sum: number, item: any) => sum + (Number(item.quantity) || 1), 0)
      : 1;

    const deliveryDetails = calculateDeliveryCharge(shippingAddress.state, totalProductsQty);
    const shippingAmount = deliveryDetails.deliveryCharge;
    const taxAmount = Number(body.taxAmount) || Math.round((netProductPrice * 18) / 118);
    const grandTotal = Math.max(0, netProductPrice + shippingAmount);
    const userId = body.userId || null;

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `CGP${dateStr}${randSuffix}`;

    const orderUuid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `00000000-0000-4000-8000-${Date.now().toString(16).padStart(12, '0')}`;

    // 4. Save Confirmed Order to Supabase `orders` table
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderUuid,
        order_number: orderNumber,
        user_id: userId,
        status: 'confirmed',
        payment_status: 'paid',
        shipping_address: shippingAddress,
        billing_address: body.billingAddress || shippingAddress,
        subtotal: subtotal,
        discount_total: discountAmount,
        tax_total: taxAmount,
        shipping_total: shippingAmount,
        grand_total: grandTotal,
        currency: body.currency || 'INR',
        payment_method: 'razorpay',
        payment_intent_id: razorpay_payment_id,
      })
      .select('id, order_number')
      .single();

    if (orderError) {
      console.error('Error inserting order into Supabase:', orderError);
    }

    const dbOrderId = newOrder?.id || orderUuid;
    const finalOrderNumber = newOrder?.order_number || orderNumber;

    // 5. Save Payment Transaction to Supabase `payment_transactions` table
    const { error: txError } = await supabase.from('payment_transactions').insert({
      order_id: dbOrderId || null,
      user_id: userId,
      provider: 'razorpay',
      transaction_id: razorpay_payment_id,
      razorpay_order_id: razorpay_order_id,
      razorpay_payment_id: razorpay_payment_id,
      razorpay_signature: razorpay_signature,
      status: 'captured',
      amount: grandTotal,
      currency: body.currency || 'INR',
      metadata: {
        deliveryState: body.deliveryState || shippingAddress.state,
        itemsCount: Array.isArray(body.cartItems) ? body.cartItems.length : 0,
      },
    });

    if (txError) {
      console.error('Error inserting payment_transaction into Supabase:', txError);
    }

    // 6. Save Line Items to `order_items` table
    if (dbOrderId && Array.isArray(body.cartItems) && body.cartItems.length > 0) {
      const isUuid = (val?: string) =>
        typeof val === 'string' &&
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(val);

      const itemsToInsert = body.cartItems.map((item: any) => {
        const rawProdId = item.productId || item.id;
        const rawVarId = item.variantId;
        return {
          order_id: dbOrderId,
          product_id: isUuid(rawProdId) ? rawProdId : null,
          variant_id: isUuid(rawVarId) ? rawVarId : null,
          product_title: item.title || item.name || 'Artisanal Botanical Product',
          variant_title: item.variantTitle || item.variant || 'Standard',
          sku: item.sku || `CGP-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
          unit_price: Number(item.price) || Number(item.unitPrice) || 0,
          quantity: Number(item.quantity) || 1,
          total_price: (Number(item.price) || Number(item.unitPrice) || 0) * (Number(item.quantity) || 1),
          image_url: item.image || item.imageUrl || null,
        };
      });

      const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
      if (itemsError) {
        console.error('Error inserting order_items into Supabase:', itemsError);
      }
    }

    // 7. Save Order Timeline Record to `order_status_history`
    if (dbOrderId) {
      await supabase.from('order_status_history').insert({
        order_id: dbOrderId,
        status: 'confirmed',
        previous_status: 'pending',
        reason: `Razorpay Online Payment Verified (${razorpay_payment_id})`,
      });
    }

    // 8. LOYALTY TRANSACTIONS & ATOMIC POINTS BALANCE UPDATE
    if (userId) {
      try {
        // Fetch User Profile to get real loyalty_tier
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('loyalty_tier')
          .eq('id', userId)
          .maybeSingle();

        const userTier = (userProfile?.loyalty_tier as any) || 'bronze';
        const calcResult = RewardPointEngine.calculatePoints(netProductPrice, userTier);
        const pointsEarned = calcResult.pointsEarned;
        const requestedPointsRedeemed = Math.max(0, Math.floor(Number(body.loyaltyPointsRedeemed) || 0));

        // 8a. Process Redemption via Atomic Stored Procedure
        if (requestedPointsRedeemed > 0) {
          const { data: rpcRes, error: rpcErr } = await supabase.rpc('process_loyalty_transaction', {
            p_user_id: userId,
            p_order_id: dbOrderId || null,
            p_transaction_type: 'REDEEM',
            p_points: requestedPointsRedeemed,
            p_description: `Redeemed ${requestedPointsRedeemed} points for Order ${finalOrderNumber}`,
          });

          if (rpcErr) {
            console.warn('[verify-payment] RPC process_loyalty_transaction for REDEEM unavailable, falling back:', rpcErr);
            const { data: profile } = await supabase
              .from('profiles')
              .select('loyalty_points')
              .eq('id', userId)
              .maybeSingle();

            const currentPoints = Math.max(0, Number(profile?.loyalty_points) || 0);
            const validRedeem = Math.min(currentPoints, requestedPointsRedeemed);
            if (validRedeem > 0) {
              const newBal = currentPoints - validRedeem;
              await supabase.from('loyalty_transactions').insert({
                user_id: userId,
                order_id: dbOrderId || null,
                transaction_type: 'REDEEM',
                points: -validRedeem,
                balance_after: newBal,
                description: `Redeemed ${validRedeem} points for Order ${finalOrderNumber}`,
              });
              await supabase.from('profiles').update({ loyalty_points: newBal, updated_at: new Date().toISOString() }).eq('id', userId);
            }
          }
        }

        // 8b. Process Points Earning via Atomic Stored Procedure (Prevent Duplicate Earning)
        if (pointsEarned > 0) {
          const { data: rpcEarnRes, error: rpcEarnErr } = await supabase.rpc('process_loyalty_transaction', {
            p_user_id: userId,
            p_order_id: dbOrderId || null,
            p_transaction_type: 'EARN',
            p_points: pointsEarned,
            p_description: `Earned ${pointsEarned} points for Order ${finalOrderNumber}`,
          });

          if (rpcEarnErr) {
            console.warn('[verify-payment] RPC process_loyalty_transaction for EARN unavailable, falling back:', rpcEarnErr);
            // Fallback with explicit duplicate check
            const { data: existingEarn } = await supabase
              .from('loyalty_transactions')
              .select('id')
              .eq('user_id', userId)
              .eq('order_id', dbOrderId)
              .eq('transaction_type', 'EARN')
              .maybeSingle();

            if (!existingEarn) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('loyalty_points')
                .eq('id', userId)
                .maybeSingle();

              const currentPoints = Math.max(0, Number(profile?.loyalty_points) || 0);
              const newBal = currentPoints + pointsEarned;
              await supabase.from('loyalty_transactions').insert({
                user_id: userId,
                order_id: dbOrderId || null,
                transaction_type: 'EARN',
                points: pointsEarned,
                balance_after: newBal,
                description: `Earned ${pointsEarned} points for Order ${finalOrderNumber}`,
              });
              await supabase.from('profiles').update({ loyalty_points: newBal, updated_at: new Date().toISOString() }).eq('id', userId);
            }
          }
        }
      } catch (loyaltyErr) {
        console.error('Error logging loyalty transaction:', loyaltyErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Razorpay payment verified & order recorded in Supabase successfully.',
        paymentId: razorpay_payment_id,
        orderId: dbOrderId || razorpay_order_id,
        orderNumber: finalOrderNumber,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('API verify-payment error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to verify payment signature' },
      { status: 500, headers: corsHeaders }
    );
  }
}

