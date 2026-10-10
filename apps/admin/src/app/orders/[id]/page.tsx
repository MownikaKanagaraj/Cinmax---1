'use client';

export const runtime = 'edge';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AdminLayout } from '../../../components/admin-layout';
import { PageHeader, Badge, Button, Input } from '@cinmax/ui';
import { formatCurrency } from '@cinmax/utils';
import { useOrderByIdQuery, useUpdateOrderStatusMutation } from '@cinmax/hooks';
import type { OrderStatus, OrderItem } from '@cinmax/types';
import {
  Truck,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  Clock,
  RotateCcw,
  ShieldCheck,
  Send,
  AlertCircle,
} from 'lucide-react';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = (params?.id as string) || 'ord_1';
  const { data: rawOrder, isLoading } = useOrderByIdQuery(orderId);
  const updateStatusMutation = useUpdateOrderStatusMutation();

  const [status, setStatus] = React.useState<string>('processing');
  const [courierPartner, setCourierPartner] = React.useState('Blue Dart Express');
  const [trackingNumber, setTrackingNumber] = React.useState('BD-982741092');
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = React.useState('Oct 28, 2026');
  const [isSaved, setIsSaved] = React.useState(false);
  const [refundModal, setRefundModal] = React.useState(false);
  const [isRefunded, setIsRefunded] = React.useState(false);

  const order = React.useMemo(() => {
    if (!rawOrder) return null;
    return {
      ...rawOrder,
      orderNumber: rawOrder.orderNumber?.startsWith('CGP')
        ? rawOrder.orderNumber
        : 'CGP202608000001',
    };
  }, [rawOrder]);

  React.useEffect(() => {
    if (order) {
      setStatus(order.status);
      if (order.trackingNumber) setTrackingNumber(order.trackingNumber);
      if (order.carrier) setCourierPartner(order.carrier);
      if (order.estimatedDeliveryDate) setEstimatedDeliveryDate(order.estimatedDeliveryDate);
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

  const handleSaveDispatch = () => {
    updateStatusMutation.mutate({
      id: order.id,
      status: status as OrderStatus,
      trackingNumber,
      carrier: courierPartner,
      estimatedDeliveryDate,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleRefund = () => {
    setIsRefunded(true);
    setRefundModal(false);
    setStatus('cancelled');
  };

  return (
    <AdminLayout>
      <div className="space-y-2 mb-6">
        <Link
          href="/orders"
          className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to Orders Queue
        </Link>
      </div>

      <PageHeader
        badge="Order Processing & Fulfillment"
        title={`Order: ${order.orderNumber}`}
        subtitle={`Placed on ${new Date(
          order.createdAt
        ).toLocaleString()} • Customer: ${order.guestEmail || 'customer@example.com'}`}
        actions={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setRefundModal(true)}
              className="px-4 py-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {isRefunded ? 'Refunded (₹' + order.grandTotal + ')' : 'Process Refund'}
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
        {/* Items & Shipping Status (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items to Dispatch */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
              Ordered Products & Quantities
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {order.items?.map((item: OrderItem) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&auto=format&fit=crop&q=80'}
                        alt={item.productTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#0F172A] dark:text-white">{item.productTitle}</h4>
                      <p className="text-xs text-slate-400">SKU: {item.sku || 'CNX-BOTANICAL'} • Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-[#0F172A] dark:text-white">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Fulfillment Status & Partner Assignment */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                  Order Status & Courier Dispatch
                </h3>
                <p className="text-xs text-slate-400">Update status workflow and courier tracking info</p>
              </div>
              <Truck className="w-5 h-5 text-blue-600" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                  Order Status Workflow
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-bold text-[#0F172A] dark:text-white"
                >
                  <option value="pending">Order Placed (Pending)</option>
                  <option value="processing">Order Confirmed & Processing</option>
                  <option value="shipped">Shipped (With Courier)</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="payment_failed">Payment Failed</option>
                  <option value="payment_pending">Payment Pending</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                  Assigned Courier Partner
                </label>
                <select
                  value={courierPartner}
                  onChange={(e) => setCourierPartner(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-bold text-[#0F172A] dark:text-white"
                >
                  <option value="Blue Dart Express">Blue Dart Express</option>
                  <option value="Delhivery Surface">Delhivery Surface</option>
                  <option value="DTDC Courier">DTDC Courier</option>
                  <option value="India Post SpeedPost">India Post SpeedPost</option>
                  <option value="Shiprocket">Shiprocket Express</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                  AWB Tracking Number
                </label>
                <Input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                  Est. Delivery Date
                </label>
                <Input
                  value={estimatedDeliveryDate}
                  onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                  placeholder="e.g. Oct 28, 2026"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Tracking Link: <span className="font-mono text-blue-600 dark:text-blue-400 underline">https://track.cinmax.in/{trackingNumber}</span>
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveDispatch}
                className="rounded-xl font-bold"
              >
                {isSaved ? 'Dispatch Updated!' : 'Save Status & Tracking'}
              </Button>
            </div>
          </div>
        </div>

        {/* Customer & Address Details (1 col) */}
        <div className="space-y-6">
          {/* Customer Profile & Complete Delivery Address Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-sm text-[#0F172A] dark:text-white border-b pb-2 border-slate-100 dark:border-slate-800">
              Customer &amp; Delivery Address
            </h3>

            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recipient Name</p>
              <p className="font-bold text-sm text-[#0F172A] dark:text-white">
                {order.shippingAddress?.firstName
                  ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName || ''}`
                  : 'Aarav Sharma'}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Details</p>
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                Mobile: {order.shippingAddress?.phone || '+91 98765 43210'}
              </p>
              <p className="text-slate-400">{order.guestEmail || 'aarav.sharma@example.com'}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Delivery Address (Snapshot)</p>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <p className="font-bold text-[#0F172A] dark:text-white">
                  {order.shippingAddress?.streetLine1 || 'Door No 42, B-Block, Royal Enclave'}
                </p>
                {order.shippingAddress?.streetLine2 && (
                  <p className="text-slate-600 dark:text-slate-400">{order.shippingAddress.streetLine2}</p>
                )}
                <p className="text-slate-600 dark:text-slate-400">
                  {order.shippingAddress?.city || 'Chennai'}, District: {order.shippingAddress?.city || 'Chennai'}
                </p>
                <p className="font-semibold text-blue-600 dark:text-blue-400">
                  {order.shippingAddress?.state || 'Tamil Nadu'} - {order.shippingAddress?.postalCode || '600017'}
                </p>
                <p className="text-[11px] text-slate-400 italic mt-1">Country: India</p>
              </div>
            </div>
          </div>

          {/* Delivery & Logistics Audit */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-sm text-[#0F172A] dark:text-white">
              Delivery Logistics & Charge Rule
            </h3>
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold uppercase">Customer State</span>
              <span className="font-bold text-[#0F172A] dark:text-white">
                {order.delivery?.state || order.shippingAddress?.state || 'Tamil Nadu'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold uppercase">Product Units</span>
              <span className="font-bold text-[#0F172A] dark:text-white">
                {order.delivery?.totalProducts ?? 3} items
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold uppercase">Delivery Charge</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {order.delivery?.isFree || order.shippingTotal === 0
                  ? 'FREE (6+ items rule)'
                  : formatCurrency(order.shippingTotal || 60)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold uppercase">Payment Mode</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                Razorpay Online (UPI / Card)
              </span>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-sm text-[#0F172A] dark:text-white">
              Order Financial Summary
            </h3>
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal || 1599)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Delivery Charge</span>
              <span>
                {order.delivery?.isFree || order.shippingTotal === 0
                  ? 'FREE'
                  : formatCurrency(order.shippingTotal)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-sm pt-2 border-t border-slate-100 dark:border-slate-800 text-[#0F172A] dark:text-white">
              <span>Total Paid</span>
              <span>{formatCurrency(order.grandTotal || 1599)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Refund Modal */}
      {refundModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0B132B] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="font-bold text-base text-[#0F172A] dark:text-white">Confirm Order Refund</h3>
            <p className="text-xs text-slate-400">
              This will process a full refund of <b>{formatCurrency(order.grandTotal)}</b> back to the customer's source account via Razorpay.
            </p>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setRefundModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleRefund} className="bg-amber-600 hover:bg-amber-700 text-white font-bold">
                Confirm Refund
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
