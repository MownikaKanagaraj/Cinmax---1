'use client';

import * as React from 'react';
import Link from 'next/link';
import { AdminLayout } from '../../../components/admin-layout';
import { PageHeader, Button, Input } from '@cinmax/ui';
import { useCategoriesQuery } from '@cinmax/hooks';
import type { Category } from '@cinmax/types';

export default function AdminNewProductPage() {
  const { data: categories = [] } = useCategoriesQuery();

  return (
    <AdminLayout>
      <div className="space-y-2 mb-6">
        <Link
          href="/products"
          className="text-xs font-bold uppercase tracking-wider text-[#0A3D78] dark:text-[#C5A880] hover:underline"
        >
          ← Back to Catalog
        </Link>
      </div>

      <PageHeader
        badge="Formulation Laboratory"
        title="Create New Botanical Product"
        subtitle="Specify botanical ingredients, cold-process cure schedules, and variant packaging."
      />

      <div className="max-w-4xl pt-6">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          {/* Main Info */}
          <div className="p-8 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
              Primary Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  Product Title
                </label>
                <Input placeholder="e.g., French Green Clay & Eucalyptus Bar" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  URL Slug
                </label>
                <Input placeholder="french-green-clay-eucalyptus" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  Category
                </label>
                <select className="w-full px-3.5 py-2.5 rounded-[12px] text-xs bg-[#F7F9FB] dark:bg-[#0A192F] border border-[#0A3D78]/20">
                  {categories.map((c: Category) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  Cure Duration
                </label>
                <Input placeholder="40 Days (Cold Process)" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  Full Botanical Description
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-[14px] text-xs bg-[#F7F9FB] dark:bg-[#0A192F] border border-[#0A3D78]/20 focus:outline-none"
                  placeholder="Detail the organic carrier oils, therapeutic benefits, and artisan technique..."
                />
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="p-8 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
              Pricing & Base Variant
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  Price ($ USD)
                </label>
                <Input type="number" defaultValue="18.00" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  Weight (Grams)
                </label>
                <Input type="number" defaultValue="120" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  Initial Batch Units
                </label>
                <Input type="number" defaultValue="50" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" size="md" className="rounded-full">
              <Link href="/products">Cancel</Link>
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => alert('Formulation Created')}
              className="rounded-full font-bold"
            >
              Publish to Catalog
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
