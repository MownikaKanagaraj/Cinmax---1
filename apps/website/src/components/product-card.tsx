'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@cinmax/types';
import { useCartStore, useWishlistStore } from '@cinmax/hooks';
import { Badge, PriceTag, RatingStars, Button } from '@cinmax/ui';
import { LuxuryWishlistIcon, LuxuryBagIcon } from './luxury-icons';

export interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const [added, setAdded] = React.useState(false);

  const isFavorited = isInWishlist(product.id);
  const defaultVariant = product.variants?.[0] || {
    id: `var_${product.id}`,
    productId: product.id,
    sku: `SKU-${product.slug || product.id}`,
    title: 'Standard Single Bar (150g)',
    price: Number(product.basePrice) || 18.0,
    weightGrams: 150,
    inventoryQuantity: 50,
    isAvailable: true,
    options: { Size: '150g' },
  };
  const primaryImage =
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&auto=format&fit=crop&q=80';

  const minQty = product.minOrderQuantity && product.minOrderQuantity > 1 ? product.minOrderQuantity : 1;
  const effectivePrice = product.quantityPrice && product.quantityPrice > 0 ? product.quantityPrice : (defaultVariant?.price ?? 18.0);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, defaultVariant, minQty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };


  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  return (
    <div className="group relative flex flex-col rounded-[20px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Top Image Frame */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-slate-100 dark:bg-slate-900 block">
        <Image
          src={primaryImage}
          alt={product.title}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {minQty > 1 && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white shadow-sm uppercase tracking-wide">
              Min Qty: {minQty}
            </span>
          )}
          {product.isFeatured && <Badge variant="primary">Signature</Badge>}
          {product.isBestSeller && <Badge variant="gold">Best Seller</Badge>}
          {product.isNew && <Badge variant="secondary">New Batch</Badge>}
        </div>

        {/* Wishlist Button Overlay */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label="Toggle Wishlist"
          className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 dark:bg-[#002754]/90 backdrop-blur-md text-[#002754] dark:text-white hover:bg-white hover:scale-110 transition-all z-10 shadow-md border border-[#C5A880]/30"
        >
          <LuxuryWishlistIcon size={18} filled={isFavorited} />
        </button>
      </Link>

      {/* Product Information */}
      <div className="flex-1 p-5 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-[#0A3D78] dark:text-[#C5A880]">
            {product.processType ? `${product.processType.replace('_', ' ')}` : 'Botanical Soap'}
          </span>
          <h3 className="font-serif text-base font-bold text-[#002754] dark:text-white line-clamp-1 group-hover:text-[#0A3D78] transition-colors">
            <Link href={`/product/${product.slug}`}>{product.title}</Link>
          </h3>
          <div className="flex items-center gap-2">
            <RatingStars rating={product.averageRating || product.ratingAverage || 5} size="sm" />
            <span className="text-xs text-muted-foreground">({product.reviewCount || product.ratingCount || 12})</span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#0A3D78]/10 flex items-center justify-between">
          <div>
            <PriceTag
              price={effectivePrice}
              compareAtPrice={defaultVariant?.compareAtPrice}
              currency="INR"
              size="md"
            />
            {minQty > 1 && (
              <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 mt-0.5">
                Min. {minQty} units (₹{effectivePrice}/unit)
              </p>
            )}
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleQuickAdd}
            className={`rounded-full px-4 flex items-center gap-1.5 transition-all ${
              added ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-[#002754] hover:bg-[#0A3D78]'
            }`}
          >
            <LuxuryBagIcon size={14} className="text-[#C5A880]" />
            <span>{added ? 'Added ✓' : minQty > 1 ? `Add (${minQty})` : 'Add to Bag'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
