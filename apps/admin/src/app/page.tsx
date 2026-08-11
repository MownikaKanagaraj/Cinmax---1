'use client';

import * as React from 'react';
import Link from 'next/link';
import { AdminLayout } from '../components/admin-layout';
import { PageHeader, Badge, Button } from '@cinmax/ui';
import { formatCurrency } from '@cinmax/utils';
import { useProductsQuery, useOrdersQuery } from '@cinmax/hooks';
import type { Product, Order } from '@cinmax/types';

export default function AdminDashboardPage() {
  const { data: productsData } = useProductsQuery(undefined, { page: 1, pageSize: 4 });
  const { data: ordersData } = useOrdersQuery(undefined, { page: 1, pageSize: 5 });

  const products: Product[] = productsData?.items || [];
  const orders: Order[] = ordersData?.items || [];

  const kpis = [
    {
      title: 'Net Revenue (Month)',
      value: '$24,850.00',
      change: '+18.4%',
      positive: true,
      icon: 'attach_money',
    },
    {
      title: 'Active Orders',
      value: '42 Orders',
      change: '+6 today',
      positive: true,
      icon: 'package_2',
    },
    {
      title: 'Bars in Curing Racks',
      value: '1,450 Units',
      change: 'Next release in 4 days',
      positive: true,
      icon: 'hourglass_empty',
    },
    {
      title: 'Patron Satisfaction',
      value: '4.95 / 5.0',
      change: '98.7% positive',
      positive: true,
      icon: 'star',
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        badge="Executive Overview"
        title="Atelier Operations Dashboard"
        subtitle="Real-time telemetry on revenue, curing rack status, order fulfillment, and patron retention."
        actions={
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="rounded-full">
              <Link href="/analytics">Export CSV Report</Link>
            </Button>
            <Button variant="primary" size="sm" className="rounded-full">
              <Link href="/products/new">+ Create Formulation</Link>
            </Button>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
                {kpi.title}
              </span>
              <span className="material-symbols-outlined text-xl text-[#0A3D78]">{kpi.icon}</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-black text-[#002754] dark:text-white">
                {kpi.value}
              </h3>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {kpi.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders & Curing Batches Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
              Recent Dispatches
            </h3>
            <Link
              href="/orders"
              className="text-xs font-bold uppercase tracking-wider text-[#0A3D78] dark:text-[#C5A880] hover:underline"
            >
              View All Orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#0A3D78]/10 text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="pb-3 font-semibold">Order</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0A3D78]/10">
                {orders.map((ord: Order) => (
                  <tr key={ord.id} className="hover:bg-[#F7F9FB] dark:hover:bg-[#0A192F]/40">
                    <td className="py-3.5 font-mono font-bold">{ord.orderNumber}</td>
                    <td className="py-3.5 text-muted-foreground">{ord.guestEmail || 'aurora@cinmax.luxury'}</td>
                    <td className="py-3.5 font-bold">{formatCurrency(ord.grandTotal)}</td>
                    <td className="py-3.5">
                      <Badge variant="primary">{ord.status.toUpperCase()}</Badge>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        href={`/orders/${ord.id}`}
                        className="text-[#0A3D78] dark:text-[#C5A880] font-bold hover:underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock / Cure Alert */}
        <div className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
            Formulation Inventory Status
          </h3>
          <div className="space-y-3">
            {products.map((p: Product) => (
              <div
                key={p.id}
                className="p-3 rounded-[16px] bg-[#F7F9FB] dark:bg-[#0A192F] border border-[#0A3D78]/10 flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <p className="font-serif text-xs font-bold truncate">{p.title}</p>
                  <p className="text-[10px] text-muted-foreground">
                    Cured Batch: 28 units left
                  </p>
                </div>
                <Badge variant="gold">In Stock</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
