'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LuxurySparklesIcon, LuxuryArrowRightIcon } from './luxury-icons';

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl: string;
}

export function HeroCarousel({ banners }: { banners: BannerItem[] }) {
  const [activeSlideIndex, setActiveSlideIndex] = React.useState(0);

  const activeBanners = banners.length > 0 ? banners : [
    {
      id: 'b1',
      title: 'Kashmiri Saffron & Mysore Sandalwood',
      subtitle: 'Cold-Processed Saponification • 42-Day Slow Cured Artisan Soap',
      badgeText: 'New Cure Release',
      ctaText: 'Discover Formulation',
      ctaLink: '/shop',
      imageUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=1600&auto=format&fit=crop&q=80',
    },
  ];

  React.useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const currentBanner = activeBanners[activeSlideIndex % activeBanners.length];

  return (
    <div className="relative rounded-3xl overflow-hidden aspect-[4/5] sm:aspect-[16/7] shadow-2xl bg-[#002754] group">
      <Image
        key={currentBanner.id || activeSlideIndex}
        src={currentBanner.imageUrl}
        alt={currentBanner.title}
        fill
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1152px"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#002754] via-[#002754]/40 to-transparent" />

      <div className="absolute bottom-0 left-0 p-6 sm:p-12 w-full text-center sm:text-left flex flex-col items-center sm:items-start z-10">
        {currentBanner.badgeText && (
          <span className="inline-flex items-center gap-1.5 bg-[#C5A880] text-[#002754] text-xs font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-3 shadow-md">
            <LuxurySparklesIcon size={16} color="#002754" />
            {currentBanner.badgeText}
          </span>
        )}
        <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 max-w-2xl leading-tight">
          {currentBanner.title}
        </h2>
        <p className="text-sm sm:text-base text-slate-200 mb-6 max-w-lg font-medium leading-relaxed">
          {currentBanner.subtitle}
        </p>
        <Link
          href={(currentBanner.ctaLink || '/shop') as any}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0A3D78] to-[#1E5AAD] text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50 transition-all border border-white/20 hover:scale-105 cursor-pointer"
        >
          <span>{currentBanner.ctaText || 'Shop Collection'}</span>
          <LuxuryArrowRightIcon size={18} className="text-[#C5A880]" />
        </Link>

        {activeBanners.length > 1 && (
          <div className="flex justify-center sm:justify-start gap-2 mt-6">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlideIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activeSlideIndex === idx ? 'w-8 bg-[#C5A880]' : 'w-2 bg-white/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
