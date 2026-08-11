'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Header } from '../../../components/header';
import { Footer } from '../../../components/footer';
import { CartDrawer } from '../../../components/cart-drawer';
import { ProductCard } from '../../../components/product-card';
import { Container, PageHeader, Breadcrumb, EmptyState } from '@cinmax/ui';
import { useCategoryBySlugQuery, useProductsByCategoryQuery } from '@cinmax/hooks';
import type { Product } from '@cinmax/types';

export default function CategoryPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const { data: category } = useCategoryBySlugQuery(slug, { enabled: Boolean(slug) });
  const { data: productsData } = useProductsByCategoryQuery(slug, undefined, { enabled: Boolean(slug) });

  const currentCategory = category || {
    name: slug ? slug.replace(/-/g, ' ') : 'Botanical Category',
    description: 'Hand-crafted artisanal soaps created with pure botanical botanics and organic oils.',
    slug: slug,
  };

  const categoryProducts: Product[] = productsData?.items || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />
      <CartDrawer />

      <main className="flex-1 py-10">
        <Container size="xl">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Collections', href: '/shop' },
              { label: currentCategory.name, isCurrent: true },
            ]}
          />

          <PageHeader
            badge="Curated Category"
            title={currentCategory.name}
            subtitle={currentCategory.description}
          />

          <div className="pt-8">
            {categoryProducts.length === 0 ? (
              <EmptyState
                title="No Products Found"
                description="We are currently curing new batches for this botanical category."
                actionLabel="Explore All Products"
                onAction={() => (window.location.href = '/shop')}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categoryProducts.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
