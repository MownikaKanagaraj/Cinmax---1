'use client';

import * as React from 'react';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { CartDrawer } from '../../components/cart-drawer';
import { ProductCard } from '../../components/product-card';
import {
  Container,
  PageHeader,
  Breadcrumb,
  FilterBar,
  Pagination,
  SearchBar,
} from '@cinmax/ui';
import { useProductsQuery, useCategoriesQuery } from '@cinmax/hooks';
import type { Product, Category } from '@cinmax/types';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);

  const { data: categories = [] } = useCategoriesQuery();
  const { data: productsData } = useProductsQuery(
    {
      categorySlug: selectedCategory === 'all' ? undefined : selectedCategory,
      search: searchQuery.trim() || undefined,
    },
    { page: currentPage, pageSize: 12 }
  );

  const products: Product[] = productsData?.items || [];
  const totalPages = productsData?.meta.totalPages || 1;
  const totalCount = productsData?.meta.totalCount || products.length;

  const categoryOptions = [
    { label: 'All Botanical Bars', value: 'all', count: totalCount },
    ...categories.map((c: Category) => ({
      label: c.name,
      value: c.slug,
      count: c.productCount,
    })),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />
      <CartDrawer />

      <main className="flex-1 py-10">
        <Container size="xl">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Shop Collection', isCurrent: true },
            ]}
          />

          <PageHeader
            badge="Botanical Atelier"
            title="Complete Formulations Catalog"
            subtitle="Explore our small-batch cold-process soaps, rich body balms, and natural restorative personal care items."
          />

          {/* Search & Filter Toolbar */}
          <div className="my-8 space-y-4">
            <div className="max-w-md">
              <SearchBar
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                onClear={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                placeholder="Search botanical ingredients, scents, or skin types..."
              />
            </div>
            <FilterBar
              options={categoryOptions}
              selectedValue={selectedCategory}
              onSelect={(val) => {
                setSelectedCategory(val);
                setCurrentPage(1);
              }}
              title="Category"
            />
          </div>

          {/* Product Grid */}
          <div className="pt-4">
            <div className="flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground pb-6">
              <span>Showing {products.length} botanical products</span>
            </div>

            {products.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                <p>No botanical formulations matched your filter criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
