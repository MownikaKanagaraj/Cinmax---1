'use client';

import * as React from 'react';
import { Header } from '../../../components/header';
import { Footer } from '../../../components/footer';
import { Container, PageHeader, Breadcrumb, Badge, Button } from '@cinmax/ui';
import { useCouponsQuery } from '@cinmax/hooks';
import type { Coupon } from '@cinmax/types';

export default function CouponsPage() {
  const { data: coupons = [] } = useCouponsQuery();

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />

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
            badge="Privilege Passes"
            title="Active Coupons & Vouchers"
            subtitle="Apply these exclusive patron privileges at checkout for tailored reductions on your orders."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6">
            {coupons.map((coupon: Coupon) => (
              <div
                key={coupon.id}
                className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm space-y-4 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-extrabold text-[#002754] dark:text-[#C5A880] tracking-wider">
                    {coupon.code}
                  </span>
                  <Badge variant="gold">
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}% OFF`
                      : `$${coupon.discountValue} OFF`}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {coupon.description || 'Valid on all artisanal soap bars and skincare formulations.'}
                </p>
                <div className="pt-2 text-xs text-muted-foreground border-t border-[#0A3D78]/10 flex justify-between items-center">
                  <span>Min order: ${coupon.minOrderAmount || 40}</span>
                  <span className="text-emerald-600 font-semibold">Active</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
