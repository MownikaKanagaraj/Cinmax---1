import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { CartDrawer } from '../components/cart-drawer';
import { HeroCarousel } from '../components/hero-carousel';
import { SearchBar } from '../components/search-bar';
import { ProductCard } from '../components/product-card';
import { getContainer } from '@cinmax/api';
import {
  LuxuryPlayIcon,
  LuxuryShieldIcon,
  LuxuryLeafIcon,
  LuxuryArrowRightIcon,
  LuxuryStarIcon,
} from '../components/luxury-icons';
import { Award, CheckCircle2, Flame } from 'lucide-react';

export const revalidate = 300; // Cache on server for 5 mins

export default async function HomePage() {
  let marketingData: any = null;
  let productsList: any[] = [];
  let categoriesList: any[] = [];

  try {
    const container = getContainer();
    marketingData = await container.homeMarketing.getSettings();
    const prodRes = await container.products.getProducts();
    productsList = prodRes?.items || [];
    categoriesList = await container.content.getCategories();
  } catch (err) {
    console.error('Error fetching homepage RSC data:', err);
  }

  const activeBanners = marketingData?.heroBanners || [
    {
      id: 'b1',
      title: 'Kashmiri Saffron & Mysore Sandalwood',
      subtitle: 'Cold-Processed Saponification • 42-Day Slow Cured Artisan Soap',
      badgeText: 'New Cure Release',
      ctaText: 'Discover Formulation',
      ctaLink: '/shop',
      imageUrl: 'https://images.unsplash.com/photo-1607006314147-759088fd21c2?w=1600&auto=format&fit=crop&q=80',
    },
    {
      id: 'b2',
      title: 'French Green Clay & Eucalyptus',
      subtitle: 'Detoxifying Mineral Bar with Pure Organic Botanical Oils',
      badgeText: 'Atelier Signature',
      ctaText: 'Explore Collection',
      ctaLink: '/shop',
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1600&auto=format&fit=crop&q=80',
    },
  ];

  const categoryAvatars = categoriesList.length > 0
    ? categoriesList.map((c) => ({
        title: c.name,
        image: c.imageUrl || 'https://images.unsplash.com/photo-1607006314147-759088fd21c2?w=400&auto=format&fit=crop&q=80',
        slug: c.slug,
      }))
    : [
        { title: 'Cold Process Soaps', image: 'https://images.unsplash.com/photo-1607006314147-759088fd21c2?w=400&auto=format&fit=crop&q=80', slug: 'cold-process' },
        { title: 'Herbal Hair Oil', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&auto=format&fit=crop&q=80', slug: 'botanical-balms' },
        { title: 'Face Care Serums', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&auto=format&fit=crop&q=80', slug: 'cold-process' },
        { title: 'Whipped Body Butters', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80', slug: 'botanical-balms' },
      ];

  const watchShopVideos = [
    {
      id: 'v1',
      title: 'Artisanal Cold-Process Saponification',
      price: '₹249',
      thumb: 'https://images.unsplash.com/photo-1607006314147-759088fd21c2?w=400&auto=format&fit=crop&q=80',
      videoBg: 'https://images.unsplash.com/photo-1607006314147-759088fd21c2?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'v2',
      title: 'Herbal Hair Growth Elixir Ritual',
      price: '₹349',
      thumb: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&auto=format&fit=crop&q=80',
      videoBg: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'v3',
      title: 'Pure Sandalwood Body Butter Glow',
      price: '₹599',
      thumb: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
      videoBg: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] dark:bg-[#071324] text-[#191C1E] dark:text-slate-100 font-sans antialiased selection:bg-[#0A3D78] selection:text-white pb-16 w-full max-w-full">
      <Header />
      <CartDrawer />

      <main className="flex-1 flex flex-col gap-8 md:gap-10 pt-4 md:pt-6 w-full max-w-full">
        {/* Search Bar & Promotion Chips */}
        <section className="px-4 max-w-6xl mx-auto w-full">
          <SearchBar />
        </section>

        {/* Hero Banner Carousel */}
        <section className="px-4 max-w-6xl mx-auto w-full">
          <HeroCarousel banners={activeBanners} />
        </section>

        {/* Shop By Category Avatars */}
        <section className="px-4 max-w-6xl mx-auto w-full space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#002754] dark:text-white">
              Shop By Category
            </h3>
            <Link href="/shop" className="text-xs font-bold text-[#0A3D78] dark:text-blue-400 uppercase tracking-wider hover:underline flex items-center gap-1">
              <span>View All</span>
              <LuxuryArrowRightIcon size={16} className="text-[#0A3D78]" />
            </Link>
          </div>

          <div className="flex gap-6 overflow-x-auto hide-scrollbar py-2">
            {categoryAvatars.map((cat, idx) => (
              <Link
                key={idx}
                href={`/category/${cat.slug}` as any}
                className="flex-none flex flex-col items-center gap-2.5 group"
              >
                <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-800 p-1 shadow-md border-2 border-slate-100 dark:border-slate-800 overflow-hidden group-hover:border-[#0A3D78] group-hover:scale-105 transition-all relative">
                  <Image src={cat.image} alt={cat.title} fill sizes="80px" className="object-cover rounded-full" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap group-hover:text-[#0A3D78] transition-colors">
                  {cat.title}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Dynamic Best Sellers Catalog */}
        <section className="px-4 max-w-6xl mx-auto w-full space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#002754] dark:text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <span>Featured Botanical Formulations</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Handcrafted, cold-processed &amp; dermatologically tested</p>
            </div>
            <Link href="/shop" className="text-xs font-bold text-[#0A3D78] dark:text-blue-400 uppercase tracking-wider hover:underline flex items-center gap-1">
              <span>Explore Catalog</span>
              <LuxuryArrowRightIcon size={16} className="text-[#0A3D78]" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {productsList.length > 0
              ? productsList.slice(0, 8).map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))
              : null}
          </div>
        </section>

        {/* Watch & Shop Reel Stories */}
        <section className="px-4 max-w-6xl mx-auto w-full space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#002754] dark:text-white flex items-center gap-2">
              <LuxuryPlayIcon size={22} className="text-[#0A3D78]" />
              <span>Watch &amp; Shop Masterclass</span>
            </h3>
          </div>

          <div className="flex gap-4 overflow-x-auto hide-scrollbar">
            {watchShopVideos.map((vid) => (
              <div
                key={vid.id}
                className="flex-none w-52 aspect-[9/16] bg-slate-900 rounded-3xl relative overflow-hidden group shadow-lg cursor-pointer border border-slate-800"
              >
                <Image src={vid.videoBg} alt={vid.title} fill sizes="208px" className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LuxuryPlayIcon size={24} className="text-white" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-2.5 flex items-center gap-2 shadow-lg">
                  <div className="w-10 h-10 rounded-xl relative overflow-hidden flex-shrink-0">
                    <Image src={vid.thumb} alt={vid.title} fill sizes="40px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">{vid.title}</p>
                    <p className="text-[10px] text-[#002754] dark:text-blue-400 font-extrabold">{vid.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Transformation & Verified Reviews */}
        <section className="px-4 max-w-6xl mx-auto w-full space-y-4">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#002754] dark:text-white">
            Real Customer Transformations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-4">
              <div className="flex gap-2 w-full sm:w-1/2">
                <div className="flex-1 relative rounded-2xl overflow-hidden aspect-square">
                  <Image src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80" alt="Before" fill sizes="200px" className="object-cover" />
                  <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">Before</span>
                </div>
                <div className="flex-1 relative rounded-2xl overflow-hidden aspect-square">
                  <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80" alt="After" fill sizes="200px" className="object-cover" />
                  <span className="absolute bottom-2 left-2 bg-[#002754] text-white text-[9px] font-bold px-2 py-0.5 rounded-md">After 3 Wks</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <LuxuryStarIcon key={s} size={14} filled={true} />
                  ))}
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 italic">
                  &quot;My scalp oiliness and dandruff cleared completely. Hair feels 2x denser!&quot;
                </p>
                <p className="text-[11px] text-slate-500 font-semibold">— Ananya V., Verified Buyer</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-4">
              <div className="flex gap-2 w-full sm:w-1/2">
                <div className="flex-1 relative rounded-2xl overflow-hidden aspect-square">
                  <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80" alt="Before" fill sizes="200px" className="object-cover" />
                  <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">Before</span>
                </div>
                <div className="flex-1 relative rounded-2xl overflow-hidden aspect-square">
                  <Image src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80" alt="After" fill sizes="200px" className="object-cover" />
                  <span className="absolute bottom-2 left-2 bg-[#002754] text-white text-[9px] font-bold px-2 py-0.5 rounded-md">After 4 Wks</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <LuxuryStarIcon key={s} size={14} filled={true} />
                  ))}
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 italic">
                  &quot;The Sandalwood aroma is divine and my skin texture is smooth like glass.&quot;
                </p>
                <p className="text-[11px] text-slate-500 font-semibold">— Rohan M., Verified Buyer</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose CINMAX Science & Standards */}
        <section className="px-4 max-w-6xl mx-auto w-full py-6">
          <div className="bg-[#002754] text-white rounded-3xl p-8 shadow-xl text-center space-y-6 border border-blue-900/50">
            <div>
              <span className="text-[#C5A880] text-xs font-extrabold uppercase tracking-widest">Purity &amp; Craftsmanship</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold mt-1">Why CINMAX Global Standards?</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#C5A880]">
                  <LuxuryLeafIcon size={24} color="#C5A880" />
                </div>
                <p className="text-xs font-bold">100% Organic Cured</p>
                <p className="text-[10px] text-slate-300">42-Day Slow Cold Saponification</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#C5A880]">
                  <LuxuryShieldIcon size={24} accentColor="#C5A880" />
                </div>
                <p className="text-xs font-bold">Dermatologist Tested</p>
                <p className="text-[10px] text-slate-300">Safe for sensitive &amp; eczema skin</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#C5A880]">
                  <Award className="w-6 h-6 text-[#C5A880]" />
                </div>
                <p className="text-xs font-bold">Ayush Certified</p>
                <p className="text-[10px] text-slate-300">Authentic herbal formulations</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#C5A880]">
                  <CheckCircle2 className="w-6 h-6 text-[#C5A880]" />
                </div>
                <p className="text-xs font-bold">Cruelty Free &amp; Vegan</p>
                <p className="text-[10px] text-slate-300">Zero artificial chemicals or parabens</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
