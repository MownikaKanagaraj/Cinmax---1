'use client';

import * as React from 'react';
import Link from 'next/link';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { Container, PageHeader, Breadcrumb, Badge } from '@cinmax/ui';

export default function BlogPage() {
  const articles = [
    {
      slug: 'the-alchemy-of-cold-process-curing',
      title: 'The Alchemy of Cold-Process Curing: Why 40 Days Matter',
      excerpt: 'Exploring the slow saponification science behind why unheated plant oils produce longer lasting, richer skin lather.',
      date: 'July 28, 2026',
      category: 'Atelier Science',
      image: 'https://images.unsplash.com/photo-1607006314147-759088fd21c2?w=600&auto=format&fit=crop&q=80',
    },
    {
      slug: 'wildcrafted-sea-kelp-skin-benefits',
      title: 'Wildcrafted Sea Kelp & Marine Minerals in Personal Care',
      excerpt: 'How sustainably foraged ocean botanicals support the skin moisture barrier against everyday pollution.',
      date: 'July 14, 2026',
      category: 'Botanicals',
      image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&auto=format&fit=crop&q=80',
    },
    {
      slug: 'creating-a-restorative-evening-bathing-ritual',
      title: 'Creating a Restorative Evening Bathing Ritual',
      excerpt: 'Transform everyday personal care into a meditative sanctuary with natural aromatherapeutic steam and warm botanicals.',
      date: 'June 30, 2026',
      category: 'Rituals',
      image: 'https://images.unsplash.com/photo-1547793548-7a0e7dfdb24f?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />

      <main className="flex-1 py-10">
        <Container size="xl">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Botanical Journal', isCurrent: true },
            ]}
          />

          <PageHeader
            badge="Atelier Chronicle"
            title="The Botanical Journal"
            subtitle="Essays, formulation insights, botanical sourcing diaries, and mindful ritual guides."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group flex flex-col rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="primary">{article.category}</Badge>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground">{article.date}</span>
                    <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white group-hover:text-[#0A3D78] transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0A3D78] dark:text-[#C5A880] pt-2">
                    Read Chronicle →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
