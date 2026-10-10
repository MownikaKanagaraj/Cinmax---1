import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product, ProductImage } from '@cinmax/types';

export interface WishlistStoreState {
  items: Product[];
  productIds: string[];
  toggleWishlist: (product: Product | any) => void;
  toggleItem: (productOrId: Product | any | string, fallbackProduct?: Partial<Product>) => void;
  isInWishlist: (productIdOrSlug?: string) => boolean;
  isWishlisted: (productIdOrSlug?: string) => boolean;
  clearWishlist: () => void;
}

const memoryStore = new Map<string, string>();

const universalStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
      try {
        const val = window.localStorage.getItem(name);
        if (val !== null) return val;
      } catch (e) {}
    }
    return memoryStore.get(name) ?? null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    memoryStore.set(name, value);
    if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.setItem === 'function') {
      try {
        window.localStorage.setItem(name, value);
      } catch (e) {}
    }
  },
  removeItem: async (name: string): Promise<void> => {
    memoryStore.delete(name);
    if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.removeItem === 'function') {
      try {
        window.localStorage.removeItem(name);
      } catch (e) {}
    }
  },
};

function normalizeProduct(productOrId: any, fallbackProduct?: any): Product {
  const isString = typeof productOrId === 'string';
  const raw = isString ? fallbackProduct || {} : productOrId || {};
  const id = isString ? productOrId : raw.id || raw.slug || `prod_${Date.now()}`;
  const slug = raw.slug || id;
  const title = raw.title || 'Artisanal Botanical Soap';
  const numPrice =
    typeof raw.basePrice === 'number'
      ? raw.basePrice
      : typeof raw.price === 'number'
      ? raw.price
      : parseInt(String(raw.price || raw.basePrice || 249).replace(/[^0-9]/g, '')) || 249;

  let images: ProductImage[] = [];
  if (Array.isArray(raw.images) && raw.images.length > 0) {
    images = raw.images.map((img: any, idx: number) => {
      if (typeof img === 'string') {
        return { id: `img_${id}_${idx}`, url: img, alt: title, altText: title, isPrimary: idx === 0, sortOrder: idx };
      }
      return {
        id: img.id || `img_${id}_${idx}`,
        url: img.url || 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&auto=format&fit=crop&q=80',
        alt: img.alt || img.altText || title,
        altText: img.altText || img.alt || title,
        isPrimary: img.isPrimary ?? idx === 0,
        sortOrder: img.sortOrder ?? idx,
      };
    });
  } else {
    const singleUrl = raw.image || 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&auto=format&fit=crop&q=80';
    images = [{ id: `img_${id}_0`, url: singleUrl, alt: title, altText: title, isPrimary: true, sortOrder: 0 }];
  }

  const normalized: Product = {
    id,
    title,
    slug,
    brand: raw.brand || 'CINMAX',
    subtitle: raw.subtitle || '',
    description: raw.description || 'Artisanal small-batch cold-processed soap formulation.',
    processType: raw.processType || 'cold-process',
    categoryId: raw.categoryId || 'cold-process',
    category: raw.category,
    basePrice: numPrice,
    compareAtPrice: raw.compareAtPrice || null,
    currency: raw.currency || 'INR',
    images,
    variants: raw.variants || [],
    ingredients: raw.ingredients || [],
    skinTypes: raw.skinTypes || ['all'],
    fragranceFamily: raw.fragranceFamily || 'herbal',
    certifications: raw.certifications || ['100-vegan', 'cruelty-free'],
    isFeatured: Boolean(raw.isFeatured),
    isNew: Boolean(raw.isNew),
    isBestSeller: Boolean(raw.isBestSeller),
    isActive: raw.isActive !== false,
    averageRating: raw.averageRating || raw.rating || 4.8,
    reviewCount: raw.reviewCount || 128,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return normalized;
}

export const useWishlistStore = create<WishlistStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      productIds: [],

      toggleWishlist: (product: Product | any) => {
        if (!product) return;
        const normalized = normalizeProduct(product);
        set((state) => {
          const exists =
            state.productIds.includes(normalized.id) ||
            state.productIds.includes(normalized.slug) ||
            state.items.some((item) => item.id === normalized.id || (normalized.slug && item.slug === normalized.slug));

          if (exists) {
            return {
              items: state.items.filter((item) => item.id !== normalized.id && item.slug !== normalized.slug),
              productIds: state.productIds.filter((id) => id !== normalized.id && id !== normalized.slug),
            };
          } else {
            return {
              items: [...state.items.filter((item) => item.id !== normalized.id && item.slug !== normalized.slug), normalized],
              productIds: [...state.productIds.filter((id) => id !== normalized.id && id !== normalized.slug), normalized.id],
            };
          }
        });
      },

      toggleItem: (productOrId: Product | any | string, fallbackProduct?: Partial<Product>) => {
        if (!productOrId) return;
        const normalized = normalizeProduct(productOrId, fallbackProduct);
        set((state) => {
          const exists =
            state.productIds.includes(normalized.id) ||
            state.productIds.includes(normalized.slug) ||
            state.items.some((item) => item.id === normalized.id || (normalized.slug && item.slug === normalized.slug));

          if (exists) {
            return {
              items: state.items.filter((item) => item.id !== normalized.id && item.slug !== normalized.slug),
              productIds: state.productIds.filter((id) => id !== normalized.id && id !== normalized.slug),
            };
          } else {
            return {
              items: [...state.items.filter((item) => item.id !== normalized.id && item.slug !== normalized.slug), normalized],
              productIds: [...state.productIds.filter((id) => id !== normalized.id && id !== normalized.slug), normalized.id],
            };
          }
        });
      },

      isInWishlist: (productIdOrSlug?: string) => {
        if (!productIdOrSlug) return false;
        const state = get();
        return (
          state.productIds.includes(productIdOrSlug) ||
          state.items.some((item) => item.id === productIdOrSlug || item.slug === productIdOrSlug)
        );
      },

      isWishlisted: (productIdOrSlug?: string) => {
        if (!productIdOrSlug) return false;
        const state = get();
        return (
          state.productIds.includes(productIdOrSlug) ||
          state.items.some((item) => item.id === productIdOrSlug || item.slug === productIdOrSlug)
        );
      },

      clearWishlist: () => set({ items: [], productIds: [] }),
    }),
    {
      name: 'cinmax-wishlist-storage',
      storage: createJSONStorage(() => universalStorage),
    }
  )
);
