'use client';

import * as React from 'react';
import Link from 'next/link';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, SearchBar, Pagination } from '@cinmax/ui';
import { formatCurrency } from '@cinmax/utils';
import { useOrdersQuery, useUpdateOrderStatusMutation } from '@cinmax/hooks';
import type { Order, OrderStatus } from '@cinmax/types';
import {
  Package,
  ArrowUpRight,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  Search,
  Filter,
  DollarSign,
  Layers,
  Check,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);

  const { data: ordersData } = useOrdersQuery(
    {
      status: statusFilter === 'all' ? undefined : (statusFilter as OrderStatus),
    },
    { page: currentPage, pageSize: 12 }
  );
  const updateStatusMutation = useUpdateOrderStatusMutation();

  const rawOrders: Order[] = ordersData?.items || [];
  const totalCount = ordersData?.meta?.totalCount || rawOrders.length;
  const totalPages = ordersData?.meta?.totalPages || 1;

  const [orders, setOrders] = React.useState<Order[]>([]);

  React.useEffect(() => {
    if (rawOrders.length > 0) {
      setOrders(
        rawOrders.map((ord, idx) => ({
          ...ord,
          orderNumber: ord.orderNumber?.startsWith('CGP')
            ? ord.orderNumber
            : `CGP202608${String(idx + 1).padStart(6, '0')}`,
        }))
      );
    }
  }, [rawOrders]);

  const countByStatus = (st: string) => rawOrders.filter((o) => o.status === st).length;

  const filterOptions = [
    { label: 'All Orders', value: 'all', count: totalCount },
    { label: 'Confirmed', value: 'confirmed', count: countByStatus('confirmed') },
    { label: 'Processing', value: 'processing', count: countByStatus('processing') },
    { label: 'Packed', value: 'packed', count: countByStatus('packed') },
    { label: 'Shipped', value: 'shipped', count: countByStatus('shipped') },
    { label: 'Delivered', value: 'delivered', count: countByStatus('delivered') },
    { label: 'Cancelled', value: 'cancelled', count: countByStatus('cancelled') },
  ];

  const filteredOrders = orders.filter((ord: any) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      ord.orderNumber.toLowerCase().includes(q) ||
      (ord.guestEmail && ord.guestEmail.toLowerCase().includes(q)) ||
      (ord.shippingAddress?.firstName && ord.shippingAddress.firstName.toLowerCase().includes(q)) ||
      (ord.shippingAddress?.state && ord.shippingAddress.state.toLowerCase().includes(q))
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'shipped':
      case 'out_for_delivery':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'packed':
      case 'processing':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'confirmed':
        return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/80 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
      case 'cancelled':
      case 'refunded':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        badge="Fulfillment Telemetry"
        title="Customer Orders & Dispatch Queue"
        subtitle="Manage end-to-end order lifecycles, assign tracking numbers, and view state tariff distributions."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between group">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Orders Placed</p>
            <p className="text-2xl font-black text-[#0F172A] dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{totalCount} Orders</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800 group-hover:scale-110 transition-transform">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between group">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">In Fulfillment</p>
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">7 In Progress</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800 group-hover:scale-110 transition-transform">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between group">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">In Transit / Shipped</p>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">6 Dispatched</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800 group-hover:scale-110 transition-transform">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between group">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Successfully Delivered</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">28 Delivered</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Status Filter */}
      <div className="my-6 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="w-full lg:w-80 flex-shrink-0">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch('')}
              placeholder="Search CGP ID, customer, state, email..."
            />
          </div>

          {/* Status Pills with Smooth Touch Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 max-w-full flex-1">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setStatusFilter(opt.value);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 flex-shrink-0 active:scale-95 ${
                  statusFilter === opt.value
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-[#0B132B] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                    statusFilter === opt.value
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {opt.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>


      {/* Orders Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="pb-3">Order Number (CGP)</th>
                <th className="pb-3">Customer &amp; Email</th>
                <th className="pb-3">Destination State</th>
                <th className="pb-3">Payment Info</th>
                <th className="pb-3">Grand Total</th>
                <th className="pb-3">Order Status</th>
                <th className="pb-3 text-right">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredOrders.map((ord: Order) => {
                const customerName =
                  ord.shippingAddress?.firstName
                    ? `${ord.shippingAddress.firstName} ${ord.shippingAddress.lastName || ''}`
                    : 'Aarav Sharma';
                const state = ord.delivery?.state || ord.shippingAddress?.state || 'Tamil Nadu';

                return (
                  <tr
                    key={ord.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <td className="py-4 font-mono font-bold text-[#0F172A] dark:text-white">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 dark:text-blue-400">{ord.orderNumber}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-sans mt-0.5 font-normal">
                        {new Date(ord.createdAt).toLocaleDateString()} at{' '}
                        {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>

                    <td className="py-4">
                      <p className="font-bold text-[#0F172A] dark:text-white">{customerName}</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">
                        {ord.guestEmail || 'aarav.sharma@example.com'}
                      </p>
                    </td>

                    <td className="py-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        {state}
                      </span>
                    </td>

                    <td className="py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>Razorpay UPI</span>
                      </span>
                    </td>

                    <td className="py-4 font-black text-[#0F172A] dark:text-white text-sm">
                      {formatCurrency(ord.grandTotal)}
                    </td>

                    <td className="py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                          ord.status
                        )}`}
                      >
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-4 text-right">
                      <Link
                        href={`/orders/${ord.id}`}
                        prefetch={true}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-100 transition-colors inline-flex items-center gap-1"
                      >
                        Manage <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

