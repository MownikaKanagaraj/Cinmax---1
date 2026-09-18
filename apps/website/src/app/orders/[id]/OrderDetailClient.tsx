'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '../../../components/header';
import { Footer } from '../../../components/footer';
import { CartDrawer } from '../../../components/cart-drawer';
import { Container, PageHeader, Breadcrumb, Badge, Button } from '@cinmax/ui';
import { formatCurrency } from '@cinmax/utils';
import { useOrderQuery } from '@cinmax/hooks';
import { MapPin, CreditCard, ShieldCheck } from 'lucide-react';

export default function OrderDetailClient() {
  const params = useParams();
  const orderId = (params?.id as string) || '';

  const { data: order, isLoading } = useOrderQuery(orderId, { enabled: Boolean(orderId) });

  const getTimelineStage = (status?: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'delivered' || s === 'completed') return 6;
    if (s === 'out_for_delivery') return 5;
    if (s === 'shipped' || s === 'dispatched' || s === 'in_transit') return 4;
    if (s === 'processing' || s === 'curing') return 3;
    if (s === 'confirmed' || s === 'paid') return 2;
    return 1;
  };

  const currentStage = getTimelineStage(order?.status);

  const timelineSteps = [
    { stage: 1, label: 'Order Placed', desc: 'Order received & registered' },
    { stage: 2, label: 'Confirmed', desc: 'Payment verified via Razorpay' },
    { stage: 3, label: 'Processing', desc: 'Botanical batch cured & packaged' },
    { stage: 4, label: 'Shipped', desc: 'Handed to atelier logistics' },
    { stage: 5, label: 'Out for Delivery', desc: 'Local courier dispatch' },
    { stage: 6, label: 'Delivered', desc: 'Safely handed to customer' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />
      <CartDrawer />

      <main className="flex-1 py-10">
        <Container size="xl">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Orders', href: '/orders' },
              { label: order?.orderNumber || orderId || 'Order Detail', isCurrent: true },
            ]}
          />

          <PageHeader
            badge="Official Receipt & Telemetry"
            title={`Order ${order?.orderNumber || orderId}`}
            subtitle="Real-time courier routing, 6-stage dispatch status, and itemized billing breakdown."
          />

          {isLoading ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              Loading real order data from Supabase...
            </div>
          ) : !order ? (
            <div className="p-8 text-center rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-4">
              <h3 className="font-serif text-lg font-bold text-red-600">Order Not Found</h3>
              <p className="text-xs text-muted-foreground">
                We couldn't locate order details for ID: <code className="font-mono">{orderId}</code>
              </p>
              <Link href="/orders">
                <Button variant="outline" size="sm" className="rounded-full">
                  Return to Order History
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="p-6 sm:p-8 rounded-[28px] bg-white dark:bg-[#071324] border border-[#0A3D78]/15 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#0A3D78]/10 pb-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#C5A880] tracking-widest block">
                        Live Tracking Milestone
                      </span>
                      <h3 className="font-serif text-xl font-bold text-[#002754] dark:text-white">
                        Dispatch Progress Status
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#002754] text-white text-xs font-extrabold uppercase font-mono">
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {timelineSteps.map((step) => {
                      const isCompleted = step.stage <= currentStage;
                      const isCurrent = step.stage === currentStage;

                      return (
                        <div
                          key={step.stage}
                          className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between space-y-2 ${
                            isCurrent
                              ? 'bg-[#002754] text-white border-[#C5A880] shadow-md scale-105'
                              : isCompleted
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 text-emerald-800 dark:text-emerald-300'
                              : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              isCurrent
                                ? 'bg-[#C5A880] text-[#002754]'
                                : isCompleted
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-300 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {isCompleted && !isCurrent ? '✓' : step.stage}
                          </div>
                          <div>
                            <p className="font-serif font-bold text-xs leading-tight">{step.label}</p>
                            <p className="text-[9px] opacity-75 mt-0.5 leading-tight">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-4 rounded-2xl bg-[#002754] text-white grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-white/60 font-bold uppercase text-[10px] block">Courier Partner</span>
                      <strong className="font-serif text-sm text-[#C5A880]">{order.carrier || 'Blue Dart Express'}</strong>
                    </div>
                    <div>
                      <span className="text-white/60 font-bold uppercase text-[10px] block">AWB / Tracking Number</span>
                      <strong className="font-mono text-sm text-white">{order.trackingNumber || 'CNX-AWB-PENDING'}</strong>
                    </div>
                    <div>
                      <span className="text-white/60 font-bold uppercase text-[10px] block">Estimated Delivery Date</span>
                      <strong className="font-serif text-sm text-emerald-400">{order.estimatedDeliveryDate || '3 to 5 Business Days'}</strong>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 rounded-[28px] bg-white dark:bg-[#071324] border border-[#0A3D78]/15 shadow-sm space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                    Formulations in this Shipment ({order.items?.length || 0})
                  </h3>
                  <div className="divide-y divide-[#0A3D78]/10">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item) => (
                        <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                          <div className="w-16 h-16 rounded-[14px] overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                            <img
                              src={
                                item.imageUrl ||
                                'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=300&auto=format&fit=crop&q=80'
                              }
                              alt={item.productTitle}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif text-sm font-bold truncate text-[#002754] dark:text-white">
                              {item.productTitle}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity} • {item.variantTitle || 'Standard Bar'}
                            </p>
                          </div>
                          <span className="font-serif text-base font-bold text-[#002754] dark:text-[#C5A880]">
                            {formatCurrency(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground py-4">No item breakdown recorded for this order.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-[28px] bg-white dark:bg-[#071324] border border-[#0A3D78]/15 shadow-sm space-y-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#002754] dark:text-[#C5A880]" />
                    <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                      Delivery Destination
                    </h3>
                  </div>
                  {order.shippingAddress ? (
                    <div className="text-xs text-muted-foreground leading-relaxed bg-[#F7F9FB] dark:bg-[#0A192F]/60 p-4 rounded-2xl border border-[#0A3D78]/10 space-y-1">
                      <p className="font-bold text-sm text-[#002754] dark:text-white">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </p>
                      <p>{order.shippingAddress.streetLine1 || (order.shippingAddress as any).street}</p>
                      {(order.shippingAddress.streetLine2 || (order.shippingAddress as any).landmark) && (
                        <p>{order.shippingAddress.streetLine2 || (order.shippingAddress as any).landmark}</p>
                      )}
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                      </p>
                      <p className="text-slate-500 font-semibold pt-1">
                        Phone: {order.shippingAddress.phone || 'N/A'}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">Standard shipping destination on record.</p>
                  )}
                </div>

                <div className="p-6 rounded-[28px] bg-white dark:bg-[#071324] border border-[#0A3D78]/15 shadow-sm space-y-3 text-xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#0A3D78]/10">
                    <CreditCard className="w-4 h-4 text-[#002754] dark:text-[#C5A880]" />
                    <h3 className="font-serif text-base font-bold text-[#002754] dark:text-white">
                      Payment Summary
                    </h3>
                  </div>

                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>

                  {order.discountTotal > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount</span>
                      <span>-{formatCurrency(order.discountTotal)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>{order.shippingTotal === 0 ? 'Complimentary' : formatCurrency(order.shippingTotal)}</span>
                  </div>

                  <div className="flex justify-between font-serif font-bold text-base pt-3 border-t border-[#0A3D78]/10 text-[#002754] dark:text-white">
                    <span>Grand Total</span>
                    <span>{formatCurrency(order.grandTotal)}</span>
                  </div>

                  <div className="pt-2 text-[10px] text-center text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Razorpay Encrypted SSL Payment Verified
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
