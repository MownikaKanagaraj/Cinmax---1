'use client';

import * as React from 'react';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { CartDrawer } from '../../components/cart-drawer';
import { ProductCard } from '../../components/product-card';
import { Container, PageHeader, Breadcrumb, EmptyState, Button } from '@cinmax/ui';
import { useWishlistStore } from '@cinmax/hooks';
import type { Product } from '@cinmax/types';

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore();

  const displayItems: Product[] = items;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />
      <CartDrawer />

      <main className="flex-1 py-10">
        <Container size="xl">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Saved Wishlist', isCurrent: true },
            ]}
          />

          <PageHeader
            badge="Personal Reserve"
            title="Saved Botanical Favorites"
            subtitle="Keep track of your favorite artisan bars, upcoming seasonal cures, and personalized botanical regimes."
            actions={
              displayItems.length > 0 ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearWishlist}
                  className="text-xs"
                >
                  Clear Wishlist
                </Button>
              ) : undefined
            }
          />

          <div className="pt-8">
            {displayItems.length === 0 ? (
              <EmptyState
                title="Your Wishlist is Empty"
                description="Save your favorite artisanal soap bars and balms while you explore our catalog."
                actionLabel="Explore Collections"
                onAction={() => (window.location.href = '/shop')}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayItems.map((product) => (
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
