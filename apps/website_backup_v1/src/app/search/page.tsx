'use client';

import * as React from 'react';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { CartDrawer } from '../../components/cart-drawer';
import { ProductCard } from '../../components/product-card';
import { Container, PageHeader, Breadcrumb, SearchBar, EmptyState } from '@cinmax/ui';
import { useSearchStore, useSearchProductsQuery } from '@cinmax/hooks';
import type { Product } from '@cinmax/types';

export default function SearchPage() {
  const { query, setQuery, recentSearches } = useSearchStore();

  const { data: searchResults = [] } = useSearchProductsQuery(query, {
    enabled: Boolean(query.trim()),
  });

  const results: Product[] = searchResults;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />
      <CartDrawer />

      <main className="flex-1 py-10">
        <Container size="xl">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Search Formulations', isCurrent: true },
            ]}
          />

          <PageHeader
            badge="Botanical Query"
            title="Discover Formulations"
            subtitle="Search across natural saponified bars, organic balms, essential oil scent profiles, and skin remedies."
          />

          {/* Search Input */}
          <div className="max-w-2xl mx-auto my-8 space-y-4">
            <SearchBar
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClear={() => setQuery('')}
              placeholder="Search by ingredient, scent note, or skin type..."
            />

            {/* Recent Searches */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Popular Searches:
              </span>
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3 py-1 rounded-full text-xs bg-white dark:bg-[#071324] border border-[#0A3D78]/15 hover:border-[#0A3D78] transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          <div className="pt-6">
            {!query.trim() ? (
              <div className="py-12 text-center text-muted-foreground">
                <p>Type a search term above to explore the CINMAX Botanical Collection.</p>
              </div>
            ) : results.length === 0 ? (
              <EmptyState
                title="No Formulations Found"
                description={`We couldn't find any botanical products matching "${query}". Try searching for lavender, bergamot, or charcoal.`}
                actionLabel="View All Catalog"
                onAction={() => setQuery('')}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {results.map((product: Product) => (
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
