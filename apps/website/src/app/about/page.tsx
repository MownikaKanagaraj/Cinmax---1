'use client';

import * as React from 'react';
import Link from 'next/link';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { Container, Section, PageHeader, Breadcrumb, Button } from '@cinmax/ui';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />

      <main className="flex-1 py-10">
        <Container size="xl">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'About CINMAX', isCurrent: true },
            ]}
          />

          <PageHeader
            badge="Atelier Heritage"
            title="The Art of Mindful Saponification"
            subtitle="CINMAX was founded on a singular conviction: skin deserves the purest nourishment nature can yield, unhurried and crafted with obsessive care."
          />

          {/* Hero Imagery & Story */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 items-center">
            <div className="rounded-[28px] overflow-hidden aspect-[4/3] bg-slate-200">
              <img
                src="https://images.unsplash.com/photo-1547793548-7a0e7dfdb24f?w=1000&auto=format&fit=crop&q=80"
                alt="Artisan at work"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#002754] dark:text-white">
                Six Weeks of Patient Curing
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Modern industrial soap making favors extreme heat and chemical surfactants to churn out bars in minutes. In contrast, our cold-process method preserves the therapeutic compounds of unrefined shea butter, organic cold-pressed jojoba, and raw botanical extracts.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                Each slab is hand-poured in small wooden molds, hand-cut with stainless steel wires, and cured over 40 days to create a bar that produces creamy, moisturized lather.
              </p>
            </div>
          </div>

          {/* Standards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
            <div className="p-8 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-3 shadow-sm">
              <h3 className="font-serif font-bold text-xl text-[#002754] dark:text-white">
                Ethical Sourcing
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We work directly with fair-trade women’s co-ops in Ghana for raw shea butter and wild harvesters in the Pacific Northwest for kelp.
              </p>
            </div>

            <div className="p-8 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-3 shadow-sm">
              <h3 className="font-serif font-bold text-xl text-[#002754] dark:text-white">
                Zero Plastic Footprint
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every carton is made from 100% post-consumer FSC-certified paper, printed with vegetable soy inks, and completely compostable.
              </p>
            </div>

            <div className="p-8 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-3 shadow-sm">
              <h3 className="font-serif font-bold text-xl text-[#002754] dark:text-white">
                Hypoallergenic Rigor
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tested dermatologically for sensitive skin profiles, completely free of synthetic fragrance oils, phthalates, and sulfated surfactants.
              </p>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
