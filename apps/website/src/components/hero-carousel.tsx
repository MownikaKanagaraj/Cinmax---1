'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LuxurySparklesIcon, LuxuryArrowRightIcon } from './luxury-icons';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl: string;
}

export const CINMAX_CORE_SOAPS: BannerItem[] = [
  {
    id: 'soap-aroma',
    title: 'Aroma Soap',
    subtitle: '100% Pure Coconut Oil • Gentle Cleansing & Refreshing Bathing Bar for Soft, Smooth & Fresh-Looking Skin.',
    badgeText: '100% Pure Coconut Oil',
    ctaText: 'Shop Aroma Soap • ₹249',
    ctaLink: '/product/aroma-soap',
    imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/aroma-soap/1.jpg',
  },
  {
    id: 'soap-aloe-vera',
    title: 'Aloe Vera Soap',
    subtitle: 'Naturally Infused Aloe Barbadensis & Coconut Oil • Deeply Hydrating & Soothing for Everyday Freshness.',
    badgeText: 'Enriched With Aloe Vera',
    ctaText: 'Shop Aloe Vera • ₹249',
    ctaLink: '/product/aloe-vera-soap',
    imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/aloe-vera-soap/1.jpg',
  },
  {
    id: 'soap-avarampoo',
    title: 'Avarampoo Soap',
    subtitle: 'Cassia Auriculata (Tanner’s Cassia) Golden Blossom Oil • Sun Tan Defense & Radiant Youthful Skin.',
    badgeText: 'Golden Flower Radiance',
    ctaText: 'Shop Avarampoo • ₹289',
    ctaLink: '/product/avarampoo-soap',
    imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/avarampoo-soap/1.jpg',
  },
  {
    id: 'soap-charcoal',
    title: 'Activated Charcoal Soap',
    subtitle: 'Bamboo Charcoal Powder & Tea Tree Blend • Deep Pore Purifying & Environmental Pollution Shield.',
    badgeText: 'Deep Pore Detox',
    ctaText: 'Shop Charcoal • ₹279',
    ctaLink: '/product/charcoal-soap',
    imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/charcoal-soap/1.jpg',
  },
  {
    id: 'soap-kasturi-manjal',
    title: 'Kasturi Manjal Soap',
    subtitle: 'Curcuma Aromatica Wild Turmeric Root Oil • Natural Glow, Tan Removal & Blemish Defense.',
    badgeText: 'Wild Turmeric Infusion',
    ctaText: 'Shop Kasturi Manjal • ₹299',
    ctaLink: '/product/kasturi-manjal-soap',
    imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/kasturi-manjal-soap/1.jpg',
  },
  {
    id: 'soap-manjistha',
    title: 'Manjistha Soap',
    subtitle: 'Rubia Cordifolia (Manjistha) Root Oil & Glycerin • Traditional Complexion Enhancer & Even Tone.',
    badgeText: 'Ayurvedic Manjistha',
    ctaText: 'Shop Manjistha • ₹299',
    ctaLink: '/product/manjistha-soap',
    imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/manjistha-soap/1.jpg',
  },
  {
    id: 'soap-neem-oil',
    title: 'Neem Oil Soap',
    subtitle: 'Azadirachta Seed (Neem) Oil & Virgin Coconut Oil • Clarifying & Antibacterial Botanical Protection.',
    badgeText: 'Pure Neem Seed Therapy',
    ctaText: 'Shop Neem Oil • ₹249',
    ctaLink: '/product/neem-oil-soap',
    imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/neem-oil-soap/1.jpg',
  },
  {
    id: 'soap-papaya',
    title: 'Papaya Glow Soap',
    subtitle: 'Natural Skin Brightening & Gentle Exfoliation with Pure Papain Extract and Cold-Pressed Coconut Oil.',
    badgeText: 'Enzymatic Glow',
    ctaText: 'Shop Papaya Soap • ₹279',
    ctaLink: '/product/papaya-soap',
    imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/papaya-soap/1.jpg',
  },
  {
    id: 'soap-rose',
    title: 'Rose Soap',
    subtitle: 'Steam-Distilled Pure Damask Rose Infusion & Nourishing Butter • Soft, Silky & Delicately Scented Skin.',
    badgeText: 'Damask Rose Essence',
    ctaText: 'Shop Rose Soap • ₹299',
    ctaLink: '/product/rose-soap',
    imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/rose-soap/1.jpg',
  },
  {
    id: 'soap-veppalai',
    title: 'Veppalai Ayurvedic Soap',
    subtitle: 'Wrightia Tinctoria Leaf Extract • Traditional Therapeutic Scalp & Sensitive Skin Care.',
    badgeText: 'Therapeutic Veppalai',
    ctaText: 'Shop Veppalai • ₹299',
    ctaLink: '/product/veppalai-soap',
    imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/veppalai-soap/1.jpg',
  },
  {
    id: 'soap-vettiver',
    title: 'Vettiver Root Clarifying Soap',
    subtitle: 'Authentic Vetiver Root Infusion • Long-Lasting Body Cooling, Aromatherapy & All-Day Freshness.',
    badgeText: 'Cooling Vetiver Root',
    ctaText: 'Shop Vettiver • ₹289',
    ctaLink: '/product/vettiver-soap',
    imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/vettiver-soap/1.jpg',
  },
];

export function HeroCarousel({ banners }: { banners?: BannerItem[] }) {
  const activeBanners = (banners && banners.length > 0) ? banners : CINMAX_CORE_SOAPS;
  const [activeSlideIndex, setActiveSlideIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const touchStartX = React.useRef<number | null>(null);

  // Auto-play timer (4.5s)
  React.useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % activeBanners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activeBanners.length, isPaused]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveSlideIndex((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveSlideIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="relative rounded-3xl overflow-hidden aspect-[4/5] sm:aspect-[16/7] shadow-2xl bg-[#002754] group select-none border border-[#C5A880]/30"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Slides with Crossfade Animation */}
      {activeBanners.map((banner, idx) => {
        const isActive = activeSlideIndex === idx;
        return (
          <div
            key={banner.id || idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              fill
              priority={idx === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1152px"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Ambient Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#001834] via-[#002754]/50 to-black/20" />

            {/* Slide Content */}
            <div className="absolute bottom-0 left-0 p-6 sm:p-12 w-full text-center sm:text-left flex flex-col items-center sm:items-start z-20">
              {banner.badgeText && (
                <span className="inline-flex items-center gap-1.5 bg-[#C5A880] text-[#002754] text-xs font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-3 shadow-md">
                  <LuxurySparklesIcon size={16} color="#002754" />
                  {banner.badgeText}
                </span>
              )}
              <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2 max-w-2xl leading-tight drop-shadow-md">
                {banner.title}
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-slate-200 mb-6 max-w-lg font-medium leading-relaxed drop-shadow">
                {banner.subtitle}
              </p>
              <Link
                href={(banner.ctaLink || '/shop') as any}
                className="inline-flex items-center gap-2 bg-[#C5A880] hover:bg-[#D4AF37] text-[#002754] font-extrabold text-sm px-8 py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 cursor-pointer"
              >
                <span>{banner.ctaText || 'Shop Collection'}</span>
                <LuxuryArrowRightIcon size={18} className="text-[#002754]" />
              </Link>
            </div>
          </div>
        );
      })}

      {/* Prev / Next Arrows */}
      {activeBanners.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#002754]/75 backdrop-blur-md text-[#C5A880] hover:text-white hover:bg-[#002754] flex items-center justify-center border border-white/20 transition-all z-30 cursor-pointer shadow-lg hover:scale-110 opacity-80 hover:opacity-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#002754]/75 backdrop-blur-md text-[#C5A880] hover:text-white hover:bg-[#002754] flex items-center justify-center border border-white/20 transition-all z-30 cursor-pointer shadow-lg hover:scale-110 opacity-80 hover:opacity-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Indicator Dots */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30">
          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveSlideIndex(idx);
              }}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeSlideIndex === idx ? 'w-8 bg-[#C5A880]' : 'w-2.5 bg-white/45 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
