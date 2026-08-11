'use client';

import * as React from 'react';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { Container, PageHeader, Breadcrumb } from '@cinmax/ui';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />

      <main className="flex-1 py-10">
        <Container size="md">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Privacy Policy', isCurrent: true },
            ]}
          />

          <PageHeader
            badge="Data Protection"
            title="Privacy Policy"
            subtitle="Last updated: August 2026. How we protect and respect patron privacy across our digital touchpoints."
          />

          <div className="p-8 sm:p-12 rounded-[28px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm space-y-8 text-sm text-muted-foreground leading-relaxed mt-6">
            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                1. Information We Collect
              </h3>
              <p>
                We only collect essential information required to fulfill your orders, process courier shipments, and deliver personalized botanical recommendations. This includes name, delivery address, email, and encrypted payment tokens.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                2. Data Sovereignty & Zero-Sale Guarantee
              </h3>
              <p>
                We will never sell, lease, or monetize your personal information to third-party advertisers or data brokers.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                3. Payment Encryption
              </h3>
              <p>
                All transactions are processed through PCI-DSS Level 1 certified gateways with AES-256 bit end-to-end encryption.
              </p>
            </section>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
