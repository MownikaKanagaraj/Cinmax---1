'use client';

import * as React from 'react';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { Container, PageHeader, Breadcrumb } from '@cinmax/ui';

export default function FAQPage() {
  const faqs = [
    {
      q: 'What is cold-process soap making and why is it superior?',
      a: 'Cold-process soap making is an age-old artisanal technique combining plant oils with sodium hydroxide without applying external cooking heat. This preserves the natural moisturizing glycerin and delicate botanical essences that commercial mass production strips away.',
    },
    {
      q: 'How long does each bar of CINMAX soap last?',
      a: 'Because our bars undergo a full 6-week cure to evaporate excess moisture, they are exceptionally dense and long-lasting. With a well-drained soap dish, each 120g bar typically lasts 3 to 4 weeks of daily bathing.',
    },
    {
      q: 'Are your formulations safe for eczema and sensitive skin?',
      a: 'Yes. We formulate without synthetic lathering detergents (like SLS), phthalates, or parabens. We also offer unfragranced formulations enriched with colloidal oats and virgin shea butter for ultra-reactive skin.',
    },
    {
      q: 'Do you ship internationally?',
      a: 'Yes, we provide carbon-neutral international courier shipping across North America, Europe, Asia-Pacific, and the Middle East.',
    },
  ];

  const [openIdx, setOpenIdx] = React.useState<number | null>(0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />

      <main className="flex-1 py-10">
        <Container size="md">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Frequently Asked Questions', isCurrent: true },
            ]}
          />

          <PageHeader
            badge="Atelier Knowledge Base"
            title="Frequently Asked Questions"
            subtitle="Curated answers regarding our soap curing methods, ingredients, and storage advice."
          />

          <div className="space-y-4 pt-6">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-[20px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm"
              >
                <button
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-serif font-bold text-base text-[#002754] dark:text-white"
                >
                  <span>{faq.q}</span>
                  <span className="text-xl ml-4">{openIdx === idx ? '−' : '+'}</span>
                </button>
                {openIdx === idx && (
                  <p className="pt-3 text-sm text-muted-foreground leading-relaxed border-t border-[#0A3D78]/10 mt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
