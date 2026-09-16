'use client';

import * as React from 'react';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { Container, PageHeader, Breadcrumb } from '@cinmax/ui';

export default function RefundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />

      <main className="flex-1 py-10">
        <Container size="md">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Refund Policy', isCurrent: true },
            ]}
          />

          <PageHeader
            badge="Atelier Guarantee"
            title="Satisfaction & Refund Policy"
            subtitle="We stand unequivocally behind the skin-comfort and botanical purity of our handcrafted soaps."
          />

          <div className="p-8 sm:p-12 rounded-[28px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm space-y-8 text-sm text-muted-foreground leading-relaxed mt-6">
            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                30-Day Botanical Harmony Guarantee
              </h3>
              <p>
                If any CINMAX cold-process bar or botanical formulation does not meet your expectations for skin comfort, hydration, and lather luxury, contact our concierge within 30 days of receipt for an immediate replacement or full refund.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                Transit Damage Resolution
              </h3>
              <p>
                In the rare event your order encounters transit damage, notify us at concierge@cinmax.luxury with a quick photograph and we will dispatch a replacement package via priority express.
              </p>
            </section>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
