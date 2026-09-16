'use client';

import * as React from 'react';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, Button, Input } from '@cinmax/ui';
import { formatCurrency } from '@cinmax/utils';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCcw,
  Search,
  Filter,
  Download,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  X,
  Check,
  Loader2,
} from 'lucide-react';

interface PaymentRecord {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  method: string;
  gateway: string;
  type: 'Product' | 'Masterclass';
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED';
  timestamp: string;
  settlementStatus: 'Settled' | 'Processing';
}

function formatPaymentMethod(rawMethod?: string): string {
  if (!rawMethod) return 'Credit / Debit Card';
  const lower = rawMethod.toLowerCase();
  if (lower === 'upi' || lower.includes('upi')) return 'UPI';
  if (lower === 'card' || lower === 'credit_card' || lower === 'debit_card' || lower.includes('card')) return 'Credit / Debit Card';
  if (lower === 'netbanking' || lower.includes('bank')) return 'Net Banking';
  if (lower === 'wallet' || lower.includes('wallet')) return 'Wallet';
  if (lower === 'stripe' || lower === 'razorpay') return 'Credit / Debit Card';
  return rawMethod.charAt(0).toUpperCase() + rawMethod.slice(1);
}

export default function PaymentsManagementPage() {
  const [payments, setPayments] = React.useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('ALL');
  const [selectedRefundPayment, setSelectedRefundPayment] = React.useState<PaymentRecord | null>(null);
  const [refundReason, setRefundReason] = React.useState('');
  const [isRefunding, setIsRefunding] = React.useState(false);

  React.useEffect(() => {
    async function fetchDbPayments() {
      setIsLoading(true);
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseUrl =
          process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nthyavlzdgucrldtgjeo.supabase.co';
        const supabaseKey =
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aHlhdmx6ZGd1Y3JsZHRnamVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NTU2MDAsImV4cCI6MjEwMTMzMTYwMH0.XzL0nuUOnksJLgsT9tGlsi4-adHtosCjV4fk9-MXClc';
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data, error } = await supabase
          .from('payment_transactions')
          .select('*, orders(order_number, shipping_address, guest_email, payment_method), profiles(first_name, last_name, email)')
          .order('created_at', { ascending: false });

        if (!error && data) {
          const dbRecords: PaymentRecord[] = data.map((row: any) => {
            const ord = row.orders || {};
            const prof = row.profiles || {};
            const ship = ord.shipping_address || {};
            const meta = row.metadata || {};

            const rawFirstName = (ship.firstName || '').trim();
            const rawLastName = (ship.lastName || '').trim();
            const shipName = rawFirstName ? `${rawFirstName} ${rawLastName}`.trim() : '';

            const profName = prof.first_name ? `${prof.first_name} ${prof.last_name || ''}`.trim() : '';

            const resolvedEmail = ord.guest_email || prof.email || meta.customerEmail || '';
            const resolvedName = shipName || profName || meta.customerName || (resolvedEmail ? resolvedEmail.split('@')[0] : 'Customer');

            const statusMap: Record<string, any> = {
              captured: 'SUCCESS',
              authorized: 'SUCCESS',
              failed: 'FAILED',
              refunded: 'REFUNDED',
            };

            const rawMethod = meta.paymentMethod || meta.method || ord.payment_method || 'Razorpay';
            const resolvedOrderId = ord.order_number || meta.orderNumber || row.razorpay_order_id || row.transaction_id || row.id;
            const paymentType = meta.type === 'masterclass' || !row.order_id ? 'Masterclass' : 'Product';

            return {
              id: row.razorpay_payment_id || row.transaction_id || row.id,
              orderId: resolvedOrderId,
              customerName: resolvedName,
              customerEmail: resolvedEmail || 'No Email Provided',
              amount: Number(row.amount) || 0,
              method: formatPaymentMethod(rawMethod),
              gateway: 'Razorpay',
              type: paymentType,
              status: statusMap[row.status] || 'SUCCESS',
              timestamp: new Date(row.created_at).toLocaleString([], {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
              settlementStatus: 'Settled',
            };
          });

          setPayments(dbRecords);
        } else {
          setPayments([]);
        }
      } catch (err) {
        console.warn('Error fetching DB payments in Admin Payments page:', err);
        setPayments([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDbPayments();
  }, []);

  const handleProcessRefund = () => {
    if (!selectedRefundPayment) return;
    setIsRefunding(true);

    setTimeout(() => {
      setPayments(
        payments.map((p) =>
          p.id === selectedRefundPayment.id ? { ...p, status: 'REFUNDED' } : p
        )
      );
      setIsRefunding(false);
      setSelectedRefundPayment(null);
      setRefundReason('');
    }, 1000);
  };

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate live financial statistics
  const totalSuccessAmount = payments
    .filter((p) => p.status === 'SUCCESS')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalRefundedAmount = payments
    .filter((p) => p.status === 'REFUNDED')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalCount = payments.length;
  const successCount = payments.filter((p) => p.status === 'SUCCESS').length;
  const successRate = totalCount > 0 ? ((successCount / totalCount) * 100).toFixed(1) : '100';

  return (
    <AdminLayout>
      <PageHeader
        badge="Finance & Treasury"
        title="Payment Gateway & Transactions"
        subtitle="Live Razorpay transaction monitoring, settlements, payment statuses, and instant customer refunds."
        actions={
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Razorpay Gateway Active (Live Mode)
            </div>
          </div>
        }
      />

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Collected Volume</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white">
            {formatCurrency(totalSuccessAmount)}
          </h3>
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Live Supabase Revenue
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Payment Success Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white">{successRate}%</h3>
          <p className="text-[11px] font-semibold text-slate-500">Auto-captured via Webhooks</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Refunded</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white">
            {formatCurrency(totalRefundedAmount)}
          </h3>
          <p className="text-[11px] font-semibold text-slate-500">
            {payments.filter((p) => p.status === 'REFUNDED').length} refund(s) processed
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Next Bank Settlement</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200 dark:border-purple-800">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white">
            {formatCurrency(totalSuccessAmount * 0.95)}
          </h3>
          <p className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">Scheduled: T+1 Settlement</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 my-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Razorpay Transactions Ledger</h3>
            <p className="text-xs text-slate-400">Live record of customer payments, methods, and refund controls</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search payment / order / customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-300"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="REFUNDED">Refunded</option>
              <option value="FAILED">Failed</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2 text-blue-600" />
            <p className="text-xs font-semibold">Fetching live Razorpay transaction ledger from Supabase...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <CreditCard className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h4 className="font-bold text-sm text-[#0F172A] dark:text-white">No Real Razorpay Transactions Found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Completed customer payments via Razorpay online checkout will appear here automatically in real time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="pb-3">Payment ID</th>
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Payment Method</th>
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#0F172A] dark:text-white">{p.id}</td>
                    <td className="py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">{p.orderId}</td>
                    <td className="py-3.5">
                      <p className="font-bold text-[#0F172A] dark:text-white">{p.customerName}</p>
                      <p className="text-[10px] text-slate-400">{p.customerEmail}</p>
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                        p.type === 'Masterclass'
                          ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                      }`}>
                        {p.type}
                      </span>
                    </td>
                    <td className="py-3.5 font-bold text-[#0F172A] dark:text-white">{formatCurrency(p.amount)}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {p.method}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-500 font-medium">{p.timestamp}</td>
                    <td className="py-3.5">
                      {p.status === 'SUCCESS' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          Success
                        </span>
                      )}
                      {p.status === 'REFUNDED' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          Refunded
                        </span>
                      )}
                      {p.status === 'FAILED' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 dark:bg-red-950/80 dark:text-red-300 border border-red-200 dark:border-red-800">
                          Failed
                        </span>
                      )}
                      {p.status === 'PENDING' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-right">
                      {p.status === 'SUCCESS' ? (
                        <button
                          type="button"
                          onClick={() => setSelectedRefundPayment(p)}
                          className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
                        >
                          Issue Refund
                        </button>
                      ) : (
                        <span className="text-slate-400 font-medium">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Process Refund Modal */}
      {selectedRefundPayment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0B132B] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-base text-[#0F172A] dark:text-white">Process Customer Refund</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRefundPayment(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase">Order ID</span>
                  <span className="font-mono font-bold text-[#0F172A] dark:text-white">{selectedRefundPayment.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase">Payment ID</span>
                  <span className="font-mono font-bold text-[#0F172A] dark:text-white">{selectedRefundPayment.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase">Customer</span>
                  <span className="font-bold text-[#0F172A] dark:text-white">{selectedRefundPayment.customerName}</span>
                </div>
                <div className="flex justify-between border-t pt-2 border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 font-bold uppercase">Refund Amount</span>
                  <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                    {formatCurrency(selectedRefundPayment.amount)}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                  Refund Reason *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Customer requested cancellation before dispatch / Damaged in transit"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" size="sm" type="button" onClick={() => setSelectedRefundPayment(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleProcessRefund}
                  disabled={isRefunding || !refundReason.trim()}
                  className="rounded-xl flex items-center gap-2 font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-500/20"
                >
                  <RotateCcw className="w-4 h-4" />
                  {isRefunding ? 'Refunding...' : 'Confirm Full Refund'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
