'use client';

import * as React from 'react';
import Link from 'next/link';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { Container, Button, Badge } from '@cinmax/ui';

export default function OrderSuccessPage() {
  const orderNumber = 'CNX-20260802-8492';

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />

      <main className="flex-1 py-16 flex items-center justify-center">
        <Container size="md">
          <div className="text-center p-8 sm:p-12 rounded-[28px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-2xl space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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

            <div className="p-4 rounded-[16px] bg-[#F7F9FB] dark:bg-[#0A192F] text-xs font-mono text-muted-foreground flex justify-between items-center max-w-sm mx-auto">
              <span>Order Reference:</span>
              <strong className="text-foreground">{orderNumber}</strong>
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
