'use client';

import * as React from 'react';
import Link from 'next/link';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader } from '@cinmax/ui';
import { Warehouse, Sparkles, ArrowRight } from 'lucide-react';

export default function AdminInventoryPage() {
  return (
    <AdminLayout>
      <PageHeader
        badge="External System Managed"
        title="Inventory Management"
        subtitle="Stock tracking and warehouse management are integrated with your external ERP / Inventory system."
      />

      <div className="my-8 max-w-2xl mx-auto p-8 rounded-3xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-lg text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center border border-blue-200 dark:border-blue-800 shadow-sm">
          <Warehouse className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-[#0F172A] dark:text-white">
            External Inventory System Active
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
            Stock levels, warehouse batching, and supply chain updates are handled externally by your connected inventory management system. Store orders automatically sync with your external catalog.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/products"
            prefetch={true}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4" /> Go to Product Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}

