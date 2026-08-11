/**
 * Search Architecture Models, Suggestions, and Engine for CINMAX Global Products
 */

import type { Product, ProductCategory } from '@cinmax/types';

export interface SearchQuery {
  query: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  skinType?: string;
  fragranceFamily?: string;
  sortBy?: 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  limit?: number;
}

export interface SearchSuggestion {
  text: string;
  type: 'product' | 'category' | 'tag' | 'query';
  slug?: string;
  count?: number;
}

export interface SearchResult {
  query: string;
  products: Product[];
  categories: ProductCategory[];
  totalMatches: number;
  executionTimeMs: number;
  suggestions: SearchSuggestion[];
}

export const POPULAR_SEARCH_TERMS: string[] = [
  'French Green Clay',
  'Cold-Process Soap',
  'Dead Sea Salt Bar',
  'Lavender & Chamomile',
  'Organic Shea Butter',
  'Eucalyptus Steam Bar',
  'Exfoliating Bar',
  'Luxury Gift Set',
  'Unscented Pure Bar',
];

export interface ISearchHistoryStorage {
  getRecent(): Promise<string[]> | string[];
  add(query: string): Promise<void> | void;
  remove(query: string): Promise<void> | void;
  clear(): Promise<void> | void;
}

export class MemorySearchHistoryStorage implements ISearchHistoryStorage {
  private history: string[] = ['French Green Clay', 'Dead Sea Salt', 'Cold-Process'];
  private maxItems: number;

  constructor(maxItems = 10) {
    this.maxItems = maxItems;
  }

  public getRecent(): string[] {
    return [...this.history];
  }

  public add(query: string): void {
    const trimmed = query.trim();
    if (!trimmed) return;

    this.history = [trimmed, ...this.history.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(
      0,
      this.maxItems
    );
  }

  public remove(query: string): void {
    this.history = this.history.filter((item) => item.toLowerCase() !== query.toLowerCase());
  }

  public clear(): void {
    this.history = [];
  }
}

export const globalSearchHistory = new MemorySearchHistoryStorage();
