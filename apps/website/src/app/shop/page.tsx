import * as React from 'react';
import Link from 'next/link';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { CartDrawer } from '../../components/cart-drawer';
import { ProductCard } from '../../components/product-card';
import { getContainer } from '@cinmax/api';
import { LuxurySearchIcon, LuxuryArrowRightIcon } from '../../components/luxury-icons';

export const runtime = 'edge';
export const revalidate = 60; // 1 min server cache

export default async function ShopPage(props: {
  searchParams?: Promise<{ search?: string; category?: string; sort?: string }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams?.search || '';
  const categorySlug = searchParams?.category || '';

  let products: any[] = [];
  let categories: any[] = [];

  try {
    const container = getContainer();
    const [prodRes, catRes] = await Promise.all([
      container.products.getProducts({
        categorySlug: categorySlug || undefined,
        search: search || undefined,
      }),
      container.products.getCategories(),
    ]);
    products = JSON.parse(JSON.stringify(prodRes?.items || []));
    categories = JSON.parse(JSON.stringify(catRes || []));
  } catch (err) {
    console.error('Error fetching Shop RSC data:', err);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] dark:bg-[#071324] text-[#191C1E] dark:text-slate-100">
      <Header />
      <CartDrawer />

      <main className="flex-1 py-8 px-4 max-w-6xl mx-auto w-full space-y-6">
        {/* Shop Page Banner Header */}
        <div className="bg-[#002754] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-blue-900/40">
          <span className="text-[#C5A880] text-xs font-extrabold uppercase tracking-widest block mb-1">
            Artisanal Formulations
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
            {categorySlug ? `Collection: ${categorySlug.replace('-', ' ')}` : search ? `Search results for "${search}"` : 'Botanical Collection'}
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-xl">
            Explore cold-processed saponified bars, natural hair growth elixirs, and dermatologically tested botanical face balms.
          </p>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1">
            <Link
              href="/shop"
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                !categorySlug
                  ? 'bg-[#002754] text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
              }`}
            >
              All Products ({products.length})
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}` as any}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  categorySlug === cat.slug
                    ? 'bg-[#002754] text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="text-xs text-slate-500 font-semibold">
            Showing {products.length} item{products.length === 1 ? '' : 's'}
          </div>
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
              No Formulations Found
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We couldn&apos;t find any items matching your filter criteria. Try clearing search keywords or browsing all categories.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#002754] text-white font-bold text-xs shadow-md"
            >
              <span>View Full Catalog</span>
              <LuxuryArrowRightIcon size={16} className="text-[#C5A880]" />
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
