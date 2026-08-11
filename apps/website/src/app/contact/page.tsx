'use client';

import * as React from 'react';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { Container, PageHeader, Breadcrumb, Button, Input } from '@cinmax/ui';

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />

      <main className="flex-1 py-10">
        <Container size="xl">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Concierge Support', isCurrent: true },
            ]}
          />

          <PageHeader
            badge="Patron Concierge"
            title="Connect With Our Atelier"
            subtitle="Have a question regarding custom formulations, bulk corporate gifts, or order inquiries? Our specialists are at your service."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
            {/* Form */}
            <div className="p-8 rounded-[28px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-lg">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#002754] dark:text-white">
                    Message Dispatched
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Thank you for reaching out. Our atelier concierge will review your inquiry and respond within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
                        Your Name
                      </label>
                      <Input required placeholder="Aurora Vance" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
                        Email Address
                      </label>
                      <Input type="email" required placeholder="aurora@cinmax.luxury" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
                      Subject
                    </label>
                    <Input required placeholder="Custom Wedding Favors / Wholesale Inquiry" />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-[16px] text-sm bg-[#F7F9FB] dark:bg-[#0A192F] border border-[#0A3D78]/20 focus:outline-none focus:border-[#0A3D78]"
                      placeholder="How may our formulations serve you?"
                    />
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full rounded-full">
                    Dispatch Message
                  </Button>
                </form>
              )}
            </div>

            {/* Atelier Info */}
            <div className="space-y-8">
              <div className="p-8 rounded-[28px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-4">
                <h3 className="font-serif text-xl font-bold text-[#002754] dark:text-white">
                  Atelier Headquarters
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  CINMAX Global Products Atelier<br />
                  1280 Botanical Grove Parkway<br />
                  Portland, Oregon 97201, United States
                </p>
                <div className="pt-2 text-xs text-muted-foreground space-y-1">
                  <p>Concierge Line: +1 (800) 555-CNMX</p>
                  <p>Email: concierge@cinmax.luxury</p>
                </div>
              </div>

              <div className="p-8 rounded-[28px] bg-[#002754] text-white space-y-3">
                <h3 className="font-serif text-xl font-bold">Wholesale & Private Label</h3>
                <p className="text-sm text-slate-200 leading-relaxed">
                  We supply bespoke botanical soap batches and guest room amenities to premier luxury boutique hotels and wellness sanctuaries worldwide.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
