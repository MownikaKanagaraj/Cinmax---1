'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { Container, Button, Badge } from '@cinmax/ui';
import { GrandPaymentSuccessModal } from '../../components/grand-payment-success-modal';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const rawOrderNum = searchParams.get('order_number');
  const paymentId = searchParams.get('payment_id') || '';
  const rawPoints = searchParams.get('points_earned');
  const pointsEarned = rawPoints ? Number(rawPoints) || 0 : 0;

  const orderNumber = rawOrderNum || 'CGP20260829001';

  // 1. Initial State: Green Payment Successful Page displays FIRST
  const [isCelebrating, setIsCelebrating] = React.useState(false);

  // 2. After Green Payment Successful screen completes initial display, transition to Grand Thank You Popup automatically
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storageKey = `order_celebrated_${orderNumber}`;
      const alreadyCelebrated = sessionStorage.getItem(storageKey);

      if (alreadyCelebrated === 'true') {
        return;
      }

      sessionStorage.setItem(storageKey, 'true');
      setIsCelebrating(true);
    }
  }, [orderNumber]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white relative">
      <Header />

      {/* GRAND CINMAX THANK YOU POPUP (Transitions automatically after Green Payment Successful screen is shown) */}
      <GrandPaymentSuccessModal
        isOpen={isCelebrating}
        onClose={() => setIsCelebrating(false)}
        orderNumber={orderNumber}
        pointsEarned={pointsEarned}
      />

      {/* GREEN PAYMENT SUCCESSFUL PAGE CONTENT */}
      <main className="flex-1 py-16 flex items-center justify-center">
        <Container size="md">
          <div className="text-center p-8 sm:p-12 rounded-[28px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-2xl space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="space-y-2">
              <Badge variant="gold">Order Confirmed</Badge>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#002754] dark:text-white">
                Thank You for Choosing Botanical Purity
              </h1>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                We have received your order and our atelier is preparing your cured botanical formulations for shipment.
              </p>
            </div>

            <div className="p-4 rounded-[16px] bg-[#F7F9FB] dark:bg-[#0A192F] text-xs font-mono text-muted-foreground flex flex-col gap-2 max-w-sm mx-auto border border-[#0A3D78]/10">
              <div className="flex justify-between items-center w-full">
                <span>Order Reference:</span>
                <strong className="text-foreground font-bold">{orderNumber}</strong>
              </div>
              {paymentId && (
                <div className="flex justify-between items-center w-full border-t border-muted/20 pt-2">
                  <span>Razorpay Payment ID:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{paymentId}</strong>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button variant="primary" size="md" className="rounded-full">
                <Link href={`/orders/${orderNumber}/track`}>Track Courier Dispatch</Link>
              </Button>
              <Button variant="outline" size="md" className="rounded-full">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}

function OrderSuccessFallback() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white relative">
      <Header />
      <main className="flex-1 py-16 flex items-center justify-center">
        <Container size="md">
          <div className="text-center p-8 sm:p-12 rounded-[28px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-2xl space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#002754] dark:text-white">
              Confirming Your Payment...
            </h1>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <React.Suspense fallback={<OrderSuccessFallback />}>
      <OrderSuccessContent />
    </React.Suspense>
  );
}

