'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Header } from '../../../components/header';
import { Footer } from '../../../components/footer';
import { CartDrawer } from '../../../components/cart-drawer';
import {
  Container,
  Breadcrumb,
  PriceTag,
  RatingStars,
  QuantitySelector,
  Button,
  Badge,
} from '@cinmax/ui';
import { useCartStore, useWishlistStore, useProductBySlugQuery } from '@cinmax/hooks';
import type { ProductVariant } from '@cinmax/types';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const { data: product, isLoading } = useProductBySlugQuery(slug, {
    enabled: Boolean(slug),
  });

  const [selectedVariant, setSelectedVariant] = React.useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = React.useState(1);
  const [selectedImage, setSelectedImage] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (product) {
      if (!selectedVariant && product.variants?.length > 0) {
        setSelectedVariant(product.variants[0]);
      }
      if (!selectedImage && product.images?.length > 0) {
        setSelectedImage(product.images[0].url);
      }
    }
  }, [product, selectedVariant, selectedImage]);

  if (isLoading || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
        <Header />
        <main className="flex-1 flex items-center justify-center py-24">
          <p className="text-muted-foreground text-sm">Loading botanical formulation...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const currentVariant = selectedVariant || product.variants?.[0];
  const currentImage =
    selectedImage ||
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1607006314147-759088fd21c2?w=800&auto=format&fit=crop&q=80';

  const handleAddToCart = () => {
    if (currentVariant) {
      addItem(product, currentVariant, quantity);
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
              { label: 'Catalog', href: '/shop' },
              {
                label: product.category?.name || 'Category',
                href: `/category/${product.category?.slug || 'cold-process'}`,
              },
              { label: product.title, isCurrent: true },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="rounded-[28px] overflow-hidden bg-slate-100 dark:bg-[#071324] border border-[#0A3D78]/10 aspect-square">
                <img
                  src={currentImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {product.images && product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img.url)}
                      className={`w-20 h-20 rounded-[14px] overflow-hidden border-2 transition-all flex-shrink-0 ${
                        currentImage === img.url
                          ? 'border-[#0A3D78] dark:border-white shadow-md'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details & Purchase Form */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="primary">{product.processType?.replace(/_/g, ' ') || 'Artisanal'}</Badge>
                  {product.isFeatured && <Badge variant="gold">Signature</Badge>}
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#002754] dark:text-white">
                  {product.title}
                </h1>
                <div className="flex items-center gap-3">
                  <RatingStars rating={product.averageRating || 5} size="md" />
                  <span className="text-sm text-muted-foreground">
                    ({product.reviewCount || 16} Verified Reviews)
                  </span>
                </div>
              </div>

              <div className="py-2">
                <PriceTag
                  price={currentVariant?.price ?? product.basePrice ?? 18.0}
                  compareAtPrice={currentVariant?.compareAtPrice ?? product.compareAtPrice}
                  currency="USD"
                  size="xl"
                />
              </div>

              <p className="text-base text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Variant Selector */}
              {product.variants && product.variants.length > 1 && (
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
                    Choose Size / Edition:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                          currentVariant?.id === v.id
                            ? 'bg-[#002754] text-white border-[#002754] dark:bg-white dark:text-[#002754]'
                            : 'bg-white dark:bg-[#071324] border-[#0A3D78]/20 hover:border-[#0A3D78]'
                        }`}
                      >
                        {v.title} — ${v.price.toFixed(2)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & CTA */}
              <div className="flex items-center gap-4 pt-4 border-t border-[#0A3D78]/10">
                <QuantitySelector
                  quantity={quantity}
                  min={1}
                  max={10}
                  onChange={(qty) => setQuantity(qty)}
                />
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  className="flex-1 rounded-full text-base font-bold shadow-lg"
                >
                  Add to Shopping Bag
                </Button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  aria-label="Save to Wishlist"
                  className="p-3.5 rounded-full border border-[#0A3D78]/20 hover:bg-[#0A3D78]/5 transition-colors"
                >
                  <svg
                    className={`w-6 h-6 ${
                      isFavorited ? 'fill-red-500 text-red-500' : 'text-foreground/70'
                    }`}
                    fill={isFavorited ? 'currentColor' : 'none'}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Botanical Details List */}
              <div className="pt-6 border-t border-[#0A3D78]/10 space-y-3">
                <div className="flex justify-between text-xs py-1 border-b border-[#0A3D78]/5">
                  <span className="text-muted-foreground uppercase tracking-wider font-semibold">Cure Duration</span>
                  <span className="font-medium text-[#002754] dark:text-white">6 Weeks Cold-Process</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-[#0A3D78]/5">
                  <span className="text-muted-foreground uppercase tracking-wider font-semibold">Skin Suitability</span>
                  <span className="font-medium text-[#002754] dark:text-white">Sensitive, Dry & Balanced</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-[#0A3D78]/5">
                  <span className="text-muted-foreground uppercase tracking-wider font-semibold">Primary Notes</span>
                  <span className="font-medium text-[#002754] dark:text-white">Organic Bergamot, Wild Kelp & Clary Sage</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
