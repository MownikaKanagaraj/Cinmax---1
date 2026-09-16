'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore, useWishlistStore, useUser, useHomeMarketingQuery } from '@cinmax/hooks';
import { Container, Button } from '@cinmax/ui';
import { Video, Tag } from 'lucide-react';
import {
  LuxurySearchIcon,
  LuxuryWishlistIcon,
  LuxuryUserIcon,
  LuxuryBagIcon,
  LuxuryMenuIcon,
  LuxuryCloseIcon,
  LuxuryArrowRightIcon,
} from './luxury-icons';

export function Header() {
  const pathname = usePathname();
  const { getItemCount, openDrawer } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, isAuthenticated } = useUser();
  const { data: marketingData } = useHomeMarketingQuery();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [activeOfferIndex, setActiveOfferIndex] = React.useState(0);

  const itemCount = getItemCount();

  const isRouteActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  // Extract and normalize active top offers
  const activeOffers = React.useMemo(() => {
    const rawOffers = marketingData?.topOffers || [
      { id: 'def_1', text: 'Free Shipping above ₹499', linkUrl: '/shop', offerType: 'free_shipping', isActive: true },
    ];

    return rawOffers
      .map((item, idx) => {
        if (typeof item === 'string') {
          return {
            id: `str_${idx}`,
            text: item,
            linkUrl: '/shop',
            code: '',
            isActive: true,
          };
        }
        return item;
      })
      .filter((item) => item.isActive !== false && item.text && item.text.trim() !== '');
  }, [marketingData?.topOffers]);

  // Auto-rotate offers every 4 seconds if multiple active offers exist
  React.useEffect(() => {
    if (activeOffers.length <= 1) return;
    const timer = setInterval(() => {
      setActiveOfferIndex((prev) => (prev + 1) % activeOffers.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeOffers.length]);

  const currentOffer = activeOffers[activeOfferIndex % activeOffers.length] || {
    text: 'Free Shipping above ₹499',
    linkUrl: '/shop',
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-[#002754]/95 border-b border-[#0A3D78]/10 shadow-sm">
      {/* Top Notification Announcement Bar */}
      <div className="bg-[#002754] text-[#E0E8F0] px-4 py-2 text-xs text-center font-medium tracking-wide flex items-center justify-center gap-2 shadow-inner">
        <span className="inline-block w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
        {currentOffer.linkUrl ? (
          <Link
            href={currentOffer.linkUrl as any}
            className="hover:underline flex items-center gap-1.5 transition text-slate-100 hover:text-white"
          >
            <span>{currentOffer.text}</span>
            {currentOffer.code && (
              <span className="px-1.5 py-0.5 rounded bg-[#C5A880]/20 text-[#C5A880] font-mono font-bold text-[10px] uppercase border border-[#C5A880]/30">
                CODE: {currentOffer.code}
              </span>
            )}
            <LuxuryArrowRightIcon size={14} className="text-[#C5A880]" />
          </Link>
        ) : (
          <span className="flex items-center gap-1.5">
            <span>{currentOffer.text}</span>
            {currentOffer.code && (
              <span className="px-1.5 py-0.5 rounded bg-[#C5A880]/20 text-[#C5A880] font-mono font-bold text-[10px] uppercase border border-[#C5A880]/30">
                CODE: {currentOffer.code}
              </span>
            )}
          </span>
        )}
      </div>

      <Container size="xl">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#002754] dark:text-white hover:opacity-80 transition-opacity"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <LuxuryCloseIcon size={24} /> : <LuxuryMenuIcon size={24} />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex flex-col">
              <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-widest text-[#002754] dark:text-white uppercase">
                CINMAX
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#0A3D78] dark:text-[#C5A880] font-semibold">
                Global Botanical Products
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm tracking-wider uppercase text-foreground/80">
            <Link
              href="/shop"
              className={`transition-all duration-200 hover:font-bold hover:text-[#002754] dark:hover:text-white ${
                isRouteActive('/shop') ? 'font-bold text-[#002754] dark:text-[#C5A880]' : 'font-medium text-slate-600 dark:text-slate-300'
              }`}
            >
              Collection
            </Link>
            <Link
              href="/classes"
              className={`flex items-center gap-1.5 transition-all duration-200 hover:font-bold hover:text-[#002754] dark:hover:text-[#C5A880] ${
                isRouteActive('/classes') ? 'font-bold text-[#002754] dark:text-[#C5A880]' : 'font-medium text-slate-600 dark:text-slate-300'
              }`}
            >
              <Video className="w-4 h-4 text-[#C5A880]" />
              Classes
            </Link>
            <Link
              href="/category/cold-process"
              className={`transition-all duration-200 hover:font-bold hover:text-[#002754] dark:hover:text-white ${
                isRouteActive('/category/cold-process') ? 'font-bold text-[#002754] dark:text-[#C5A880]' : 'font-medium text-slate-600 dark:text-slate-300'
              }`}
            >
              Cold Process
            </Link>
            <Link
              href="/category/botanical-balms"
              className={`transition-all duration-200 hover:font-bold hover:text-[#002754] dark:hover:text-white ${
                isRouteActive('/category/botanical-balms') ? 'font-bold text-[#002754] dark:text-[#C5A880]' : 'font-medium text-slate-600 dark:text-slate-300'
              }`}
            >
              Botanical Balms
            </Link>
            <Link
              href="/about"
              className={`transition-all duration-200 hover:font-bold hover:text-[#002754] dark:hover:text-white ${
                isRouteActive('/about') ? 'font-bold text-[#002754] dark:text-[#C5A880]' : 'font-medium text-slate-600 dark:text-slate-300'
              }`}
            >
              Our Story
            </Link>
            <Link
              href="/blog"
              className={`transition-all duration-200 hover:font-bold hover:text-[#002754] dark:hover:text-white ${
                isRouteActive('/blog') ? 'font-bold text-[#002754] dark:text-[#C5A880]' : 'font-medium text-slate-600 dark:text-slate-300'
              }`}
            >
              Journal
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Search */}
            <Link
              href="/search"
              className={`group relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ease-out hover:bg-[#002754]/8 dark:hover:bg-white/12 active:scale-95 hover:scale-105 ${
                isRouteActive('/search')
                  ? 'bg-[#002754]/10 dark:bg-white/15 text-[#002754] dark:text-white'
                  : 'text-[#002754]/80 dark:text-white/80 hover:text-[#002754] dark:hover:text-white'
              }`}
              aria-label="Search Catalog"
            >
              <LuxurySearchIcon size={25} active={isRouteActive('/search')} />
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className={`group relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ease-out hover:bg-[#002754]/8 dark:hover:bg-white/12 active:scale-95 hover:scale-105 ${
                isRouteActive('/wishlist')
                  ? 'bg-[#002754]/10 dark:bg-white/15 text-[#002754] dark:text-white'
                  : 'text-[#002754]/80 dark:text-white/80 hover:text-[#002754] dark:hover:text-white'
              }`}
              aria-label="Wishlist"
            >
              <LuxuryWishlistIcon
                size={25}
                filled={wishlistItems.length > 0}
                active={isRouteActive('/wishlist')}
              />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#002754] dark:bg-[#C5A880] text-white dark:text-[#002754] border-2 border-white dark:border-[#002754] text-[10px] font-bold flex items-center justify-center shadow-sm pointer-events-none transition-transform duration-200 group-hover:scale-110">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Profile */}
            <Link
              href={isAuthenticated ? '/profile' : '/login'}
              className={`group relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ease-out hover:bg-[#002754]/8 dark:hover:bg-white/12 active:scale-95 hover:scale-105 ${
                isRouteActive('/profile') || isRouteActive('/login')
                  ? 'bg-[#002754]/10 dark:bg-white/15 text-[#002754] dark:text-white'
                  : 'text-[#002754]/80 dark:text-white/80 hover:text-[#002754] dark:hover:text-white'
              }`}
              aria-label={isAuthenticated ? 'Customer Profile' : 'Account Login'}
            >
              <LuxuryUserIcon
                size={25}
                active={isRouteActive('/profile') || isRouteActive('/login') || isAuthenticated}
              />
            </Link>

            {/* Shopping Bag */}
            <button
              type="button"
              onClick={openDrawer}
              className={`group relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ease-out hover:bg-[#002754]/8 dark:hover:bg-white/12 active:scale-95 hover:scale-105 cursor-pointer ${
                itemCount > 0
                  ? 'text-[#002754] dark:text-white'
                  : 'text-[#002754]/80 dark:text-white/80 hover:text-[#002754] dark:hover:text-white'
              }`}
              aria-label="Open Shopping Bag"
            >
              <LuxuryBagIcon size={25} active={itemCount > 0} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#002754] dark:bg-[#C5A880] text-white dark:text-[#002754] border-2 border-white dark:border-[#002754] text-[10px] font-bold flex items-center justify-center shadow-sm pointer-events-none transition-transform duration-200 group-hover:scale-110">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#0A3D78]/10 space-y-3">
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm transition-all hover:font-bold hover:bg-[#0A3D78]/10 ${
                isRouteActive('/shop') ? 'font-bold text-[#002754] bg-[#0A3D78]/10' : 'font-medium text-slate-700 dark:text-slate-200'
              }`}
            >
              Collection
            </Link>
            <Link
              href="/classes"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:font-bold hover:bg-[#0A3D78]/10 ${
                isRouteActive('/classes') ? 'font-bold text-[#002754] bg-[#0A3D78]/10' : 'font-medium text-slate-700 dark:text-slate-200'
              }`}
            >
              <Video className="w-4 h-4" />
              Classes
            </Link>
            <Link
              href="/category/cold-process"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm transition-all hover:font-bold hover:bg-[#0A3D78]/10 ${
                isRouteActive('/category/cold-process') ? 'font-bold text-[#002754] bg-[#0A3D78]/10' : 'font-medium text-slate-700 dark:text-slate-200'
              }`}
            >
              Cold Process
            </Link>
            <Link
              href="/category/botanical-balms"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm transition-all hover:font-bold hover:bg-[#0A3D78]/10 ${
                isRouteActive('/category/botanical-balms') ? 'font-bold text-[#002754] bg-[#0A3D78]/10' : 'font-medium text-slate-700 dark:text-slate-200'
              }`}
            >
              Botanical Balms
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm transition-all hover:font-bold hover:bg-[#0A3D78]/10 ${
                isRouteActive('/about') ? 'font-bold text-[#002754] bg-[#0A3D78]/10' : 'font-medium text-slate-700 dark:text-slate-200'
              }`}
            >
              Our Story
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm transition-all hover:font-bold hover:bg-[#0A3D78]/10 ${
                isRouteActive('/blog') ? 'font-bold text-[#002754] bg-[#0A3D78]/10' : 'font-medium text-slate-700 dark:text-slate-200'
              }`}
            >
              Journal
            </Link>
          </div>
        )}
      </Container>
    </header>
  );
}
