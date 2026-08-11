'use client';

import * as React from 'react';
import Link from 'next/link';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, Badge, SearchBar } from '@cinmax/ui';
import { formatCurrency } from '@cinmax/utils';
import { useCustomersQuery } from '@cinmax/hooks';
import type { CustomerEntity } from '@cinmax/api';

export default function AdminCustomersPage() {
  const [search, setSearch] = React.useState('');
  const { data: customerEntities = [] } = useCustomersQuery();

  const customers = customerEntities.map((c: CustomerEntity) => ({
    id: c.id,
    name: c.fullName || c.email.split('@')[0],
    email: c.email,
    tier: `${c.loyaltyTier.toUpperCase()} Tier Patron`,
    ordersCount: c.savedAddresses?.length || 1,
    lifetimeSpend: (c.loyaltyPoints || 5) * 10,
    lastOrder: new Date(c.updatedAt).toLocaleDateString(),
  })).filter(cust =>
    !search ||
    cust.name.toLowerCase().includes(search.toLowerCase()) ||
    cust.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <PageHeader
        badge="Patron CRM"
        title="Customer Directory"
        subtitle="Manage customer relationships, lifetime botanical spending, and privilege tier assignments."
      />

      <div className="my-6 max-w-md">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          placeholder="Search patron by name or email..."
        />
      </div>

      <div className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#0A3D78]/10 text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="pb-3 font-semibold">Patron Name</th>
                <th className="pb-3 font-semibold">Email</th>
                <th className="pb-3 font-semibold">Privilege Tier</th>
                <th className="pb-3 font-semibold">Total Orders</th>
                <th className="pb-3 font-semibold">Lifetime Spend</th>
                <th className="pb-3 font-semibold">Last Active</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0A3D78]/10">
              {customers.map((cust) => (
                <tr key={cust.id} className="hover:bg-[#F7F9FB] dark:hover:bg-[#0A192F]/40">
                  <td className="py-4 font-bold text-[#002754] dark:text-white">
                    {cust.name}
                  </td>
                  <td className="py-4 text-muted-foreground">{cust.email}</td>
                  <td className="py-4">
                    <Badge variant="gold">{cust.tier}</Badge>
                  </td>
                  <td className="py-4 font-semibold">{cust.ordersCount} orders</td>
                  <td className="py-4 font-bold">{formatCurrency(cust.lifetimeSpend)}</td>
                  <td className="py-4 text-muted-foreground">{cust.lastOrder}</td>
                  <td className="py-4 text-right">
                    <Link
                      href={`/customers/${cust.id}`}
                      className="text-[#0A3D78] dark:text-[#C5A880] font-bold hover:underline"
                    >
                      View Profile →
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
