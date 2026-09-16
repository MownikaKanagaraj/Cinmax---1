import * as React from 'react';
import Link from 'next/link';
import { Container } from '@cinmax/ui';

export function Footer() {
  return (
    <footer className="bg-[#002754] text-[#E0E8F0] pt-16 pb-12 border-t border-white/10">
      <Container size="xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex flex-col">
              <span className="font-serif text-3xl font-bold tracking-widest text-white uppercase">
                CINMAX
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
                Global Botanical Products
              </span>
            </Link>
            <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
              Curating small-batch cold-process soaps, infused organic oils, and therapeutic balms crafted in harmony with timeless artisan tradition.
            </p>
            <div className="flex items-center space-x-3 text-xs text-[#C5A880] font-medium">
              <span>Cruelty-Free</span> • <span>Zero Synthetics</span> • <span>Sustainably Sourced</span>
            </div>
          </div>

          {/* Catalog Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-white">
              Collections
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/category/cold-process" className="hover:text-white transition-colors">
                  Cold Process Soaps
                </Link>
              </li>
              <li>
                <Link href="/category/botanical-balms" className="hover:text-white transition-colors">
                  Botanical Balms
                </Link>
              </li>
              <li>
                <Link href="/category/exfoliating-bars" className="hover:text-white transition-colors">
                  Exfoliating Bars
                </Link>
              </li>
              <li>
                <Link href="/category/gift-sets" className="hover:text-white transition-colors">
                  Curated Gift Sets
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Journal */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-white">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Our Philosophy
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Botanical Journal
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Customer Support
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-white">
              Legal &amp; Policies
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/terms" className="hover:text-[#C5A880] transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-[#C5A880] transition-colors">
                  Return &amp; Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-[#C5A880] transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#C5A880] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} CINMAX Global Products Inc. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Formulated with Integrity</span>
            <span>•</span>
            <span>Global Distribution Ready</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
