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
            title="Privacy & Data Protection Policy"
            subtitle="Learn how CINMAX collects, protects, and handles your personal information."
          />

          <div className="p-8 sm:p-12 rounded-[28px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm space-y-8 text-sm text-muted-foreground leading-relaxed mt-6">
            {/* 1. Information Collection */}
            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                1. Information We Collect
              </h3>
              <p>
                When you visit CINMAX, create an account, or place an order, we collect essential personal information required for order fulfillment and customer support, including your name, email address, phone number, shipping address, and order history.
              </p>
            </section>

            {/* 2. Payment Data Security (Razorpay) */}
            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                2. Payment Data Security (Razorpay)
              </h3>
              <p>
                CINMAX <strong>never stores or accesses your sensitive payment credentials</strong> such as credit/debit card numbers, CVV codes, net banking passwords, or UPI PINs. All online payments are handled directly by PCI-DSS compliant payment gateway partner <strong>Razorpay Software Private Limited</strong> using 256-bit SSL encryption.
              </p>
            </section>

            {/* 3. Usage of Personal Data */}
            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                3. How We Use Your Information
              </h3>
              <p>
                Your information is used strictly to process orders, send live courier tracking notifications, credit loyalty points, communicate customer service updates, and prevent fraudulent transactions. We do not sell or rent customer data to third-party advertisers.
              </p>
            </section>

            {/* 4. Cookies & Analytics */}
            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                4. Cookies &amp; Session Preferences
              </h3>
              <p>
                We use secure session cookies to remember items in your shopping bag, preserve loyalty point preferences, and optimize your navigation experience across our website and mobile applications.
              </p>
            </section>

            {/* 5. Contact Info */}
            <section className="space-y-2 pt-2 border-t border-[#0A3D78]/10">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                5. Privacy Inquiries &amp; Data Deletion
              </h3>
              <p>
                If you wish to review, update, or request the deletion of your personal data archive, contact our privacy compliance officer at <strong>support@cinmaxglobal.com</strong>.
              </p>
            </section>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
