'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AdminLayout } from '../../../components/admin-layout';
import { PageHeader, Badge, Button } from '@cinmax/ui';
import { formatCurrency } from '@cinmax/utils';
import { useOrdersQuery } from '@cinmax/hooks';
import type { Order } from '@cinmax/types';

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const customerId = (params?.id as string) || 'cust_1';
  const { data: ordersData } = useOrdersQuery(undefined, { page: 1, pageSize: 3 });
  const orders: Order[] = ordersData?.items || [];

  return (
    <AdminLayout>
      <div className="space-y-2 mb-6">
        <Link
          href="/customers"
          className="text-xs font-bold uppercase tracking-wider text-[#0A3D78] dark:text-[#C5A880] hover:underline"
        >
          ← Back to Customer Directory
        </Link>
      </div>

      <PageHeader
        badge="Patron Dossier"
        title="Aurora Vance"
        subtitle="Patron ID: usr_aurora_991 • Member since May 2025"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
        <div className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-4 text-sm">
          <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
            Patron Summary
          </h3>
          <div className="space-y-2 text-xs">
            <p><strong className="text-foreground">Email:</strong> aurora.vance@cinmax.luxury</p>
            <p><strong className="text-foreground">Phone:</strong> +1 (310) 555-0199</p>
            <p><strong className="text-foreground">Total Orders:</strong> 8 completed</p>
            <p><strong className="text-foreground">Lifetime Spend:</strong> {formatCurrency(420.0)}</p>
            <p><strong className="text-foreground">Loyalty Points:</strong> 480 Points</p>
          </div>
          <div className="pt-2">
            <Badge variant="gold">Gold Tier Patron</Badge>
          </div>
        </div>

        <div className="lg:col-span-2 p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
            Order History with Atelier
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#0A3D78]/10 text-muted-foreground uppercase">
                <tr>
                  <th className="pb-2">Order</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0A3D78]/10">
                {orders.map((o: Order) => (
                  <tr key={o.id}>
                    <td className="py-3 font-mono font-bold">{o.orderNumber}</td>
                    <td className="py-3 text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 font-bold">{formatCurrency(o.grandTotal)}</td>
                    <td className="py-3"><Badge variant="primary">{o.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
