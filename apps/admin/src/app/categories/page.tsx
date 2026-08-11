'use client';

import * as React from 'react';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, Button, Badge } from '@cinmax/ui';
import { useCategoriesQuery } from '@cinmax/hooks';
import type { Category } from '@cinmax/types';

export default function AdminCategoriesPage() {
  const { data: categories = [] } = useCategoriesQuery();

  return (
    <AdminLayout>
      <PageHeader
        badge="Taxonomy Engine"
        title="Botanical Categories"
        subtitle="Organize cold-process collections, skincare rituals, and seasonal cure groupings."
        actions={
          <Button variant="primary" size="sm" className="rounded-full">
            + Create New Category
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        {categories.map((c: Category) => (
          <div
            key={c.id}
            className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm space-y-4"
          >
            <div className="w-full h-32 rounded-[16px] overflow-hidden bg-slate-100 relative">
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
                <h3 className="font-serif font-bold text-base text-[#002754] dark:text-white">
                  {c.name}
                </h3>
                <Badge variant="primary">{c.productCount || 0} Products</Badge>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{c.description}</p>
            </div>
            <div className="pt-2 border-t border-[#0A3D78]/10 flex justify-between items-center text-xs">
              <span className="font-mono text-muted-foreground">/{c.slug}</span>
              <button className="text-[#0A3D78] dark:text-[#C5A880] font-bold hover:underline">
                Edit Category
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
