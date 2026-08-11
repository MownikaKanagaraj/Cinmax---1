'use client';

import * as React from 'react';
import { Header } from '../../../components/header';
import { Footer } from '../../../components/footer';
import { Container, PageHeader, Breadcrumb, Badge, Button } from '@cinmax/ui';

export default function NotificationsPage() {
  const notifications = [
    {
      id: 'notif_1',
      title: 'Batch Release Alert',
      body: 'Our signature French Green Clay & Eucalyptus bar has finished its 6-week cure and is now available.',
      date: '2 hours ago',
      read: false,
    },
    {
      id: 'notif_2',
      title: 'Order Dispatched',
      body: 'Your package with order number CNX-20260802-8492 has been handed to Atelier Priority Air.',
      date: 'Yesterday',
      read: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />

      <main className="flex-1 py-10">
        <Container size="md">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Profile', href: '/profile' },
              { label: 'Notifications', isCurrent: true },
            ]}
          />

          <PageHeader
            badge="Patron Dispatch"
            title="Notification Center"
            subtitle="Updates regarding fresh cure batches, shipment milestones, and account security."
          />

          <div className="space-y-4 pt-6">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-6 rounded-[20px] border transition-all ${
                  !n.read
                    ? 'bg-white dark:bg-[#071324] border-[#0A3D78]/30 shadow-md'
                    : 'bg-[#F7F9FB]/60 dark:bg-[#0A192F]/40 border-[#0A3D78]/10'
                }`}
              >
                <div className="flex items-center justify-between pb-2">
                  <h4 className="font-serif font-bold text-sm text-[#002754] dark:text-white">
                    {n.title}
                  </h4>
                  <span className="text-xs text-muted-foreground">{n.date}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{n.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
