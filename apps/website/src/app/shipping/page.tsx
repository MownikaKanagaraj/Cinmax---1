'use client';

import * as React from 'react';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { Container, PageHeader, Breadcrumb } from '@cinmax/ui';

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />

      <main className="flex-1 py-10">
        <Container size="md">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Shipping Policy', isCurrent: true },
            ]}
          />

          <PageHeader
            badge="Logistics & Delivery"
            title="Shipping & Delivery Policy"
            subtitle="Read about our order processing timelines, state delivery tariffs, and courier procedures."
          />

          <div className="p-8 sm:p-12 rounded-[28px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm space-y-8 text-sm text-muted-foreground leading-relaxed mt-6">
            {/* 1. Order Processing Timeline */}
            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                1. Order Processing Timeline
              </h3>
              <p>
                All orders are carefully packed and dispatched from our atelier within <strong>24 to 48 business hours</strong> following successful payment authorization. Orders placed on Sundays or official public holidays will be dispatched on the next working business day.
              </p>
            </section>

            {/* 2. Delivery Timelines across India */}
            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                2. Estimated Delivery Timelines
              </h3>
              <p>
                We partner with tier-1 Indian courier services (BlueDart, Delhivery, DTDC, India Post) to ensure fast and reliable delivery:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#F7F9FB] dark:bg-[#0A192F] border border-[#0A3D78]/10">
                  <h4 className="font-bold text-[#002754] dark:text-white text-xs uppercase tracking-wider">
                    South India Regions
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tamil Nadu, Puducherry, Kerala, Karnataka, Andhra Pradesh, Telangana: <strong>2 – 4 Business Days</strong>
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#F7F9FB] dark:bg-[#0A192F] border border-[#0A3D78]/10">
                  <h4 className="font-bold text-[#002754] dark:text-white text-xs uppercase tracking-wider">
                    Rest of India &amp; Metro Cities
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    North, West, East India &amp; Union Territories: <strong>4 – 7 Business Days</strong>
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Shipping Charges & Free Shipping Threshold */}
            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                3. Shipping Tariff Structure
              </h3>
              <p>
                Shipping fees are automatically calculated at checkout based on destination state and product quantity:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs">
                <li><strong>Tamil Nadu &amp; Puducherry:</strong> ₹60 standard shipping</li>
                <li><strong>Other South Indian States:</strong> ₹80 standard shipping</li>
                <li><strong>Rest of India:</strong> ₹100 standard shipping</li>
                <li><strong className="text-emerald-600 dark:text-emerald-400">Free Shipping:</strong> Automatically applied on orders with qualifying promotional vouchers or cart thresholds over ₹1,499.</li>
              </ul>
            </section>

            {/* 4. Delivery Delays & Address Responsibility */}
            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                4. Delivery Delays &amp; Address Accuracy
              </h3>
              <p>
                While we make every effort to deliver within estimated timelines, CINMAX is not liable for logistics delays caused by extreme weather conditions, regional strikes, national holidays, or courier operational disruptions.
              </p>
              <p className="pt-1">
                Customers must ensure that the delivery address, landmark, 6-digit pincode, and mobile phone number provided are 100% accurate and reachable. Re-routing charges resulting from incorrect address details are the customer's responsibility.
              </p>
            </section>

            {/* 5. What to do if Package is Delayed or Damaged */}
            <section className="space-y-2 pt-2 border-t border-[#0A3D78]/10">
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
                5. Shipment Tracking &amp; Support
              </h3>
              <p>
                Once dispatched, you will receive a Live Courier Tracking AWB number via SMS, Email, or WhatsApp. You can track your shipment directly under the <strong>"Track Courier Dispatch"</strong> button on your order page.
              </p>
              <p className="text-xs pt-1">
                If your delivery is delayed past 7 business days or outer packaging shows visible tampering, contact CINMAX Support immediately at <strong>support@cinmaxglobal.com</strong> or <strong>+91 98765 43210</strong>.
              </p>
            </section>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
