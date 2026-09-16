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
              { label: 'Return & Refund Policy', isCurrent: true },
            ]}
          />

          <PageHeader
            badge="Store Policy"
            title="Return & Refund Policy"
            subtitle="Understand our strict No Return, No Refund and Order Cancellation guidelines."
          />

          <div className="p-8 sm:p-12 rounded-[28px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm space-y-8 text-sm text-muted-foreground leading-relaxed mt-6">
            {/* Primary Policy Banner */}
            <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-sm font-semibold space-y-1">
              <div className="text-base font-bold font-serif text-rose-950 dark:text-rose-100 uppercase tracking-wide">
                No Return &amp; No Refund Policy
              </div>
              <p>
                "All purchases are final. CINMAX follows a No Return and No Refund policy, except where otherwise required by applicable law or specifically approved by CINMAX."
              </p>
            </div>

            {/* 1. Finality of Sales */}
            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                1. Finality of Sales &amp; Hygiene Standards
              </h3>
              <p>
                Due to the personal care, skincare, and botanical nature of CINMAX products, and to maintain strict hygiene and quality assurance standards, products once sold cannot be returned, exchanged, or refunded. Customers are strongly advised to verify product ingredients, formulations, prices, and shipping details before completing payment.
              </p>
            </section>

            {/* 2. Order Cancellation Policy */}
            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                2. Order Cancellation Policy
              </h3>
              <p>
                Once an order is successfully placed and payment is authorized, it enters our immediate batch allocation and packing workflow. Customers cannot request order cancellations or modifications after payment confirmation. Any exceptional cancellation request is subject to sole review and approval by CINMAX management prior to dispatch.
              </p>
            </section>

            {/* 3. Damaged, Defective or Incorrect Items */}
            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                3. Damaged, Defective, or Incorrect Deliveries
              </h3>
              <p>
                In the rare event that your package arrives in a damaged, defective, or incorrect state due to courier mishandling:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs">
                <li>You must notify CINMAX Customer Support within <strong>48 hours of delivery</strong>.</li>
                <li>Provide your Order Reference Number (#CGP2026...) along with clear unboxing photos/videos showing the damaged or incorrect item and outer courier box.</li>
                <li>CINMAX will investigate the issue with the logistics team. If verified, CINMAX will arrange a replacement or issue a resolution at its sole discretion.</li>
                <li>Do not promise or expect an automatic refund without verification.</li>
              </ul>
            </section>

            {/* 4. Processing Approved Refunds (Razorpay) */}
            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                4. Approved Exceptional Refunds
              </h3>
              <p>
                If CINMAX explicitly approves a refund for an eligible exceptional case, the refund will be credited back to the original payment method used during checkout via our payment gateway partner, <strong>Razorpay</strong>. Approved refunds typically reflect in your bank account or card within 5 to 7 business days per standard banking timelines.
              </p>
            </section>

            {/* 5. Failed vs Completed Transactions */}
            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                5. Failed Transactions vs Completed Orders
              </h3>
              <p>
                Please distinguish between a completed order and a failed payment. If your money was deducted during an uncompleted checkout due to network timeouts or bank errors, Razorpay will automatically reverse the transaction to your account within 5 to 7 working days.
              </p>
            </section>

            {/* 6. Razorpay Support Clarification */}
            <section className="space-y-2 pt-2 border-t border-[#0A3D78]/10">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                6. Customer Support Contact
              </h3>
              <p>
                For all return, damage, or policy inquiries, please contact CINMAX directly. <em>(Note: Razorpay is our payment gateway provider and does not handle product complaints or return authorizations.)</em>
              </p>
              <div className="text-xs space-y-1 font-mono pt-1">
                <p><strong>Email:</strong> support@cinmaxglobal.com</p>
                <p><strong>WhatsApp / Phone:</strong> +91 98765 43210</p>
              </div>
            </section>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
