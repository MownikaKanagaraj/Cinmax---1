import { create } from 'zustand';
import type { Product } from '@cinmax/types';

export interface WishlistStoreState {
  items: Product[];
  productIds: string[];
  toggleWishlist: (product: Product) => void;
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStoreState>((set, get) => ({
  items: [],
  productIds: [],

  toggleWishlist: (product) => {
    set((state) => {
      const exists = state.productIds.includes(product.id);
      if (exists) {
        return {
          items: state.items.filter((item) => item.id !== product.id),
          productIds: state.productIds.filter((id) => id !== product.id),
        };
      } else {
        return {
          items: [...state.items, product],
          productIds: [...state.productIds, product.id],
        };
      }
    });
  },

  toggleItem: (productId) => {
    set((state) => {
      const exists = state.productIds.includes(productId);
      if (exists) {
        return {
          items: state.items.filter((item) => item.id !== productId),
          productIds: state.productIds.filter((id) => id !== productId),
        };
      } else {
        return {
          productIds: [...state.productIds, productId],
        };
      }
    });
  },

  isInWishlist: (productId) => {
    return get().productIds.includes(productId);
  },

  isWishlisted: (productId) => {
    return get().productIds.includes(productId);
  },

  clearWishlist: () => set({ items: [], productIds: [] }),
}));
