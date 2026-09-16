'use client';

import * as React from 'react';
import Link from 'next/link';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { CartDrawer } from '../../components/cart-drawer';
import { Container, PageHeader, Breadcrumb, Badge, Button, EmptyState } from '@cinmax/ui';
import { formatCurrency } from '@cinmax/utils';
import { useOrdersQuery } from '@cinmax/hooks';
import type { Order } from '@cinmax/types';
import { Package, Truck, CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react';

export default function OrdersPage() {
  const { data: ordersData, isLoading } = useOrdersQuery();
  const orders: Order[] = ordersData?.items || [];

  const getNormalizedStatus = (status?: string) => {
    const s = (status || '').toLowerCase();
    if (['pending', 'confirmed', 'paid', 'processing'].includes(s)) return 'PROCESSING';
    if (['shipped', 'dispatched', 'in_transit'].includes(s)) return 'SHIPPED';
    if (['delivered', 'completed'].includes(s)) return 'DELIVERED';
    if (['cancelled', 'canceled'].includes(s)) return 'CANCELLED';
    return s.toUpperCase() || 'PROCESSING';
  };

  const getStatusBadge = (status?: string) => {
    const norm = getNormalizedStatus(status);
    switch (norm) {
      case 'DELIVERED':
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 font-extrabold text-[10px] tracking-wider uppercase border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Delivered
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 font-extrabold text-[10px] tracking-wider uppercase border border-blue-200 flex items-center gap-1 animate-pulse">
            <Truck className="w-3 h-3" /> Shipped &amp; In-Transit
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 dark:bg-red-950/80 dark:text-red-300 font-extrabold text-[10px] tracking-wider uppercase border border-red-200 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 font-extrabold text-[10px] tracking-wider uppercase border border-amber-200 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Processing Batch
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />
      <CartDrawer />

      <main className="flex-1 py-10">
        <Container size="xl">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'My Account', href: '/profile' },
              { label: 'Order History', isCurrent: true },
            ]}
          />

          <PageHeader
            badge="Atelier Archive"
            title="Your Order Dispatches"
            subtitle="View real-time tracking, courier partner assignments, and historical receipts."
          />

          <div className="space-y-6 pt-6">
            {isLoading ? (
              <div className="text-center py-16 text-muted-foreground text-sm">
                Loading live order dispatches from Supabase...
              </div>
            ) : orders.length === 0 ? (
              <EmptyState
                title="No Orders Found"
                description="You haven't placed any dispatches yet. Explore our handcrafted botanical collections."
                actionLabel="Start Shopping"
                onAction={() => (window.location.href = '/shop')}
              />
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="p-6 sm:p-8 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-bold text-[#002754] dark:text-white">
                        {order.orderNumber}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      • {order.items?.length || 1} item(s)
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                      {order.carrier && (
                        <span className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-[#C5A880]" /> {order.carrier}
                        </span>
                      )}
                      {order.trackingNumber && (
                        <span className="font-mono text-[#002754] dark:text-[#C5A880] font-bold bg-[#002754]/5 dark:bg-[#002754]/30 px-2.5 py-0.5 rounded">
                          AWB: {order.trackingNumber}
                        </span>
                      )}
                      {order.estimatedDeliveryDate && (
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                          Est: {order.estimatedDeliveryDate}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-[#0A3D78]/10">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold block">
                        Total Amount
                      </span>
                      <span className="font-serif text-xl font-bold text-[#002754] dark:text-white">
                        {formatCurrency(order.grandTotal || 0)}
                      </span>
                    </div>

                    <Link href={`/orders/${order.id}`}>
                      <Button
                        variant="primary"
                        size="sm"
                        className="rounded-full font-bold bg-[#002754] hover:bg-[#0A3D78] text-white flex items-center gap-1 text-xs px-4"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}

