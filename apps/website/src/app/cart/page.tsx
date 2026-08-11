'use client';

import * as React from 'react';
import Link from 'next/link';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { CartDrawer } from '../../components/cart-drawer';
import {
  Container,
  PageHeader,
  Breadcrumb,
  QuantitySelector,
  PriceTag,
  Button,
  EmptyState,
} from '@cinmax/ui';
import { useCartStore, useFeaturedProductsQuery } from '@cinmax/hooks';
import { formatCurrency } from '@cinmax/utils';

export default function CartPage() {
  const { items, updateQuantity, removeItem, coupon, applyCoupon, removeCoupon, getTotals, addItem } =
    useCartStore();
  const [couponInput, setCouponInput] = React.useState('');
  const { data: featuredProducts = [] } = useFeaturedProductsQuery(1);

  // Prepopulate 1 item for architecture demonstration if empty
  React.useEffect(() => {
    if (items.length === 0 && featuredProducts.length > 0 && featuredProducts[0]?.variants?.[0]) {
      addItem(featuredProducts[0], featuredProducts[0].variants[0], 2);
    }
  }, [items.length, featuredProducts, addItem]);

  const totals = getTotals();
  const freeShippingThreshold = 50;
  const progressToFreeShipping = Math.min(
    100,
    (totals.subtotal / freeShippingThreshold) * 100
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.toUpperCase() === 'AZURELUXE') {
      applyCoupon({
        code: 'AZURELUXE',
        discountType: 'percentage',
        discountValue: 15,
        description: '15% Atelier Privilege Discount',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />
      <CartDrawer />

      <main className="flex-1 py-10">
        <Container size="xl">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Shopping Bag', isCurrent: true },
            ]}
          />

          <PageHeader
            badge="Your Selection"
            title="Botanical Shopping Bag"
            subtitle="Review your artisanal cold-process formulations before proceeding to secure courier checkout."
          />

          {items.length === 0 ? (
            <EmptyState
              title="Your Bag is Empty"
              description="Explore our curated collection of organic artisan bars and therapeutic balms."
              actionLabel="Discover Formulations"
              onAction={() => (window.location.href = '/shop')}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
              {/* Items List */}
              <div className="lg:col-span-2 space-y-6">
                {/* Free Shipping Progress Indicator */}
                <div className="p-4 rounded-[18px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>
                      {totals.subtotal >= freeShippingThreshold
                        ? '🎉 You unlocked Complimentary Carbon-Neutral Shipping!'
                        : `Add $${(freeShippingThreshold - totals.subtotal).toFixed(
                            2
                          )} more to unlock Complimentary Shipping`}
                    </span>
                    <span>{progressToFreeShipping.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-[#0A3D78] dark:bg-[#C5A880] transition-all duration-500 rounded-full"
                      style={{ width: `${progressToFreeShipping}%` }}
                    />
                  </div>
                </div>

                <div className="divide-y divide-[#0A3D78]/10 bg-white dark:bg-[#071324] rounded-[24px] border border-[#0A3D78]/10 p-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-6 items-center"
                    >
                      <div className="w-24 h-24 rounded-[16px] overflow-hidden bg-slate-100 flex-shrink-0">
                        <img
                          src={
                            item.product.images?.[0]?.url ||
                            'https://images.unsplash.com/photo-1607006314147-759088fd21c2?w=300&auto=format&fit=crop&q=80'
                          }
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1 text-center sm:text-left">
                        <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                          {item.product.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Edition: {item.variant.title} ({item.variant.weightGrams}g)
                        </p>
                        <PriceTag price={item.unitPrice} currency="USD" size="md" />
                      </div>
                      <div className="flex items-center gap-4">
                        <QuantitySelector
                          quantity={item.quantity}
                          min={1}
                          max={10}
                          onChange={(qty) => updateQuantity(item.id, qty)}
                        />
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary Card */}
              <div className="space-y-6">
                <div className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-lg space-y-6">
                  <h3 className="font-serif text-xl font-bold text-[#002754] dark:text-white">
                    Order Summary
                  </h3>

                  {/* Coupon Code Input */}
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon / Privilege Code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-full text-xs bg-[#F7F9FB] dark:bg-[#0A192F] border border-[#0A3D78]/20 focus:outline-none focus:border-[#0A3D78]"
                    />
                    <Button type="submit" variant="outline" size="sm" className="rounded-full text-xs">
                      Apply
                    </Button>
                  </form>
                  {coupon && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs">
                      <span>{coupon.code} applied (-${totals.discount.toFixed(2)})</span>
                      <button onClick={removeCoupon} className="underline hover:text-emerald-900">
                        Remove
                      </button>
                    </div>
                  )}

                  <div className="space-y-3 text-sm border-t border-[#0A3D78]/10 pt-4">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>{formatCurrency(totals.subtotal)}</span>
                    </div>
                    {totals.discount > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Privilege Discount</span>
                        <span>-{formatCurrency(totals.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-muted-foreground">
                      <span>Estimated Shipping</span>
                      <span>
                        {totals.shippingFee === 0 ? 'Complimentary' : formatCurrency(totals.shippingFee)}
                      </span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Estimated Tax</span>
                      <span>{formatCurrency(totals.tax)}</span>
                    </div>
                    <div className="flex justify-between font-serif text-xl font-bold text-[#002754] dark:text-white pt-3 border-t border-[#0A3D78]/10">
                      <span>Estimated Total</span>
                      <span>{formatCurrency(totals.total)}</span>
                    </div>
                  </div>

                  <Button variant="primary" size="lg" className="w-full rounded-full text-base font-bold shadow-xl">
                    <Link href="/checkout" className="w-full">
                      Proceed to Checkout
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
