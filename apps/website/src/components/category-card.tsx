import * as React from 'react';
import Link from 'next/link';
import type { Category } from '@cinmax/types';

export interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative overflow-hidden rounded-[24px] aspect-[4/5] block bg-slate-900 shadow-md hover:shadow-2xl transition-all duration-500"
    >
      <img
        src={
          category.imageUrl ||
          'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop&q=80'
        }
        alt={category.name}
        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-80 group-hover:opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#002754]/90 via-[#002754]/30 to-transparent" />
      <div className="absolute bottom-6 left-6 right-6 space-y-1.5 text-white">
        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#C5A880]">
          {category.productCount ? `${category.productCount} Formulations` : 'Botanical Collection'}
        </span>
        <h3 className="font-serif text-2xl font-bold tracking-tight group-hover:translate-x-1 transition-transform">
          {category.name}
        </h3>
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
          {category.description}
        </p>
      </div>
    </Link>
  );
}
