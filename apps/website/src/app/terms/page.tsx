'use client';

import * as React from 'react';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { Container, PageHeader, Breadcrumb } from '@cinmax/ui';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />

      <main className="flex-1 py-10">
        <Container size="md">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Terms of Service', isCurrent: true },
            ]}
          />

          <PageHeader
            badge="Patron Agreement"
            title="Terms of Service"
            subtitle="Understand our service principles, artisanal batch variations, and ordering terms."
          />

          <div className="p-8 sm:p-12 rounded-[28px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm space-y-8 text-sm text-muted-foreground leading-relaxed mt-6">
            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                1. Handcrafted Variations
              </h3>
              <p>
                Due to our authentic cold-process artisan curing methods and natural botanical harvests, subtle variations in marbling color, texture, and natural aroma between batches are hallmarks of genuine craftsmanship.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                2. Order Acceptance & Allocation
              </h3>
              <p>
                All orders are subject to acceptance and small-batch availability. If a cured batch sells out prior to order dispatch, our concierge will notify you of estimated cure completion dates.
              </p>
            </section>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
