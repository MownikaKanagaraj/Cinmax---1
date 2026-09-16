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
              { label: 'Terms & Conditions', isCurrent: true },
            ]}
          />

          <PageHeader
            badge="Legal Agreement"
            title="Terms & Conditions"
            subtitle="Please read these terms carefully before placing an order or using CINMAX Global Products."
          />

          <div className="p-8 sm:p-12 rounded-[28px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm space-y-8 text-sm text-muted-foreground leading-relaxed mt-6">
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-medium">
              <strong>Notice:</strong> By accessing our website, registering an account, or purchasing any products from CINMAX, you agree to be bound by these Terms &amp; Conditions and our Policies.
            </div>

            {/* 1. Account & Registration */}
            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                1. Customer Account &amp; Registration
              </h3>
              <p>
                To place an order or access loyalty rewards, you may register an account with CINMAX. You are responsible for maintaining the confidentiality of your account credentials and for all activities occurring under your account. You agree to provide accurate, current, and complete contact and shipping information.
              </p>
            </section>

            {/* 2. Product Information & Pricing */}
            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                2. Product Information &amp; Pricing
              </h3>
              <p>
                All prices listed on CINMAX are in Indian Rupees (INR) and are inclusive of applicable Goods and Services Tax (GST). Due to our cold-process botanical artisanal methods, subtle natural variations in bar texture, marbling color, and scent are normal characteristics of genuine craftsmanship. We reserve the right to modify prices, product specifications, and batch availability without prior notice.
              </p>
            </section>

            {/* 3. Order Placement & Confirmation */}
            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                3. Order Placement &amp; Confirmation
              </h3>
              <p>
                An order is considered placed only after successful payment authorization. Upon completion, an order confirmation containing a unique Order Reference Number (e.g. #CGP2026...) will be displayed and sent to your registered email/phone. Receipt of an order confirmation does not signify our final acceptance of your order; we reserve the right to limit quantity or cancel orders in case of stock unavailability or technical errors.
              </p>
            </section>

            {/* 4. Payment Processing through Razorpay */}
            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                4. Payment Gateway &amp; Processing (Razorpay)
              </h3>
              <p>
                Online payments are processed securely through <strong>Razorpay Software Private Limited</strong> ("Razorpay"). CINMAX accepts UPI, Credit/Debit Cards, Net Banking, and digital wallets supported by Razorpay.
              </p>
              <p className="font-medium text-[#002754] dark:text-[#C5A880] pt-1">
                <strong>Important Clarification:</strong> Razorpay acts solely as a third-party payment processing service provider. Razorpay is not responsible for product manufacturing, quality, packaging, courier delivery, order fulfillment, returns, exchanges, or customer service inquiries. All merchant obligations and product liabilities rest exclusively with CINMAX Global Products.
              </p>
            </section>

            {/* 5. Payment Failures & Duplicate Deductions */}
            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                5. Payment Failure &amp; Uncaptured Transactions
              </h3>
              <p>
                A transaction that fails, gets declined by your issuing bank, or is cancelled prior to completion does not constitute a valid order. If funds are debited from your account for an unsuccessful transaction, the debited amount will be automatically reconciled and refunded to your original payment source by Razorpay/your bank within 5 to 7 business days per banking protocol.
              </p>
            </section>

            {/* 6. Customer Responsibilities */}
            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                6. Customer Responsibilities
              </h3>
              <p>
                Customers are responsible for ensuring that the complete delivery address, postal pincode, state selection, and 10-digit mobile number provided during checkout are correct. CINMAX is not responsible for non-delivery or shipping delays caused by inaccurate addresses or customer unavailability.
              </p>
            </section>

            {/* 7. Loyalty Rewards & Promotional Coupons */}
            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                7. Loyalty Points &amp; Promotional Coupons
              </h3>
              <p>
                Loyalty points earned on CINMAX have a redemption value of 1 Point = ₹1 store discount, capped at a maximum of 20% of net product subtotal per order. Loyalty points are non-transferable, non-assignable, and cannot be redeemed for physical cash. Promotional coupons must be applied prior to payment and are subject to specific terms, minimum order limits, and expiry dates.
              </p>
            </section>

            {/* 8. Intellectual Property */}
            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                8. Intellectual Property
              </h3>
              <p>
                All content on this site—including brand names, logos, formulations, product images, software code, and design elements—is the exclusive intellectual property of CINMAX Global Products and protected under Indian IP laws.
              </p>
            </section>

            {/* 9. Limitation of Liability & Fraud Prevention */}
            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                9. Limitation of Liability &amp; Fraudulent Activity
              </h3>
              <p>
                CINMAX shall not be liable for indirect, incidental, or consequential damages resulting from product use beyond the purchase price of the specific product. We reserve the right to cancel suspicious orders or block accounts engaging in fraudulent payment activities or abuse of promotional offers.
              </p>
            </section>

            {/* 10. Governing Law & Dispute Resolution */}
            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                10. Governing Law &amp; Jurisdiction
              </h3>
              <p>
                These Terms &amp; Conditions are governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts located in Chennai, Tamil Nadu, India.
              </p>
            </section>

            {/* 11. Support Contact */}
            <section className="space-y-2 pt-2 border-t border-[#0A3D78]/10">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                11. Contact &amp; Customer Support
              </h3>
              <p>
                For inquiries regarding orders, shipping, or policies, contact our customer support team:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li><strong>Email:</strong> support@cinmaxglobal.com</li>
                <li><strong>Phone / WhatsApp:</strong> +91 98765 43210</li>
                <li><strong>Support Hours:</strong> Monday – Saturday (9:00 AM – 6:00 PM IST)</li>
              </ul>
            </section>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
