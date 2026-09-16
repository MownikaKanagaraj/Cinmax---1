import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '../../../components/header';
import { Footer } from '../../../components/footer';
import { CartDrawer } from '../../../components/cart-drawer';
import { ProductCard } from '../../../components/product-card';
import { getContainer } from '@cinmax/api';
import { LuxuryArrowRightIcon } from '../../../components/luxury-icons';

export const revalidate = 120;

export default async function CategoryPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  let category: any = null;
  let products: any[] = [];

  try {
    const container = getContainer();
    const categories = await container.content.getCategories();
    category = categories.find((c: any) => c.slug === slug);

    const prodRes = await container.products.getProducts({ categorySlug: slug });
    products = prodRes?.items || [];
  } catch (err) {
    console.error('Error fetching Category RSC data:', err);
  }

  if (!category && products.length === 0) {
    // If not found in categories list, format a default title or check slug
    category = {
      name: slug.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      description: 'Handcrafted cold-processed botanical soaps and luxury formulations.',
    };
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] dark:bg-[#071324] text-[#191C1E] dark:text-slate-100">
      <Header />
      <CartDrawer />

      <main className="flex-1 py-8 px-4 max-w-6xl mx-auto w-full space-y-6">
        {/* Category Header */}
        <div className="bg-[#002754] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-blue-900/40">
          <span className="text-[#C5A880] text-xs font-extrabold uppercase tracking-widest block mb-1">
            Category Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
            {category.name}
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-xl">
            {category.description || 'Explore our hand-cured botanical soap bars, face care balms, and luxury cosmetic sets.'}
          </p>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#002754] dark:text-white">
              No Items Currently Listed in {category.name}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Our master saponifiers are currently curing a new batch for this collection. Explore all available formulations in our main catalog.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#002754] text-white font-bold text-xs shadow-md"
            >
              <span>Explore All Products</span>
              <LuxuryArrowRightIcon size={16} className="text-[#C5A880]" />
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
