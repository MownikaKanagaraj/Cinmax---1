'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { Container, PageHeader, Breadcrumb, Button, Input } from '@cinmax/ui';
import { useCartStore, useAuthStore } from '@cinmax/hooks';
import { formatCurrency, calculateDeliveryCharge } from '@cinmax/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotals, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [paymentMethod, setPaymentMethod] = React.useState('razorpay');
  const [deliveryState, setDeliveryState] = React.useState('Tamil Nadu');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const totals = getTotals();

  // Total Product Quantity
  const totalProducts = (items && items.length > 0)
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 3;

  // Delivery charge algorithm
  const deliveryCalc = calculateDeliveryCharge(deliveryState, totalProducts);
  const deliveryCharge = deliveryCalc.deliveryCharge;
  const subtotal = totals.subtotal || 1200;
  const tax = Math.round(subtotal * 0.18);
  const grandTotal = Math.max(0, subtotal + deliveryCharge + tax);

  // Load Razorpay Standard Checkout Script
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if ((window as any).Razorpay) return resolve(true);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // STEP 2: FRONTEND - Razorpay Standard Web Checkout Handler
  const handleRazorpayCheckout = async () => {
    try {
      setIsProcessing(true);

      // 1. Ensure checkout.js is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert('Failed to load Razorpay SDK. Please check your network connection.');
        setIsProcessing(false);
        return;
      }

      // 2. Call backend create-order endpoint (STEP 1 BACKEND)
      const createRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: grandTotal,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`,
          notes: {
            deliveryState,
            totalProducts: totalProducts.toString(),
          },
        }),
      });

      const orderData = await createRes.json();

      if (!createRes.ok || !orderData.order_id) {
        alert(`Order Creation Error: ${orderData.error || 'Failed to initialize payment'}`);
        setIsProcessing(false);
        return;
      }

      // 3. Configure Razorpay Standard Modal Options
      const options: any = {
        key: orderData?.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TND5mOhcC1aMBW',
        amount: orderData?.amount || Math.round(grandTotal * 100),
        currency: orderData?.currency || 'INR',
        name: 'CINMAX Global Products',
        description: 'Artisanal Botanicals Order',
        handler: async function (response: any) {
          // STEP 3: BACKEND - Verify Signature
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            clearCart();
            alert(`Payment Verified! Payment ID: ${response.razorpay_payment_id}`);
            router.push(`/order-success?payment_id=${response.razorpay_payment_id}`);
          } else {
            alert(`Payment Verification Failed: ${verifyData.error || 'Signature mismatch'}`);
          }
          setIsProcessing(false);
        },
        modal: {
          ondismiss: function () {
            console.log('Razorpay modal dismissed by user');
            setIsProcessing(false);
          },
        },
        prefill: {
          name: `${user?.firstName || 'Aanya'} ${user?.lastName || 'Sharma'}`,
          email: user?.email || 'patron@cinmax.luxury',
          contact: '+919876543210',
        },
        theme: {
          color: '#002754',
        },
      };

      if (orderData?.order_id && typeof orderData.order_id === 'string' && orderData.order_id.startsWith('order_')) {
        options.order_id = orderData.order_id;
      }

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        console.error('Razorpay Payment Failed:', resp.error);
        alert(`Payment Failed: ${resp.error?.description || 'Transaction declined'}`);
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error('Checkout Exception:', err);
      alert(`Payment Exception: ${err.message}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />

      <main className="flex-1 py-10">
        <Container size="xl">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Shopping Bag', href: '/cart' },
              { label: 'Razorpay Checkout', isCurrent: true },
            ]}
          />

          <PageHeader
            badge="Encrypted 256-Bit SSL Checkout"
            title="Razorpay Standard Web Checkout"
            subtitle="Complete your shipping destination and pay securely via Razorpay Online Gateway."
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-6">
            {/* Checkout Multi-Step Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Step 1: Shipping Destination */}
              <div className="p-6 sm:p-8 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#002754] text-white flex items-center justify-center font-bold text-sm">
                    1
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#002754] dark:text-white">
                    Shipping Destination
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
                      First Name
                    </label>
                    <Input defaultValue={user?.firstName || 'Aanya'} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
                      Last Name
                    </label>
                    <Input defaultValue={user?.lastName || 'Sharma'} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
                      Street Address
                    </label>
                    <Input defaultValue="Villa 42, Lotus Boulevard, Sector 100" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
                      City
                    </label>
                    <Input defaultValue="Chennai" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
                      State (Tariff Rule)
                    </label>
                    <select
                      value={deliveryState}
                      onChange={(e) => setDeliveryState(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-[12px] text-xs bg-[#F7F9FB] dark:bg-[#0A192F] border border-[#0A3D78]/20 font-bold"
                    >
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Puducherry">Puducherry</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Other States">Other States</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method (Razorpay Only) */}
              <div className="p-6 sm:p-8 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#002754] text-white flex items-center justify-center font-bold text-sm">
                    2
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#002754] dark:text-white">
                    Razorpay Online Payment Gateway
                  </h3>
                </div>

                <div className="p-5 rounded-[20px] border-2 border-[#002754] bg-[#002754]/5 flex items-center justify-between">
                  <div>
                    <p className="font-serif font-bold text-base text-[#002754] dark:text-white">
                      Razorpay Standard Checkout
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Pay via UPI, Credit/Debit Cards, Netbanking &amp; Wallets
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-[#002754] text-white font-bold text-xs rounded-full">
                    ONLINE ONLY
                  </span>
                </div>
              </div>
            </div>

            {/* Sidebar Summary & Razorpay Checkout Trigger */}
            <div className="space-y-6">
              <div className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-xl space-y-6">
                <h3 className="font-serif text-xl font-bold text-[#002754] dark:text-white">
                  Order Review
                </h3>

                <div className="space-y-3 text-sm border-t border-[#0A3D78]/10 pt-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({totalProducts} units)</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery Charge ({deliveryCalc.state})</span>
                    <span className={deliveryCalc.isFreeDelivery ? 'font-bold text-emerald-600' : ''}>
                      {deliveryCalc.isFreeDelivery ? 'FREE' : formatCurrency(deliveryCharge)}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>GST (18%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between font-serif text-xl font-bold text-[#002754] dark:text-white pt-3 border-t border-[#0A3D78]/10">
                    <span>Grand Total</span>
                    <span>{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  disabled={isProcessing}
                  onClick={handleRazorpayCheckout}
                  className="w-full rounded-full text-base font-bold shadow-2xl py-4 bg-[#002754] hover:bg-[#001d3f] text-white"
                >
                  {isProcessing ? 'Initializing Razorpay...' : `Pay ₹${grandTotal} with Razorpay`}
                </Button>

                <p className="text-[11px] text-center text-muted-foreground">
                  Encrypted 256-bit SSL connection. Your payment credentials are never stored on our servers.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
