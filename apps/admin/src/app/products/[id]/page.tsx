'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AdminLayout } from '../../../components/admin-layout';
import { PageHeader, Button, Input } from '@cinmax/ui';
import { useProductByIdQuery } from '@cinmax/hooks';

export default function AdminEditProductPage() {
  const params = useParams();
  const prodId = (params?.id as string) || 'prod_1';
  const { data: product, isLoading } = useProductByIdQuery(prodId);

  if (isLoading || !product) {
    return (
      <AdminLayout>
        <div className="py-20 text-center text-muted-foreground font-serif">
          Loading product formulation...
        </div>
      </AdminLayout>
    );
  }

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
        badge="Formulation Editor"
        title={`Edit: ${product.title}`}
        subtitle={`SKU: CNX-SOAP-001 • Category: ${product.category?.name || 'Cold Process'}`}
      />

      <div className="max-w-4xl pt-6">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          <div className="p-8 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
              Edit Product Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  Product Title
                </label>
                <Input defaultValue={product.title} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  Price ($ USD)
                </label>
                <Input defaultValue={product.variants?.[0]?.price?.toString() || product.basePrice?.toString() || '18.00'} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  Description
                </label>
                <textarea
                  rows={4}
                  defaultValue={product.description}
                  className="w-full px-4 py-3 rounded-[14px] text-xs bg-[#F7F9FB] dark:bg-[#0A192F] border border-[#0A3D78]/20 focus:outline-none"
                />
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
              onClick={() => alert('Changes Saved')}
              className="rounded-full font-bold"
            >
              Update Formulation
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
