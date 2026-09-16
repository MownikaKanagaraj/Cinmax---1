'use client';

import * as React from 'react';
import { useCartStore, useWishlistStore } from '@cinmax/hooks';
import { Button, PriceTag, QuantitySelector } from '@cinmax/ui';
import { LuxuryWishlistIcon, LuxuryBagIcon } from './luxury-icons';

export function ProductInteractiveSection({
  product,
  defaultVariant,
}: {
  product: any;
  defaultVariant: any;
}) {
  const { addItem } = useCartStore();
  const { toggleItem, isWishlisted } = useWishlistStore();
  const [selectedVariant, setSelectedVariant] = React.useState(defaultVariant);
  const [quantity, setQuantity] = React.useState(1);
  const [added, setAdded] = React.useState(false);

  const isFav = isWishlisted(product.id);

  const handleAdd = () => {
    const variantToUse = selectedVariant || defaultVariant || {
      id: `var_${product.id}`,
      sku: `SKU-${product.slug || product.id}`,
      title: 'Standard Edition',
      price: product.basePrice || 18.0,
      weightGrams: 150,
      options: {},
    };
    addItem(product, variantToUse, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };


  return (
    <div className="space-y-6 pt-2">
      {/* Price Tag */}
      <div className="flex items-baseline gap-3">
        <PriceTag
          price={selectedVariant.price}
          compareAtPrice={selectedVariant.compareAtPrice}
          currency="INR"
          size="lg"
        />
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200">
          In Stock • Ready for Cure Dispatch
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
                  selectedVariant.id === v.id
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
            min={1}
            max={10}
            onChange={(q) => setQuantity(q)}
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
          <span>{added ? 'Added to Bag ✓' : 'Add to Bag'}</span>
        </Button>

        <button
          type="button"
          onClick={() => toggleItem(product.id)}
          className="p-3.5 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center cursor-pointer"
          aria-label="Toggle Wishlist"
        >
          <LuxuryWishlistIcon size={20} filled={isFav} />
        </button>
      </div>
    </div>
  );
}
