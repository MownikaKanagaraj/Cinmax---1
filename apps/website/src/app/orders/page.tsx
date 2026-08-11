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

export default function OrdersPage() {
  const { data: ordersData, isLoading } = useOrdersQuery();
  const orders: Order[] = ordersData?.items || [];

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
            title="Your Order History"
            subtitle="View real-time tracking, batch authenticity numbers, and historical receipts."
          />

          <div className="space-y-6 pt-6">
            {isLoading ? (
              <div className="text-center py-16 text-muted-foreground text-sm">
                Loading live order dispatches...
              </div>
            ) : orders.length === 0 ? (
              <EmptyState
                title="No Orders Found"
                description="You haven't placed any dispatches yet. Explore our handcrafted botanical bar collections."
                actionLabel="Start Shopping"
                onAction={() => (window.location.href = '/shop')}
              />
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="p-6 sm:p-8 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-[#002754] dark:text-white">
                        {order.orderNumber}
                      </span>
                      <Badge
                        variant={order.status === 'delivered' ? 'success' : 'secondary'}
                        className="text-[10px] uppercase font-bold"
                      >
                        {order.status}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      • {order.items?.length || 1} item(s)
                    </p>

                    {order.trackingNumber && (
                      <p className="text-xs font-mono text-[#0A3D78] dark:text-[#C5A880] font-bold">
                        Tracking: {order.trackingNumber}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-[#0A3D78]/10">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold block">
                        Total Amount
                      </span>
                      <span className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                        {formatCurrency(order.grandTotal || 0)}
                      </span>
                    </div>

                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm" className="rounded-full text-xs">
                        View Details →
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
