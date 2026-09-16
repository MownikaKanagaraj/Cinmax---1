'use client';

import * as React from 'react';
import Link from 'next/link';
import { Header } from '../../../components/header';
import { Footer } from '../../../components/footer';
import { CartDrawer } from '../../../components/cart-drawer';
import { Container, PageHeader, Breadcrumb, Badge, Button } from '@cinmax/ui';
import { useCouponsQuery } from '@cinmax/hooks';
import type { Coupon } from '@cinmax/types';
import { Ticket, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@cinmax/utils';

export default function CouponsPage() {
  const { data: coupons = [], isLoading } = useCouponsQuery();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
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
              { label: 'Profile', href: '/profile' },
              { label: 'Coupons & Passes', isCurrent: true },
            ]}
          />

          <PageHeader
            badge="Privilege Passes & Vouchers"
            title="Active CINMAX Coupons"
            subtitle="Apply these exclusive patron privileges at checkout for tailored reductions on your orders."
          />

          {isLoading ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              Loading active privilege passes...
            </div>
          ) : coupons.length === 0 ? (
            <div className="p-8 text-center rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-4">
              <Ticket className="w-10 h-10 text-[#C5A880] mx-auto" />
              <h3 className="font-serif text-lg font-bold">No Active Vouchers Available</h3>
              <p className="text-xs text-muted-foreground">Check back soon for seasonal botanical promotions.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6">
              {coupons.map((coupon: Coupon) => {
                const isCopied = copiedCode === coupon.code;

                return (
                  <div
                    key={coupon.id}
                    className="p-6 rounded-[26px] bg-white dark:bg-[#071324] border border-[#0A3D78]/15 shadow-sm hover:shadow-md transition-all space-y-4 relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-lg font-extrabold text-[#002754] dark:text-[#C5A880] tracking-wider flex items-center gap-1.5">
                          <Ticket className="w-4 h-4 text-[#C5A880]" />
                          {coupon.code}
                        </span>
                        <Badge variant="gold" className="font-extrabold text-xs">
                          {coupon.discountType === 'percentage'
                            ? `${coupon.discountValue}% OFF`
                            : `${formatCurrency(coupon.discountValue)} OFF`}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {coupon.description || 'Valid on all artisanal cold-process soaps and skincare formulations.'}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#0A3D78]/10 space-y-3">
                      <div className="text-[11px] text-muted-foreground flex justify-between items-center font-medium">
                        <span>Min order: {formatCurrency(coupon.minOrderAmount || 400)}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Active
                        </span>
                      </div>

                      <Button
                        variant={isCopied ? 'secondary' : 'primary'}
                        size="sm"
                        onClick={() => handleCopy(coupon.code)}
                        className={`w-full rounded-full font-bold text-xs py-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#002754] hover:bg-[#0A3D78] text-white'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Code Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#C5A880]" /> Copy Code
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}

