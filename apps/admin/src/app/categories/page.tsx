'use client';

import * as React from 'react';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, Button } from '@cinmax/ui';
import { useCategoriesQuery } from '@cinmax/hooks';
import type { Category } from '@cinmax/types';

export default function AdminCategoriesPage() {
  const { data: categories = [] } = useCategoriesQuery();

  return (
    <AdminLayout>
      <PageHeader
        badge="Product Organization"
        title="Product Categories"
        subtitle="Group store products into clear categories and collections for easy customer browsing."
        actions={
          <Button variant="primary" size="sm" className="rounded-xl">
            + Add New Category
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        {categories.map((c: Category) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
              <img
                src={
                  c.imageUrl ||
                  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&auto=format&fit=crop&q=80'
                }
                alt={c.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                  {c.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                  {c.productCount || 0} Products
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{c.description}</p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
              <span className="font-mono text-slate-400">/{c.slug}</span>
              <button className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                Edit Category
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
