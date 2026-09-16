'use client';

import * as React from 'react';
import Link from 'next/link';
import { Header } from '../../../components/header';
import { Footer } from '../../../components/footer';
import { CartDrawer } from '../../../components/cart-drawer';
import { Container, PageHeader, Breadcrumb, Badge, Button } from '@cinmax/ui';
import { useUser, useOrdersQuery } from '@cinmax/hooks';
import { Bell, Truck, CheckCircle2, Package, Clock, ArrowRight, ShieldAlert } from 'lucide-react';

export default function NotificationsPage() {
  const { user } = useUser();
  const { data: ordersData, isLoading } = useOrdersQuery(undefined, undefined, {
    enabled: Boolean(user?.id),
  });

  const orders = ordersData?.items || [];

  // Generate dynamic customer notifications based on real Supabase orders
  const notifications = React.useMemo(() => {
    if (!orders || orders.length === 0) {
      return [
        {
          id: 'welcome_1',
          orderId: null,
          title: 'Welcome to CINMAX Global Products',
          body: 'Your customer account is verified. You will receive real-time dispatch alerts here when orders are placed.',
          date: 'Just now',
          type: 'info',
        },
      ];
    }

    const items: any[] = [];

    orders.forEach((order) => {
      const orderNum = order.orderNumber;
      const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      const carrier = order.carrier || 'Logistics Partner';
      const awb = order.trackingNumber || '';

      const status = (order.status || '').toLowerCase();

      if (['delivered', 'completed'].includes(status)) {
        items.push({
          id: `notif_del_${order.id}`,
          orderId: order.id,
          title: `Order ${orderNum} Delivered Successfully`,
          body: `Your botanical shipment has been delivered safely via ${carrier}. Thank you for choosing CINMAX.`,
          date: orderDate,
          type: 'success',
        });
      } else if (['shipped', 'dispatched', 'in_transit'].includes(status)) {
        items.push({
          id: `notif_ship_${order.id}`,
          orderId: order.id,
          title: `Order ${orderNum} Dispatched & In-Transit`,
          body: `Handed to ${carrier} ${awb ? `(AWB: ${awb})` : ''}. Estimated delivery: ${order.estimatedDeliveryDate || '3 to 5 business days'}.`,
          date: orderDate,
          type: 'shipping',
        });
      } else {
        items.push({
          id: `notif_proc_${order.id}`,
          orderId: order.id,
          title: `Order ${orderNum} Confirmed & In Curing Batch`,
          body: `Your order of ${order.items?.length || 1} item(s) is being prepared for dispatch.`,
          date: orderDate,
          type: 'processing',
        });
      }
    });

    return items;
  }, [orders]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />
      <CartDrawer />

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
            badge="Customer Dispatch Telemetry"
            title="Notification Center"
            subtitle="Real-time alerts regarding shipment dispatches, AWB tracking, and batch updates."
          />

          {isLoading ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              Loading real order notifications from Supabase...
            </div>
          ) : (
            <div className="space-y-4 pt-6">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-6 rounded-[22px] bg-white dark:bg-[#071324] border border-[#0A3D78]/15 shadow-sm hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center ${
                          n.type === 'success'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : n.type === 'shipping'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {n.type === 'shipping' ? (
                          <Truck className="w-4 h-4" />
                        ) : n.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      <h4 className="font-serif font-bold text-sm text-[#002754] dark:text-white">
                        {n.title}
                      </h4>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-medium">{n.date}</span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed pl-12">{n.body}</p>

                  {n.orderId && (
                    <div className="pl-12 pt-1">
                      <Link
                        href={`/orders/${n.orderId}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002754] dark:text-[#C5A880] hover:underline"
                      >
                        <span>View Order Details &amp; Tracking</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}

