'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCartStore, useWishlistStore, useUser, useLogout, useHomeMarketingQuery } from '@cinmax/hooks';
import { Container, Button } from '@cinmax/ui';
import { Video, Tag, LogOut, User, CheckCircle2, Package, MapPin, Ticket, ShieldCheck, ChevronDown } from 'lucide-react';
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
  const router = useRouter();
  const { getItemCount, openDrawer } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, isAuthenticated } = useUser();
  const logoutMutation = useLogout();
  const { data: marketingData } = useHomeMarketingQuery();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
  const [activeOfferIndex, setActiveOfferIndex] = React.useState(0);

  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const itemCount = getItemCount();

  const isRouteActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCheckoutLogout = async () => {
    try {
      setUserDropdownOpen(false);
      setMobileMenuOpen(false);
      await logoutMutation.mutateAsync();
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
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

            {/* Profile & Check-In / Check-Out Dropdown */}
            <div className="relative" ref={dropdownRef}>
              {isAuthenticated ? (
                /* Checked-In User Badge & Dropdown Trigger */
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#002754]/8 dark:bg-white/10 hover:bg-[#002754]/15 dark:hover:bg-white/20 transition-all border border-[#002754]/20 dark:border-white/20 text-[#002754] dark:text-white font-bold text-xs cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="max-w-[90px] truncate hidden sm:inline-block">
                    {user?.firstName || 'Checked-In'}
                  </span>
                  <LuxuryUserIcon size={20} active />
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>
              ) : (
                /* Unauthenticated Sign In Button */
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-full bg-[#002754] hover:bg-[#001d3f] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-sm flex items-center gap-1.5"
                >
                  <LuxuryUserIcon size={18} active={false} />
                  <span>Check-In</span>
                </Link>
              )}

              {/* Checked-In Profile Dropdown Menu */}
              {isAuthenticated && userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#071324] border border-[#0A3D78]/20 shadow-2xl p-3 z-50 space-y-2 animate-in fade-in zoom-in-95 duration-150">
                  {/* User Status Card */}
                  <div className="p-3 rounded-xl bg-[#002754]/5 dark:bg-white/5 border border-[#002754]/10 dark:border-white/10 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#002754] dark:text-[#C5A880]">
                        CHECKED-IN PATRON
                      </span>
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-[9px] flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" /> ACTIVE
                      </span>
                    </div>
                    <p className="font-serif font-bold text-sm text-[#002754] dark:text-white truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>

                  {/* Dropdown Links */}
                  <div className="space-y-1 pt-1 text-xs font-semibold">
                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-[#002754]/8 dark:hover:bg-white/10 transition-all"
                    >
                      <User className="w-4 h-4 text-[#002754] dark:text-[#C5A880]" />
                      <span>Profile &amp; Rewards ({user?.loyaltyPoints || 0} Pts)</span>
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-[#002754]/8 dark:hover:bg-white/10 transition-all"
                    >
                      <Package className="w-4 h-4 text-[#002754] dark:text-[#C5A880]" />
                      <span>Orders &amp; Dispatches</span>
                    </Link>
                    <Link
                      href="/profile/addresses"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-[#002754]/8 dark:hover:bg-white/10 transition-all"
                    >
                      <MapPin className="w-4 h-4 text-[#002754] dark:text-[#C5A880]" />
                      <span>Saved Addresses</span>
                    </Link>
                    <Link
                      href="/profile/coupons"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-[#002754]/8 dark:hover:bg-white/10 transition-all"
                    >
                      <Ticket className="w-4 h-4 text-[#002754] dark:text-[#C5A880]" />
                      <span>Privilege Coupons</span>
                    </Link>
                  </div>

                  {/* Check-Out / Sign Out Button */}
                  <div className="pt-2 border-t border-[#0A3D78]/10">
                    <button
                      type="button"
                      onClick={handleCheckoutLogout}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs transition-all cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Check-Out (Sign Out)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

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
            {/* Checked-In Mobile Banner / Sign In CTA */}
            {isAuthenticated ? (
              <div className="p-3 rounded-2xl bg-[#002754] text-white space-y-2 mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C5A880]">
                    CHECKED-IN PATRON
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white font-extrabold text-[9px]">
                    ACTIVE
                  </span>
                </div>
                <p className="font-serif font-bold text-sm">
                  {user?.firstName} {user?.lastName}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-white/20 text-xs">
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="underline text-[#C5A880] font-bold">
                    My Account ({user?.loyaltyPoints || 0} Pts)
                  </Link>
                  <button
                    type="button"
                    onClick={handleCheckoutLogout}
                    className="flex items-center gap-1 text-red-300 font-bold hover:underline"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Check-Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-[#002754]/10 dark:bg-white/10 space-y-2 mb-2">
                <p className="text-xs font-bold text-[#002754] dark:text-white">
                  Welcome to CINMAX Global Atelier
                </p>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2 rounded-xl bg-[#002754] text-white font-bold text-xs uppercase"
                >
                  Check-In / Sign In →
                </Link>
              </div>
            )}

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
