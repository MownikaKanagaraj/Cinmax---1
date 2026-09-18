'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '../../../../components/header';
import { Footer } from '../../../../components/footer';
import { Container, PageHeader, Breadcrumb, Badge, Button } from '@cinmax/ui';

export default function TrackOrderClient() {
  const params = useParams();
  const orderId = (params?.id as string) || 'CNX-20260802-8492';

  const steps = [
    { title: 'Order Confirmed', date: 'Aug 2, 09:30 AM', completed: true },
    { title: 'Atelier Packaging & Curing Check', date: 'Aug 2, 11:45 AM', completed: true },
    { title: 'Dispatched with Courier', date: 'Aug 2, 03:20 PM', completed: true },
    { title: 'In Transit to Destination Hub', date: 'Estimated Aug 3', completed: false, current: true },
    { title: 'Delivered', date: 'Estimated Aug 4', completed: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />

      <main className="flex-1 py-10">
        <Container size="md">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Orders', href: '/orders' },
              { label: orderId, href: `/orders/${orderId}` },
              { label: 'Track Shipment', isCurrent: true },
            ]}
          />

          <PageHeader
            badge="Live Telemetry"
            title={`Tracking Shipment`}
            subtitle={`Tracking Number: CNX-TRACK-849201 • Carrier: Atelier Priority Air`}
          />

          <div className="p-8 rounded-[28px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-lg space-y-8 mt-6">
            <div className="flex items-center justify-between border-b border-[#0A3D78]/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Status
                </p>
                <h3 className="font-serif text-xl font-bold text-[#002754] dark:text-white">
                  In Transit — On Schedule
                </h3>
              </div>
              <Badge variant="primary">Out For Regional Hub</Badge>
            </div>

            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#0A3D78]/20">
              {steps.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  <div
                    className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 ${
                      step.completed
                        ? 'bg-[#002754] border-[#002754] dark:bg-white dark:border-white'
                        : step.current
                        ? 'bg-[#C5A880] border-[#002754] animate-ping'
                        : 'bg-slate-200 border-slate-300 dark:bg-slate-800 dark:border-slate-700'
                    }`}
                  />
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-sm text-[#002754] dark:text-white">
                      {step.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#0A3D78]/10 flex justify-end">
              <Button variant="outline" size="sm" className="rounded-full">
                <Link href={`/orders/${orderId}`}>View Order Items</Link>
              </Button>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
