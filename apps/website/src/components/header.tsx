'use client';

import * as React from 'react';
import Link from 'next/link';
import { useCartStore, useWishlistStore, useAuthStore } from '@cinmax/hooks';
import { Container, Button } from '@cinmax/ui';

export function Header() {
  const { getItemCount, openDrawer } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const itemCount = getItemCount();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-[#002754]/95 border-b border-[#0A3D78]/10">
      {/* Top Notification Announcement Bar */}
      <div className="bg-[#002754] text-[#E0E8F0] px-4 py-2 text-xs text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
        Complimentary Signature Botanical Sample with all orders over $50 | Code: <strong className="text-white">AZURELUXE</strong>
      </div>

      <Container size="xl">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#002754] dark:text-white"
              aria-label="Toggle Navigation Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex flex-col">
              <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-widest text-[#002754] dark:text-white uppercase">
                CINMAX
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#0A3D78] dark:text-[#C5A880] font-semibold">
                Global Botanical Atelier
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium tracking-wider uppercase text-foreground/80">
            <Link href="/shop" className="hover:text-[#0A3D78] dark:hover:text-white transition-colors">
              Collection
            </Link>
            <Link href="/category/cold-process" className="hover:text-[#0A3D78] dark:hover:text-white transition-colors">
              Cold Process
            </Link>
            <Link href="/category/botanical-balms" className="hover:text-[#0A3D78] dark:hover:text-white transition-colors">
              Botanical Balms
            </Link>
            <Link href="/about" className="hover:text-[#0A3D78] dark:hover:text-white transition-colors">
              Atelier Story
            </Link>
            <Link href="/blog" className="hover:text-[#0A3D78] dark:hover:text-white transition-colors">
              Journal
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            <Link
              href="/search"
              className="p-2 text-foreground/80 hover:text-[#0A3D78] dark:hover:text-white transition-colors"
              aria-label="Search Catalog"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            <Link
              href="/wishlist"
              className="relative p-2 text-foreground/80 hover:text-[#0A3D78] dark:hover:text-white transition-colors"
              aria-label="Wishlist"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#0A3D78] text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link
              href="/login"
              className="p-2 text-foreground/80 hover:text-[#0A3D78] dark:hover:text-white transition-colors"
              aria-label="Patron Account Login"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            <button
              type="button"
              onClick={openDrawer}
              className="relative p-2 text-foreground/80 hover:text-[#0A3D78] dark:hover:text-white transition-colors"
              aria-label="Open Shopping Bag"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#0A3D78] text-white text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            <Link
              href="/profile"
              className="p-2 text-foreground/80 hover:text-[#0A3D78] dark:hover:text-white transition-colors flex items-center gap-2"
              aria-label="Customer Profile"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#0A3D78]/10 space-y-3">
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#0A3D78]/10"
            >
              All Products
            </Link>
            <Link
              href="/category/cold-process"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#0A3D78]/10"
            >
              Cold Process Soaps
            </Link>
            <Link
              href="/category/botanical-balms"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#0A3D78]/10"
            >
              Botanical Balms
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#0A3D78]/10"
            >
              About CINMAX
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#0A3D78]/10"
            >
              Journal & Stories
            </Link>
          </div>
        )}
      </Container>
    </header>
  );
}
