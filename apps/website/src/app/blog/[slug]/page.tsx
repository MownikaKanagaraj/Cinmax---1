'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '../../../components/header';
import { Footer } from '../../../components/footer';
import { Container, PageHeader, Breadcrumb, Badge, Button } from '@cinmax/ui';

export default function BlogPostPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'the-alchemy-of-cold-process-curing';

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />

      <main className="flex-1 py-10">
        <Container size="md">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Journal', href: '/blog' },
              { label: 'Chronicle Story', isCurrent: true },
            ]}
          />

          <article className="pt-6 space-y-8">
            <div className="space-y-3 text-center">
              <Badge variant="gold">Atelier Science</Badge>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#002754] dark:text-white leading-tight">
                The Alchemy of Cold-Process Curing: Why 40 Days Matter
              </h1>
              <p className="text-xs text-muted-foreground">
                Published July 28, 2026 • 6 min read • By Master Saponifier E. Laurent
              </p>
            </div>

            <div className="rounded-[28px] overflow-hidden aspect-[16/9] bg-slate-200">
              <img
                src="https://images.unsplash.com/photo-1607006314147-759088fd21c2?w=1200&auto=format&fit=crop&q=80"
                alt="Soap curing racks"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="prose dark:prose-invert max-w-none text-muted-foreground space-y-6 leading-relaxed text-base">
              <p>
                In an era defined by instantaneous speed, genuine soap craft remains one of the few human endeavors that resists acceleration. While industrial facilities use high heat and synthetic binders to press thousands of detergent cakes an hour, the cold-process artisan method operates according to biological patience.
              </p>
              <h2 className="font-serif text-2xl font-bold text-[#002754] dark:text-white pt-4">
                The Chemistry of Saponification
              </h2>
              <p>
                When alkaline sodium hydroxide dissolves into pure mountain water and marries botanical lipids—such as raw Ghanaian shea butter, extra-virgin olive oil, and cold-pressed coconut oil—a gentle exothermic reaction occurs. Over 24 hours, triglycerides transform into fatty acid salts and pure natural glycerin.
              </p>
              <p>
                Glycerin is nature’s most potent botanical humectant, drawing moisture from the surrounding air directly into the skin stratum corneum. In factory detergents, this glycerin is stripped and sold off separately. In our atelier, every micro-molecule is lovingly retained.
              </p>
              <h2 className="font-serif text-2xl font-bold text-[#002754] dark:text-white pt-4">
                The Curing Phase: The Final Transformation
              </h2>
              <p>
                After cutting, our bars rest in cedar curing racks with controlled humidity for 40 to 45 days. Excess water evaporates slowly, tightening crystalline fatty acid structures to create a dense bar that never dissolves into slush in your bath.
              </p>
            </div>

            <div className="pt-8 border-t border-[#0A3D78]/10 flex justify-between items-center">
              <Button variant="outline" size="sm" className="rounded-full">
                <Link href="/blog">← Back to Journal</Link>
              </Button>
              <Button variant="primary" size="sm" className="rounded-full">
                <Link href="/shop">Explore Formulations</Link>
              </Button>
            </div>
          </article>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
