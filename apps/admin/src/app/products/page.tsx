'use client';

import * as React from 'react';
import Link from 'next/link';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, Badge, Button, SearchBar } from '@cinmax/ui';
import { formatCurrency } from '@cinmax/utils';
import { useProductsQuery } from '@cinmax/hooks';
import type { Product } from '@cinmax/types';

export default function AdminProductsPage() {
  const [search, setSearch] = React.useState('');
  const { data: productsData } = useProductsQuery({
    search: search || undefined,
  });

  const products: Product[] = productsData?.items || [];

  return (
    <AdminLayout>
      <PageHeader
        badge="Catalog Directory"
        title="Formulations & Products"
        subtitle="Manage product catalog, variants, cure duration metadata, and inventory thresholds."
        actions={
          <Button variant="primary" size="sm" className="rounded-full">
            <Link href="/products/new">+ Create New Formulation</Link>
          </Button>
        }
      />

      <div className="my-6 max-w-md">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          placeholder="Search products by title or formulation..."
        />
      </div>

      <div className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#0A3D78]/10 text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="pb-3 font-semibold">Formulation</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Process</th>
                <th className="pb-3 font-semibold">Base Price</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0A3D78]/10">
              {products.map((p: Product) => (
                <tr key={p.id} className="hover:bg-[#F7F9FB] dark:hover:bg-[#0A192F]/40">
                  <td className="py-4 font-bold text-[#002754] dark:text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[10px] bg-slate-100 overflow-hidden flex-shrink-0">
                      <img
                        src={p.images?.[0]?.url}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span>{p.title}</span>
                  </td>
                  <td className="py-4 text-muted-foreground">{p.category?.name || 'Cold Process'}</td>
                  <td className="py-4">
                    <Badge variant="primary">{p.processType?.replace('_', ' ') || 'Artisanal'}</Badge>
                  </td>
                  <td className="py-4 font-bold">{formatCurrency(p.variants?.[0]?.price || p.basePrice || 18.0)}</td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active Catalog
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <Link
                      href={`/products/${p.id}`}
                      className="text-[#0A3D78] dark:text-[#C5A880] font-bold hover:underline"
                    >
                      Edit →
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
