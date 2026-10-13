'use client';

import * as React from 'react';
import { useCartStore, useWishlistStore, useDispatchTimeQuery } from '@cinmax/hooks';
import { Button, PriceTag, QuantitySelector } from '@cinmax/ui';
import { LuxuryWishlistIcon, LuxuryBagIcon } from './luxury-icons';
import { Truck } from 'lucide-react';

export function ProductInteractiveSection({
  product,
  defaultVariant,
}: {
  product: any;
  defaultVariant: any;
}) {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { dispatchTimeDays } = useDispatchTimeQuery();
  const [selectedVariant, setSelectedVariant] = React.useState(defaultVariant);

  const minQty = Math.max(1, product?.minOrderQuantity || 1);
  const [quantity, setQuantity] = React.useState(minQty);
  const [added, setAdded] = React.useState(false);

  // Sync quantity if minQty changes or when product loads
  React.useEffect(() => {
    if (minQty > 1 && quantity < minQty) {
      setQuantity(minQty);
    }
  }, [minQty, quantity]);

  const isFav = isInWishlist ? isInWishlist(product.id) : false;

  const hasQuantityPrice = Boolean(product?.quantityPrice && product.quantityPrice > 0);
  const applicablePrice = hasQuantityPrice
    ? product.quantityPrice
    : (selectedVariant?.price ?? product?.basePrice ?? 18.0);

  const handleAdd = () => {
    const variantToUse = selectedVariant || defaultVariant || {
      id: `var_${product.id}`,
      sku: `SKU-${product.slug || product.id}`,
      title: 'Standard Edition',
      price: applicablePrice,
      weightGrams: 150,
      options: {},
    };
    const effectiveQty = Math.max(minQty, quantity);
    addItem(product, variantToUse, effectiveQty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-6 pt-2">
      {/* Price & Minimum Quantity Tag */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-3">
          <PriceTag
            price={applicablePrice}
            compareAtPrice={selectedVariant?.compareAtPrice}
            currency="INR"
            size="lg"
          />
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200">
            In Stock
          </span>
        </div>

        {minQty > 1 && (
          <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-950 dark:text-amber-200 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-amber-900 dark:text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              Minimum Order Quantity: {minQty} units
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Per-unit price: <b>₹{applicablePrice}.00</b>. Customers must purchase at least <b>{minQty} units</b> to receive this pricing.
            </p>
          </div>
        )}
      </div>

      {/* Minimum Dispatch Time Banner */}
      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
        <Truck className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <span>
          <b>Dispatch Time:</b> Handcrafted &amp; dispatched within <b>{dispatchTimeDays} days</b>
        </span>
      </div>

      {/* Variant Selector if multiple variants exist */}
      {product.variants && product.variants.length > 1 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Select Size / Cure Variant:
          </label>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v: any) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVariant(v)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  selectedVariant?.id === v.id
                    ? 'bg-[#002754] text-white border-[#002754] shadow-md'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 hover:border-[#002754]'
                }`}
              >
                {v.title} — ₹{v.price}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Action Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Qty:</span>
          <QuantitySelector
            quantity={quantity}
            min={minQty}
            max={50}
            onChange={(q) => setQuantity(Math.max(minQty, q))}
          />
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleAdd}
          className={`flex-1 rounded-full text-white font-bold py-3.5 flex items-center justify-center gap-2 shadow-xl cursor-pointer transition-all ${
            added ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-[#002754] hover:bg-[#0A3D78]'
          }`}
        >
          <LuxuryBagIcon size={18} className="text-[#C5A880]" />
          <span>{added ? 'Added to Bag ✓' : `Add to Bag (${Math.max(minQty, quantity)})`}</span>
        </Button>

        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          className="p-3.5 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center cursor-pointer"
          aria-label="Toggle Wishlist"
        >
          <LuxuryWishlistIcon size={20} filled={isFav} />
        </button>
      </div>
    </div>
  );
}
