'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore, useUser, useValidateCouponMutation, useDispatchTimeQuery } from '@cinmax/hooks';
import { Button, PriceTag, QuantitySelector, EmptyState } from '@cinmax/ui';
import { formatCurrency } from '@cinmax/utils';
import { LoginRequiredModal } from './login-required-modal';
import { Check, Truck } from 'lucide-react';
import {
  LuxuryBagIcon,
  LuxuryCloseIcon,
  LuxuryTrashIcon,
  LuxuryTagIcon,
  LuxuryArrowRightIcon,
} from './luxury-icons';

export function CartDrawer() {
  const router = useRouter();
  const { user, isAuthenticated } = useUser();
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [couponInput, setCouponInput] = React.useState('');
  const [couponError, setCouponError] = React.useState('');
  const [couponSuccess, setCouponSuccess] = React.useState('');

  const validateCoupon = useValidateCouponMutation();
  const { dispatchTimeDays } = useDispatchTimeQuery();

  const {
    items,
    isOpen,
    coupon,
    closeDrawer,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    getTotals,
  } = useCartStore();

  const handleCheckout = () => {
    const invalidItem = items.find((item) => {
      const minQty = Math.max(1, item.product?.minOrderQuantity || 1);
      return item.quantity < minQty;
    });

    if (invalidItem) {
      const minQty = Math.max(1, invalidItem.product?.minOrderQuantity || 1);
      alert(`"${invalidItem.product.title}" requires a minimum order quantity of ${minQty} units.`);
      return;
    }

    if (!isAuthenticated && !user) {
      setShowLoginModal(true);
    } else {
      closeDrawer();
      router.push('/checkout');
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    const totals = getTotals();
    try {
      const res = await validateCoupon.mutateAsync({
        code,
        subtotal: totals.subtotal,
      });

      if (res.isValid && res.coupon) {
        applyCoupon({
          code: res.coupon.code,
          discountType: res.coupon.discountType as any,
          discountValue: res.coupon.discountValue,
          description: res.coupon.description,
        });
        setCouponSuccess(`Coupon ${res.coupon.code} applied successfully!`);
        setCouponInput('');
      } else {
        setCouponError(res.message || 'Invalid or expired coupon code.');
      }
    } catch (err: any) {
      setCouponError(err.message || 'Failed to validate coupon code.');
    }
  };

  const totals = getTotals();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop Overlay */}
        <div
          onClick={closeDrawer}
          className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
        />

        {/* Top-Opening Dropdown Panel (Slide Down from Top) */}
        <div className="relative top-0 inset-x-0 w-full max-w-4xl mx-auto bg-white dark:bg-[#071324] shadow-[0_25px_60px_rgba(0,39,84,0.35)] rounded-b-[32px] border-b-2 border-[#C5A880]/50 max-h-[88vh] flex flex-col z-50 animate-in slide-in-from-top duration-300 ease-out overflow-hidden">
          
          {/* Panel Top Header Bar */}
          <div className="px-6 py-4 bg-[#002754] text-white flex items-center justify-between border-b border-[#C5A880]/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C5A880] text-[#002754] flex items-center justify-center shadow-md">
                <LuxuryBagIcon size={20} className="text-[#002754]" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  CINMAX Shopping Bag
                  <span className="px-2 py-0.5 text-xs rounded-full bg-[#C5A880]/30 text-[#C5A880] font-mono font-bold">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                </h2>
                <p className="text-[11px] text-[#C5A880] uppercase tracking-wider font-semibold">
                  Artisanal Botanicals &amp; Cold Process Soaps
                </p>
              </div>
            </div>

            <button
              onClick={closeDrawer}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              aria-label="Continue Shopping"
            >
              <span>Continue Shopping</span>
              <LuxuryCloseIcon size={16} />
            </button>
          </div>

          {/* Panel Body / Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[55vh]">
            {items.length === 0 ? (
              <EmptyState
                title="Your Shopping Bag is Empty"
                description="Explore our handcrafted cold-process soaps, luxury body balms, and botanical collections."
                actionLabel="Explore Full Collection"
                onAction={() => {
                  closeDrawer();
                  router.push('/shop');
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 rounded-2xl bg-[#F7F9FB] dark:bg-[#0A192F]/70 border border-[#0A3D78]/15 hover:border-[#002754] transition-all shadow-sm"
                  >
                    <div className="w-20 h-20 rounded-xl bg-slate-200 relative overflow-hidden flex-shrink-0 border border-slate-300/60">
                      <img
                        src={
                          item.product.images?.[0]?.url ||
                          'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=200&auto=format&fit=crop&q=80'
                        }
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif text-sm font-bold truncate text-[#002754] dark:text-white">
                            {item.product.title}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-slate-400 hover:text-red-600 transition-colors p-1"
                            title="Remove item"
                          >
                            <LuxuryTrashIcon size={16} />
                          </button>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {item.variant.title}
                        </p>
                        <p className="font-serif font-bold text-sm text-[#002754] dark:text-[#C5A880] mt-0.5">
                          {formatCurrency(item.unitPrice)}
                        </p>
                        {item.product?.minOrderQuantity && item.product.minOrderQuantity > 1 && (
                          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 block mt-0.5">
                            Min. {item.product.minOrderQuantity} units required
                          </span>
                        )}
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <QuantitySelector
                          quantity={item.quantity}
                          min={Math.max(1, item.product?.minOrderQuantity || 1)}
                          max={50}
                          onChange={(qty) => updateQuantity(item.id, qty)}
                        />
                        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                          {formatCurrency(item.totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Panel Footer: Coupon + Summary + Actions */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#0A3D78]/15 bg-[#F7F9FB]/90 dark:bg-[#071324] space-y-4">
              
              {/* Coupon Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#0A192F] p-3 rounded-2xl border border-[#0A3D78]/15">
                <form onSubmit={handleApplyCoupon} className="flex items-center gap-2 flex-1">
                  <LuxuryTagIcon size={18} className="text-[#C5A880] flex-shrink-0" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon Code (e.g. WELCOME10)"
                    className="w-full text-xs font-bold uppercase tracking-wider bg-transparent outline-none text-[#002754] dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={validateCoupon.isPending || !couponInput.trim()}
                    className="px-3 py-1.5 rounded-xl bg-[#002754] hover:bg-[#0A3D78] text-white font-bold text-xs transition-all flex-shrink-0 disabled:opacity-50 cursor-pointer"
                  >
                    {validateCoupon.isPending ? 'Validating...' : 'Apply'}
                  </button>
                </form>

                {coupon && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-200">
                    <Check className="w-3.5 h-3.5" />
                    <span>{coupon.code} (-{formatCurrency(totals.discount)})</span>
                    <button
                      onClick={removeCoupon}
                      className="ml-1 text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {couponError && (
                <p className="text-xs font-semibold text-red-600 text-center">{couponError}</p>
              )}
              {couponSuccess && (
                <p className="text-xs font-semibold text-emerald-600 text-center">{couponSuccess}</p>
              )}

              {/* Order Totals Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
                <div className="p-3 rounded-xl bg-white dark:bg-[#0A192F] border border-[#0A3D78]/10 text-center">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Subtotal</span>
                  <span className="font-serif text-sm font-bold text-[#002754] dark:text-white">
                    {formatCurrency(totals.subtotal)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#0A192F] border border-[#0A3D78]/10 text-center">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Discount</span>
                  <span className="font-serif text-sm font-bold text-emerald-600">
                    -{formatCurrency(totals.discount)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#0A192F] border border-[#0A3D78]/10 text-center">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Shipping</span>
                  <span className="font-serif text-sm font-bold text-[#002754] dark:text-white">
                    {totals.shippingFee === 0 ? 'Complimentary' : formatCurrency(totals.shippingFee)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#002754] text-white text-center shadow-md">
                  <span className="text-[10px] uppercase font-bold text-[#C5A880] block">Estimated Total</span>
                  <span className="font-serif text-base font-bold text-white">
                    {formatCurrency(totals.total)}
                  </span>
                </div>
              </div>

              {/* Dispatch Time Notice */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 text-xs text-blue-950 dark:text-blue-200">
                <Truck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Standard Dispatch: <b>within {dispatchTimeDays} days</b> of artisanal curing.</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={closeDrawer}
                  className="w-full sm:w-1/3 rounded-full font-bold border-[#C5A880] text-[#002754] dark:text-[#C5A880] hover:bg-[#C5A880]/10 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Continue Shopping</span>
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    closeDrawer();
                    router.push('/cart');
                  }}
                  className="w-full sm:w-1/3 rounded-full font-bold border-[#002754] text-[#002754] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  View Full Bag
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleCheckout}
                  className="w-full sm:w-1/3 rounded-full font-bold bg-[#002754] hover:bg-[#0A3D78] text-white shadow-xl py-3 flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <span>Checkout</span>
                  <LuxuryArrowRightIcon size={18} className="text-[#C5A880]" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
