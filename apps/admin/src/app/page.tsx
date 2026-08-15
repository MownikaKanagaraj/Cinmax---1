'use client';

import * as React from 'react';
import Link from 'next/link';
import { AdminLayout } from '../components/admin-layout';
import { PageHeader } from '@cinmax/ui';
import { formatCurrency } from '@cinmax/utils';
import { useProductsQuery, useOrdersQuery } from '@cinmax/hooks';
import type { Product, Order } from '@cinmax/types';
import { DollarSign, Package, Warehouse, Star, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data: productsData } = useProductsQuery(undefined, { page: 1, pageSize: 4 });
  const { data: ordersData } = useOrdersQuery(undefined, { page: 1, pageSize: 5 });

  const products: Product[] = productsData?.items || [];
  const orders: Order[] = ordersData?.items || [];

  const kpis = [
    {
      title: 'Total Sales (This Month)',
      value: '₹2,48,500.00',
      change: '+18.4% compared to last month',
      positive: true,
      icon: DollarSign,
    },
    {
      title: 'Total Orders',
      value: '42 Orders',
      change: '+6 orders placed today',
      positive: true,
      icon: Package,
    },
    {
      title: 'Total Products in Stock',
      value: '1,450 Items',
      change: 'All core items available',
      positive: true,
      icon: Warehouse,
    },
    {
      title: 'Customer Rating',
      value: '4.95 / 5.0',
      change: 'Based on customer reviews',
      positive: true,
      icon: Star,
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        badge="Store Dashboard"
        title="Store Sales & Operations Overview"
        subtitle="Quick view of total sales revenue, customer orders, product stock levels, and ratings."
        actions={
          <div className="flex items-center gap-3">
            <Link
              href="/analytics"
              prefetch={true}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold hover:bg-slate-100 transition-colors"
            >
              Sales Report
            </Link>
            <Link
              href="/products/new"
              prefetch={true}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
            >
              + Add Product
            </Link>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-6">
        {kpis.map((kpi, idx) => {
          const IconComp = kpi.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                  {kpi.title}
                </span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                  <IconComp className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-sans text-2xl font-bold text-[#0F172A] dark:text-white">
                  {kpi.value}
                </h3>
                <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> {kpi.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders & Product Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-sans text-base font-bold text-[#0F172A] dark:text-white">
                Recent Orders
              </h3>
              <p className="text-xs text-slate-400">Latest customer purchases</p>
            </div>
            <Link
              href="/orders"
              prefetch={true}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              View All Orders <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer Email</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {orders.map((ord: Order) => (
                  <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 font-mono font-bold text-[#0F172A] dark:text-white">{ord.orderNumber}</td>
                    <td className="py-3 text-slate-500 dark:text-slate-300 font-medium">{ord.guestEmail || 'customer@example.com'}</td>
                    <td className="py-3 font-bold text-[#0F172A] dark:text-white">{formatCurrency(ord.grandTotal)}</td>
                    <td className="py-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                        {ord.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/orders/${ord.id}`}
                        prefetch={true}
                        className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                      >
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Stock Status */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-sans text-base font-bold text-[#0F172A] dark:text-white">
                Product Stock Levels
              </h3>
              <p className="text-xs text-slate-400">Items available in store</p>
            </div>
            <Link
              href="/inventory"
              prefetch={true}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Manage Stock →
            </Link>
          </div>

          <div className="space-y-3">
            {products.map((p: Product) => (
              <div
                key={p.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <p className="font-bold text-xs text-[#0F172A] dark:text-white truncate">{p.title}</p>
                  <p className="text-[10px] font-medium text-slate-400">₹{p.basePrice} • 180 units in stock</p>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  In Stock
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
