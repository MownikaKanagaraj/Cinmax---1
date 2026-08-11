'use client';

import * as React from 'react';
import Link from 'next/link';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, FilterBar, Badge, SearchBar, Pagination } from '@cinmax/ui';
import { formatCurrency } from '@cinmax/utils';
import { useOrdersQuery } from '@cinmax/hooks';
import type { Order, OrderStatus } from '@cinmax/types';

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
    { label: 'Pending Processing', value: 'pending', count: 2 },
    { label: 'Curing & Packing', value: 'processing', count: 4 },
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
        badge="Fulfillment Hub"
        title="Order Management Queue"
        subtitle="Manage parcel dispatches, track courier air bills, and process refunds."
      />

      <div className="my-6 space-y-4">
        <div className="max-w-md">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
            placeholder="Search order number or customer email..."
          />
        </div>
        <FilterBar
          options={filterOptions}
          selectedValue={statusFilter}
          onSelect={(val) => {
            setStatusFilter(val);
            setCurrentPage(1);
          }}
          title="Status"
        />
      </div>

      <div className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#0A3D78]/10 text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="pb-3 font-semibold">Order Number</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Items</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0A3D78]/10">
              {filteredOrders.map((ord: Order) => (
                <tr key={ord.id} className="hover:bg-[#F7F9FB] dark:hover:bg-[#0A192F]/40">
                  <td className="py-4 font-mono font-bold text-[#002754] dark:text-white">
                    {ord.orderNumber}
                  </td>
                  <td className="py-4 text-muted-foreground">
                    {ord.guestEmail || 'patron@cinmax.luxury'}
                  </td>
                  <td className="py-4 text-muted-foreground">
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 font-semibold">{ord.items?.length || 2} units</td>
                  <td className="py-4 font-bold">{formatCurrency(ord.grandTotal)}</td>
                  <td className="py-4">
                    <Badge variant="primary">{ord.status.toUpperCase()}</Badge>
                  </td>
                  <td className="py-4 text-right">
                    <Link
                      href={`/orders/${ord.id}`}
                      className="text-[#0A3D78] dark:text-[#C5A880] font-bold hover:underline"
                    >
                      Manage Order →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </AdminLayout>
  );
}
