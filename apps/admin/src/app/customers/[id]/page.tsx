'use client';

export const runtime = 'edge';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AdminLayout } from '../../../components/admin-layout';
import { PageHeader, Badge, Button } from '@cinmax/ui';
import { formatCurrency } from '@cinmax/utils';
import { useOrdersQuery, useCustomersQuery } from '@cinmax/hooks';
import type { Order } from '@cinmax/types';
import type { CustomerEntity } from '@cinmax/api';
import {
  Users,
  ArrowLeft,
  ArrowUpRight,
  Award,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Package,
  Plus,
  Coins,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const customerId = (params?.id as string) || 'cust_1';
  const { data: customerEntities = [] } = useCustomersQuery();
  const { data: ordersData } = useOrdersQuery(undefined, { page: 1, pageSize: 5 });

  const rawOrders: Order[] = ordersData?.items || [];
  const orders = rawOrders.map((ord, idx) => ({
    ...ord,
    orderNumber: ord.orderNumber?.startsWith('CGP')
      ? ord.orderNumber
      : `CGP202608${String(idx + 1).padStart(6, '0')}`,
  }));

  const customer = customerEntities.find((c: CustomerEntity) => c.id === customerId) || {
    id: customerId,
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98450 12345',
    loyaltyTier: 'gold',
    loyaltyPoints: 320,
    createdAt: '2025-11-15T10:00:00Z',
    updatedAt: '2026-08-19T11:20:00Z',
  };

  const [points, setPoints] = React.useState((customer as any).loyaltyPoints || 320);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [adjustAmount, setAdjustAmount] = React.useState('50');
  const [adjustReason, setAdjustReason] = React.useState('Customer Service Courtesy Bonus');
  const [adjustType, setAdjustType] = React.useState<'add' | 'deduct'>('add');

  const handleAdjustPoints = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(adjustAmount, 10) || 0;
    if (adjustType === 'add') {
      setPoints((prev: number) => prev + val);
    } else {
      setPoints((prev: number) => Math.max(0, prev - val));
    }
    setIsModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-2 mb-6">
        <Link
          href="/customers"
          prefetch={true}
          className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Customer Directory
        </Link>
      </div>

      <PageHeader
        badge="Customer CRM Dossier"
        title={(customer as any).fullName || 'Aarav Sharma'}
        subtitle={`Customer ID: ${(customer as any).id} • Registered on ${new Date(
          (customer as any).createdAt || Date.now()
        ).toLocaleDateString()}`}
        actions={
          <Button
            variant="primary"
            size="sm"
            className="rounded-xl flex items-center gap-2 font-bold shadow-md shadow-blue-500/20"
            onClick={() => setIsModalOpen(true)}
          >
            <Coins className="w-4 h-4" /> Adjust Loyalty Points
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
        {/* Left Column: Customer Profile & Loyalty */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                {((customer as any).fullName || 'A')[0]}
              </div>
              <div>
                <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                  {(customer as any).fullName || 'Aarav Sharma'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  {((customer as any).loyaltyTier || 'Gold').toUpperCase()} VIP Member
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="truncate">{(customer as any).email || 'aarav.sharma@example.com'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{(customer as any).phone || '+91 98450 12345'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Joined {new Date((customer as any).createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Loyalty Balance Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">
                CINMAX Rewards Balance
              </span>
              <Award className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-3xl font-black">{points} Points</p>
              <p className="text-xs text-blue-200 mt-1">
                Redeemable value: ₹{points * 1} at checkout
              </p>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-blue-200">
              <span>Tier Multiplier</span>
              <span className="font-bold text-white">1.5x Multiplier</span>
            </div>
          </div>

          {/* Saved Addresses */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#0F172A] dark:text-white font-bold text-sm">
              <MapPin className="w-4 h-4 text-blue-600" /> Primary Shipping Address
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium space-y-1">
              <p className="font-bold text-[#0F172A] dark:text-white">Aarav Sharma</p>
              <p>42/7 Grand Trunk Road, Near Botanical Gardens</p>
              <p>Chennai, Tamil Nadu - 600028</p>
              <p className="text-[11px] text-slate-400">Phone: +91 98450 12345</p>
            </div>
          </div>
        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" /> Customer Purchase History
              </h3>
              <span className="text-xs font-bold text-slate-400">{orders.length} Total Orders</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="pb-3">Order Number</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Grand Total</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {orders.map((o: Order) => (
                    <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="py-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {o.orderNumber}
                      </td>
                      <td className="py-4 text-slate-400 font-medium">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 font-bold text-[#0F172A] dark:text-white">
                        {o.items?.length || 2} items
                      </td>
                      <td className="py-4 font-black text-[#0F172A] dark:text-white">
                        {formatCurrency(o.grandTotal)}
                      </td>
                      <td className="py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          {o.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <Link
                          href={`/orders/${o.id}`}
                          prefetch={true}
                          className="text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-0.5"
                        >
                          View <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Adjust Points Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                  Manual Loyalty Points Adjustment
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Credit or debit reward points for customer service resolution.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustPoints} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
                  Adjustment Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('add')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      adjustType === 'add'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    + Credit Points
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('deduct')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      adjustType === 'deduct'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    - Debit Points
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
                  Points Quantity
                </label>
                <input
                  type="number"
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  placeholder="50"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#0F172A] dark:text-white outline-none focus:border-blue-600 font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
                  Reason for Adjustment (Audit Log)
                </label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g., Courtesy apology bonus for courier delay"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#0F172A] dark:text-white outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20"
                >
                  Apply Points Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

