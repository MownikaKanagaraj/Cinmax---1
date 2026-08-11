'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '../../../components/header';
import { Footer } from '../../../components/footer';
import { Container, PageHeader, Breadcrumb, Badge, Button, PriceTag } from '@cinmax/ui';
import { formatCurrency } from '@cinmax/utils';
import { useOrderQuery, useFeaturedProductsQuery } from '@cinmax/hooks';
import type { Product } from '@cinmax/types';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = (params?.id as string) || 'CNX-20260802-8492';

  const { data: order } = useOrderQuery(orderId, { enabled: Boolean(orderId) });
  const { data: featuredProducts = [] } = useFeaturedProductsQuery(2);

  const displayProducts: Product[] = featuredProducts.slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />

      <main className="flex-1 py-10">
        <Container size="xl">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Orders', href: '/orders' },
              { label: orderId, isCurrent: true },
            ]}
          />

          <PageHeader
            badge="Official Receipt"
            title={`Order ${order?.orderNumber || orderId}`}
            subtitle="Details of items dispatched, courier routing, and billing summary."
            actions={
              <Button variant="primary" size="sm" className="rounded-full">
                <Link href={`/orders/${orderId}/track`}>Track Delivery</Link>
              </Button>
            }
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-6">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                  Formulations in this Shipment
                </h3>
                <div className="divide-y divide-[#0A3D78]/10">
                  {displayProducts.map((prod: Product) => (
                    <div key={prod.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-[12px] overflow-hidden bg-slate-100 flex-shrink-0">
                        <img
                          src={prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1607006314147-759088fd21c2?w=300&auto=format&fit=crop&q=80'}
                          alt={prod.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-serif text-sm font-bold">{prod.title}</h4>
                        <p className="text-xs text-muted-foreground">Qty: 1 • Standard 120g Bar</p>
                      </div>
                      <PriceTag price={prod.basePrice || 18.0} currency="USD" size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Billing & Shipping Address Summary */}
            <div className="space-y-6">
              <div className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-4 text-sm">
                <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                  Delivery Destination
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {order?.shippingAddress ? (
                    <>
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                      {order.shippingAddress.streetLine1}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                      {order.shippingAddress.country}
                    </>
                  ) : (
                    <>
                      Aurora Vance<br />
                      742 Evergreen Terrace, Suite 400<br />
                      Beverly Hills, CA 90210<br />
                      United States
                    </>
                  )}
                </p>
              </div>

              <div className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-3 text-sm">
                <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                  Payment Summary
                </h3>
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{order ? formatCurrency(order.subtotal) : '$36.00'}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{order?.shippingTotal === 0 ? 'Complimentary' : (order ? formatCurrency(order.shippingTotal) : 'Complimentary')}</span>
                </div>
                <div className="flex justify-between font-serif font-bold text-base pt-2 border-t border-[#0A3D78]/10">
                  <span>Total Paid</span>
                  <span>{order ? formatCurrency(order.grandTotal) : '$36.00'}</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
