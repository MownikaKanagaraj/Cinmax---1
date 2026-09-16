'use client';

import * as React from 'react';
import Link from 'next/link';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, SearchBar } from '@cinmax/ui';
import { formatCurrency } from '@cinmax/utils';
import { useCustomersQuery, useOrdersQuery } from '@cinmax/hooks';
import type { CustomerEntity } from '@cinmax/api';
import { ArrowUpRight } from 'lucide-react';

export default function AdminCustomersPage() {
  const [search, setSearch] = React.useState('');
  const { data: customerEntities = [] } = useCustomersQuery();
  const { data: ordersData } = useOrdersQuery(undefined, { page: 1, pageSize: 100 });

  const rawOrders = ordersData?.items || [];

  const customers = customerEntities.map((c: CustomerEntity) => {
    const userOrders = rawOrders.filter((o) => o.userId === c.id || (o.guestEmail && o.guestEmail.toLowerCase() === c.email.toLowerCase()));
    const realSpend = userOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);

    return {
      id: c.id,
      name: c.fullName || c.email.split('@')[0],
      email: c.email,
      tier: `${c.loyaltyTier.toUpperCase()} Member`,
      ordersCount: userOrders.length,
      lifetimeSpend: realSpend,
      lastOrder: userOrders.length > 0 ? new Date(userOrders[0].createdAt).toLocaleDateString() : new Date(c.updatedAt).toLocaleDateString(),
    };
  }).filter((cust) =>
    !search ||
    cust.name.toLowerCase().includes(search.toLowerCase()) ||
    cust.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <PageHeader
        badge="Customer CRM"
        title="Customer List"
        subtitle="View registered customers, total purchase history, loyalty levels, and account details."
      />

      <div className="my-6 max-w-md">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          placeholder="Search customer by name or email..."
        />
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="pb-3">Customer Name</th>
                <th className="pb-3">Email Address</th>
                <th className="pb-3">Membership Tier</th>
                <th className="pb-3">Total Orders</th>
                <th className="pb-3">Lifetime Spend</th>
                <th className="pb-3">Last Active</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {customers.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="py-4 font-bold text-[#0F172A] dark:text-white">{cust.name}</td>
                  <td className="py-4 font-medium text-slate-500 dark:text-slate-300">{cust.email}</td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      {cust.tier}
                    </span>
                  </td>
                  <td className="py-4 font-bold text-[#0F172A] dark:text-white">{cust.ordersCount} orders</td>
                  <td className="py-4 font-bold text-[#0F172A] dark:text-white">{formatCurrency(cust.lifetimeSpend)}</td>
                  <td className="py-4 text-slate-400 font-medium">{cust.lastOrder}</td>
                  <td className="py-4 text-right">
                    <Link
                      href={`/customers/${cust.id}`}
                      prefetch={true}
                      className="text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-0.5"
                    >
                      View Profile <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
