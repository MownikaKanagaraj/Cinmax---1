'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@cinmax/hooks';
import { Button, PriceTag, QuantitySelector, EmptyState } from '@cinmax/ui';
import { formatCurrency } from '@cinmax/utils';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    getTotals,
  } = useCartStore();

  if (!isOpen) return null;

  const totals = getTotals();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#071324] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-[#0A3D78]/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl font-bold text-[#002754] dark:text-white">
                Your Shopping Bag
              </h2>
              <span className="px-2 py-0.5 text-xs rounded-full bg-[#0A3D78]/10 font-bold text-[#0A3D78] dark:text-white">
                {items.length}
              </span>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body / Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <EmptyState
                title="Your Bag is Empty"
                description="Explore our curated collection of cold-process soaps and artisanal botanicals."
                actionLabel="Explore Catalog"
                onAction={closeDrawer}
              />
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-[16px] bg-[#F7F9FB] dark:bg-[#0A192F]/60 border border-[#0A3D78]/10"
                >
                  <div className="w-20 h-20 rounded-[12px] bg-slate-200 relative overflow-hidden flex-shrink-0">
                    <img
                      src={
                        item.product.images?.[0]?.url ||
                        'https://images.unsplash.com/photo-1607006314147-759088fd21c2?w=200&auto=format&fit=crop&q=80'
                      }
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-serif text-sm font-semibold truncate text-[#002754] dark:text-white">
                      {item.product.title}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.variant.title}
                    </p>
                    <PriceTag
                      price={item.unitPrice}
                      currency="USD"
                      size="sm"
                    />
                    <div className="pt-2 flex items-center justify-between">
                      <QuantitySelector
                        quantity={item.quantity}
                        min={1}
                        max={10}
                        onChange={(qty) => updateQuantity(item.id, qty)}
                      />
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#0A3D78]/10 space-y-4 bg-[#F7F9FB]/50 dark:bg-[#071324]">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated Shipping</span>
                  <span>
                    {totals.shippingFee === 0
                      ? 'Complimentary'
                      : formatCurrency(totals.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between font-serif text-lg font-bold text-[#002754] dark:text-white pt-2 border-t border-[#0A3D78]/10">
                  <span>Total</span>
                  <span>{formatCurrency(totals.total)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="md"
                  onClick={closeDrawer}
                  className="w-full"
                >
                  <Link href="/cart" className="w-full">
                    View Bag
                  </Link>
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={closeDrawer}
                  className="w-full"
                >
                  <Link href="/checkout" className="w-full">
                    Checkout
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
