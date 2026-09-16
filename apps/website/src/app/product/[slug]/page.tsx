import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Header } from '../../../components/header';
import { Footer } from '../../../components/footer';
import { CartDrawer } from '../../../components/cart-drawer';
import { ProductCard } from '../../../components/product-card';
import { ProductInteractiveSection } from '../../../components/product-interactive-section';
import { getContainer } from '@cinmax/api';
import {
  LuxuryStarIcon,
  LuxuryShieldIcon,
  LuxuryLeafIcon,
  LuxuryTruckIcon,
} from '../../../components/luxury-icons';
import { Award, CheckCircle2 } from 'lucide-react';

export const revalidate = 120; // 2 min cache

export default async function ProductDetailsPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  let product: any = null;
  let relatedProducts: any[] = [];

  try {
    const container = getContainer();
    const rawProd = await container.products.getProductBySlug(slug);
    if (rawProd) {
      product = JSON.parse(JSON.stringify(rawProd));
      const prodRes = await container.products.getProducts();
      relatedProducts = JSON.parse(JSON.stringify((prodRes?.items || []).filter((p: any) => p.id !== product.id).slice(0, 4)));
    }
  } catch (err) {
    console.error('Error fetching Product details RSC data:', err);
  }

  if (!product) {
    notFound();
  }

  const defaultVariant = product.variants?.[0] || {
    id: `v_${product.id}`,
    title: 'Standard Bar',
    price: product.basePrice || 249,
    compareAtPrice: Math.round((product.basePrice || 249) * 1.3),
  };

  const primaryImage = typeof product.images?.[0] === 'string'
    ? product.images[0]
    : product.images?.[0]?.url || 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] dark:bg-[#071324] text-[#191C1E] dark:text-slate-100">
      <Header />
      <CartDrawer />

      <main className="flex-1 py-8 px-4 max-w-6xl mx-auto w-full space-y-12">
        {/* Product Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          {/* Left Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-inner">
              <Image
                src={primaryImage}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover"
              />
              {product.isFeatured && (
                <span className="absolute top-4 left-4 bg-[#002754] text-[#C5A880] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  Best Seller
                </span>
              )}
            </div>
          </div>

          {/* Right Product Summary & Actions */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest font-extrabold text-[#0A3D78] dark:text-[#C5A880]">
                {product.processType ? product.processType.replace('_', ' ') : 'Artisanal Soap'}
              </span>

              <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#002754] dark:text-white leading-tight">
                {product.title}
              </h1>

              <div className="flex items-center gap-2 text-amber-500 text-xs font-bold">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <LuxuryStarIcon key={s} size={14} filled={true} />
                  ))}
                </div>
                <span>4.9</span>
                <span className="text-slate-400 font-normal">(128 verified customer reviews)</span>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.description || product.subtitle || 'Formulated with organic cold-pressed oils, pure botanical extracts, and cured for 42 days under optimal saponification parameters.'}
              </p>
            </div>

            {/* Interactive Add to Bag / Variant Controls Component */}
            <ProductInteractiveSection product={product} defaultVariant={defaultVariant} />

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <LuxuryLeafIcon size={18} className="text-emerald-600" />
                <span>100% Cold-Processed Organic</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <LuxuryShieldIcon size={18} accentColor="#C5A880" />
                <span>Dermatologically Tested</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Ayush Certified Formulation</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Cruelty Free &amp; Paraben Free</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#002754] dark:text-white">
              Complementary Atelier Formulations
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
