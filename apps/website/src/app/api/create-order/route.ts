import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { RazorpayProvider, getContainer } from '@cinmax/api';
import { calculateDeliveryCharge } from '@cinmax/utils';

export const runtime = 'edge';

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
    const {
      amount,
      currency = 'INR',
      receipt,
      notes,
      playlistId,
      cartItems,
      couponCode,
      loyaltyPointsRedeemed = 0,
      deliveryState = 'Tamil Nadu',
      userId,
    } = body;

    let calculatedGrandTotal = 0;
    let validatedLoyaltyPointsRedeemed = 0;

    const container = getContainer();

    // 1. PLAYLIST ORDER PRICE VERIFICATION
    if (playlistId) {
      const playlist = await container.playlistRepo.getPlaylistById(playlistId);
      if (playlist) {
        calculatedGrandTotal = playlist.price;
      }
    } 
    // 2. CART ITEMS ORDER PRICE VERIFICATION
    else if (Array.isArray(cartItems) && cartItems.length > 0) {
      let subtotal = 0;
      let totalProducts = 0;

      for (const item of cartItems) {
        const qty = Math.max(1, Number(item.quantity) || 1);
        totalProducts += qty;

        // Fetch variant price from database if variantId provided
        if (item.variantId || item.variant_id) {
          const variantId = item.variantId || item.variant_id;
          const { data: variantRow } = await supabase
            .from('product_variants')
            .select('price')
            .eq('id', variantId)
            .maybeSingle();

          const unitPrice = variantRow?.price ? Number(variantRow.price) : Number(item.unitPrice || item.price || 0);
          subtotal += unitPrice * qty;
        } else {
          subtotal += Number(item.unitPrice || item.price || 0) * qty;
        }
      }

      // Coupon Validation
      let couponDiscount = 0;
      if (couponCode) {
        const valRes = await container.couponRepo.validate(couponCode, subtotal);
        if (valRes.isValid && valRes.coupon) {
          couponDiscount = valRes.coupon.discountType === 'percentage'
            ? Math.round((subtotal * valRes.coupon.discountValue) / 100)
            : Math.round(valRes.coupon.discountValue);
        }
      }

      // User Database Loyalty Balance Check & 20% Net Subtotal Cap
      let userLoyaltyBalance = 0;
      if (userId) {
        const { data: profileRow } = await supabase
          .from('profiles')
          .select('loyalty_points')
          .eq('id', userId)
          .maybeSingle();
        userLoyaltyBalance = Math.max(0, Number(profileRow?.loyalty_points) || 0);
      }

      const afterCoupon = Math.max(0, subtotal - couponDiscount);
      const maxLoyaltyRedemption = Math.floor(afterCoupon * 0.20);
      validatedLoyaltyPointsRedeemed = Math.max(0, Math.min(userLoyaltyBalance, maxLoyaltyRedemption, Math.floor(Number(loyaltyPointsRedeemed) || 0)));
      const pointsDiscount = validatedLoyaltyPointsRedeemed; // 1 Point = ₹1

      const netProductPrice = Math.max(0, afterCoupon - pointsDiscount);

      // Delivery calculation
      const deliveryCalc = calculateDeliveryCharge(deliveryState, totalProducts);
      calculatedGrandTotal = Math.max(0, netProductPrice + deliveryCalc.deliveryCharge);
    }

    // Fallback to client-passed amount if no DB items supplied, but cap floor at ₹1
    const finalAmount = calculatedGrandTotal > 0 ? calculatedGrandTotal : Number(amount) || 0;

    if (finalAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid order amount. Must be greater than zero.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const provider = new RazorpayProvider();
    const result = await provider.createOrder({
      amount: finalAmount,
      currency: currency || 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: {
        ...notes,
        playlistId: playlistId || '',
        loyaltyPointsRedeemed: validatedLoyaltyPointsRedeemed.toString(),
        serverVerifiedAmount: finalAmount.toString(),
      },
    });

    return NextResponse.json(
      {
        order_id: result.providerOrderId,
        providerOrderId: result.providerOrderId,
        amount: result.amount,
        currency: result.currency,
        key_id: result.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TX6kmNNGbn83QI',
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('API create-order error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create Razorpay order' },
      { status: 500, headers: corsHeaders }
    );
  }
}
