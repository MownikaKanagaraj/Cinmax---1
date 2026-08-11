'use client';

import * as React from 'react';
import Link from 'next/link';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { CartDrawer } from '../../components/cart-drawer';
import { Container, PageHeader, Breadcrumb, Badge, Button } from '@cinmax/ui';
import { useAuthStore } from '@cinmax/hooks';

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />
      <CartDrawer />

      <main className="flex-1 py-10">
        <Container size="xl">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Customer Account', isCurrent: true },
            ]}
          />

          <PageHeader
            badge="Atelier Privilege Club"
            title={`Welcome back, ${user?.firstName || 'Aurora'}`}
            subtitle="Manage your personal preferences, order history, addresses, and botanical rewards."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {/* Account Card */}
            <div className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#002754] text-[#C5A880] flex items-center justify-center font-serif text-2xl font-bold">
                  {user?.firstName?.[0] || 'A'}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg">
                    {user?.firstName || 'Aurora'} {user?.lastName || 'Vance'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || 'aurora.vance@cinmax.luxury'}
                  </p>
                  <Badge variant="gold" className="mt-1">
                    Gold Tier Patron
                  </Badge>
                </div>
              </div>
              <div className="pt-4 border-t border-[#0A3D78]/10 text-xs text-muted-foreground flex justify-between">
                <span>Loyalty Points Balance</span>
                <strong className="text-[#002754] dark:text-[#C5A880]">
                  480 Botanical Points
                </strong>
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/orders"
                className="p-6 rounded-[20px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 hover:border-[#0A3D78] transition-all space-y-2 block shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-base">Orders & Receipts</h4>
                  <span>→</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  View recent dispatches, delivery tracking, and item history.
                </p>
              </Link>

              <Link
                href="/profile/addresses"
                className="p-6 rounded-[20px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 hover:border-[#0A3D78] transition-all space-y-2 block shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-base">Saved Addresses</h4>
                  <span>→</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Manage shipping addresses for rapid one-click checkout.
                </p>
              </Link>

              <Link
                href="/profile/coupons"
                className="p-6 rounded-[20px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 hover:border-[#0A3D78] transition-all space-y-2 block shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-base">Coupons & Passes</h4>
                  <span>→</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Access your seasonal privilege codes and active discounts.
                </p>
              </Link>

              <Link
                href="/profile/notifications"
                className="p-6 rounded-[20px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 hover:border-[#0A3D78] transition-all space-y-2 block shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-base">Notifications</h4>
                  <span>→</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Alerts on batch cures, shipping dispatches, and restocks.
                </p>
              </Link>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
