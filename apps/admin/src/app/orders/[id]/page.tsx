'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AdminLayout } from '../../../components/admin-layout';
import { PageHeader, Badge, Button, Input } from '@cinmax/ui';
import { formatCurrency } from '@cinmax/utils';
import { useOrderByIdQuery, useUpdateOrderStatusMutation } from '@cinmax/hooks';
import type { OrderStatus, OrderItem } from '@cinmax/types';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = (params?.id as string) || 'ord_1';
  const { data: order, isLoading } = useOrderByIdQuery(orderId);
  const updateStatusMutation = useUpdateOrderStatusMutation();

  const [status, setStatus] = React.useState<OrderStatus>('processing');
  const [trackingNumber, setTrackingNumber] = React.useState('CNX-TRACK-849201');

  React.useEffect(() => {
    if (order) {
      setStatus(order.status);
      if (order.trackingNumber) setTrackingNumber(order.trackingNumber);
    }
  }, [order]);

  if (isLoading || !order) {
    return (
      <AdminLayout>
        <div className="py-20 text-center text-muted-foreground font-serif">
          Retrieving order details...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-2 mb-6">
        <Link
          href="/orders"
          className="text-xs font-bold uppercase tracking-wider text-[#0A3D78] dark:text-[#C5A880] hover:underline"
        >
          ← Back to Orders Queue
        </Link>
      </div>

      <PageHeader
        badge="Fulfillment Console"
        title={`Order Details: ${order.orderNumber}`}
        subtitle={`Placed on ${new Date(
          order.createdAt
        ).toLocaleString()} • Currency: USD`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
        {/* Items & Shipping Status */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
              Items to Dispatch
            </h3>
            <div className="divide-y divide-[#0A3D78]/10">
              {order.items?.map((item: OrderItem) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-[12px] bg-slate-100 overflow-hidden">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&auto=format&fit=crop&q=80'}
                        alt={item.productTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-bold">{item.productTitle}</h4>
                      <p className="text-xs text-muted-foreground">SKU: {item.sku || 'CNX-SOAP'} • Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm">{formatCurrency(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fulfillment Status Updater */}
          <div className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
              Update Dispatch Telemetry
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OrderStatus)}
                  className="w-full px-3.5 py-2.5 rounded-[12px] text-xs bg-[#F7F9FB] dark:bg-[#0A192F] border border-[#0A3D78]/20 font-bold"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing & Curing Check</option>
                  <option value="shipped">Dispatched / Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  Courier Tracking Code
                </label>
                <Input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => updateStatusMutation.mutate({ id: order.id, status, trackingNumber })}
                className="rounded-full"
              >
                Save Dispatch Update
              </Button>
            </div>
          </div>
        </div>

        {/* Customer & Address Details */}
        <div className="space-y-6">
          <div className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm space-y-3 text-sm">
            <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
              Patron Profile
            </h3>
            <p className="font-bold">{order.guestEmail || 'aurora.vance@cinmax.luxury'}</p>
            <p className="text-xs text-muted-foreground">Patron ID: {order.userId || 'usr_aurora_991'}</p>
            <Badge variant="gold">Gold Tier Member</Badge>
          </div>

          {/* Delivery & Logistics Audit */}
          <div className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm space-y-3 text-sm">
            <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
              Delivery Logistics Audit
            </h3>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground font-bold">Delivery State</span>
              <span className="font-bold text-[#002754] dark:text-white">
                {order.delivery?.state || order.shippingAddress?.state || 'Tamil Nadu'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground font-bold">Total Products</span>
              <span className="font-bold text-[#002754] dark:text-white">
                {order.delivery?.totalProducts ?? (order.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 1)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground font-bold">Delivery Charge</span>
              <span className="font-bold text-[#002754] dark:text-[#C5A880]">
                {order.delivery?.isFree || order.shippingTotal === 0
                  ? 'FREE'
                  : formatCurrency(order.delivery?.charge ?? order.shippingTotal)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground font-bold">Delivery Status</span>
              <span className="font-bold capitalize text-[#002754] dark:text-white">
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          <div className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm space-y-3 text-sm">
            <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
              Financial Breakdown
            </h3>
            <div className="flex justify-between text-muted-foreground text-xs">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground text-xs">
              <span>Delivery Charge</span>
              <span>
                {order.delivery?.isFree || order.shippingTotal === 0
                  ? 'FREE'
                  : formatCurrency(order.shippingTotal)}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground text-xs">
              <span>Tax (GST 18%)</span>
              <span>{formatCurrency(order.taxTotal)}</span>
            </div>
            <div className="flex justify-between font-serif font-bold text-base pt-2 border-t border-[#0A3D78]/10">
              <span>Total Captured</span>
              <span>{formatCurrency(order.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
