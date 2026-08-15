'use client';

import * as React from 'react';
import Link from 'next/link';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, SearchBar } from '@cinmax/ui';
import { formatCurrency } from '@cinmax/utils';
import { useProductsQuery } from '@cinmax/hooks';
import type { Product } from '@cinmax/types';
import { ArrowUpRight } from 'lucide-react';

export default function AdminProductsPage() {
  const [search, setSearch] = React.useState('');
  const { data: productsData } = useProductsQuery({
    search: search || undefined,
  });

  const products: Product[] = productsData?.items || [];

  return (
    <AdminLayout>
      <PageHeader
        badge="Product Catalog"
        title="Products & Inventory"
        subtitle="Manage store items, set prices, update categories, and monitor stock availability."
        actions={
          <Link
            href="/products/new"
            prefetch={true}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all inline-block"
          >
            + Add New Product
          </Link>
        }
      />

      <div className="my-6 max-w-md">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          placeholder="Search products by title or category..."
        />
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="pb-3">Product Name</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Stock Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {products.map((p: Product) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="py-4 font-bold text-[#0F172A] dark:text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex-shrink-0">
                      <img
                        src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1607006482140-520e7df6504a?w=100'}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-[#0F172A] dark:text-white">{p.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{p.slug}</p>
                    </div>
                  </td>
                  <td className="py-4 font-medium text-slate-500 dark:text-slate-300">
                    {p.category?.name || 'General'}
                  </td>
                  <td className="py-4 font-bold text-[#0F172A] dark:text-white">
                    {formatCurrency(p.basePrice)}
                  </td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      In Stock
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <Link
                      href={`/products/${p.id}`}
                      prefetch={true}
                      className="text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-0.5"
                    >
                      Edit <ArrowUpRight className="w-3.5 h-3.5" />
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
