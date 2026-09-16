import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@cinmax/types';

export interface WishlistStoreState {
  items: Product[];
  productIds: string[];
  toggleWishlist: (product: Product) => void;
  toggleItem: (productOrId: Product | string) => void;
  isInWishlist: (productId: string) => boolean;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStoreState>()(
  persist(
    (set, get) => ({
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

      toggleItem: (productOrId) => {
        set((state) => {
          if (typeof productOrId === 'string') {
            const exists = state.productIds.includes(productOrId);
            if (exists) {
              return {
                items: state.items.filter((item) => item.id !== productOrId),
                productIds: state.productIds.filter((id) => id !== productOrId),
              };
            } else {
              return {
                productIds: [...state.productIds, productOrId],
              };
            }
          } else {
            const product = productOrId;
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
    }),
    {
      name: 'cinmax-wishlist-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
    }
  )
);

