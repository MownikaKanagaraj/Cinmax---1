'use client';

import * as React from 'react';
import Link from 'next/link';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, SearchBar, Pagination } from '@cinmax/ui';
import { formatCurrency } from '@cinmax/utils';
import { useOrdersQuery } from '@cinmax/hooks';
import type { Order, OrderStatus } from '@cinmax/types';
import { ArrowUpRight } from 'lucide-react';

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);

  const { data: ordersData } = useOrdersQuery(
    {
      status: statusFilter === 'all' ? undefined : (statusFilter as OrderStatus),
    },
    { page: currentPage, pageSize: 10 }
  );

  const orders: Order[] = ordersData?.items || [];
  const totalCount = ordersData?.meta.totalCount || orders.length;
  const totalPages = ordersData?.meta.totalPages || 1;

  const filterOptions = [
    { label: 'All Orders', value: 'all', count: totalCount },
    { label: 'Pending', value: 'pending', count: 2 },
    { label: 'Processing & Packing', value: 'processing', count: 4 },
    { label: 'Shipped', value: 'shipped', count: 12 },
    { label: 'Delivered', value: 'delivered', count: 26 },
  ];

  const filteredOrders = orders.filter((ord: Order) => {
    const matchesSearch =
      search === '' ||
      ord.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      (ord.guestEmail && ord.guestEmail.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });

  return (
    <AdminLayout>
      <PageHeader
        badge="Orders & Shipping"
        title="Customer Orders"
        subtitle="View customer purchases, update order status, and track shipping deliveries."
      />

      <div className="my-6 space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-80">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch('')}
              placeholder="Search order number or email..."
            />
          </div>

          {/* Status Pills */}
          <div className="flex flex-wrap gap-2 overflow-x-auto w-full sm:w-auto">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setStatusFilter(opt.value);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  statusFilter === opt.value
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] ${
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

      {/* Corporate Data Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="pb-3">Order Number</th>
                <th className="pb-3">Customer Email</th>
                <th className="pb-3">Order Date</th>
                <th className="pb-3">Items Count</th>
                <th className="pb-3">Total Amount</th>
                <th className="pb-3">Order Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredOrders.map((ord: Order) => (
                <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="py-4 font-mono font-bold text-[#0F172A] dark:text-white">
                    {ord.orderNumber}
                  </td>
                  <td className="py-4 font-medium text-slate-500 dark:text-slate-300">
                    {ord.guestEmail || 'customer@example.com'}
                  </td>
                  <td className="py-4 text-slate-400 font-medium">
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 font-bold text-[#0F172A] dark:text-white">{ord.items?.length || 2} items</td>
                  <td className="py-4 font-bold text-[#0F172A] dark:text-white">{formatCurrency(ord.grandTotal)}</td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      {ord.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <Link
                      href={`/orders/${ord.id}`}
                      prefetch={true}
                      className="text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-0.5"
                    >
                      View Order <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
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
