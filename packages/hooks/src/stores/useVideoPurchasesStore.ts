import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface VideoPurchasesStoreState {
  purchasedVideoIds: string[];
  addPurchasedVideoId: (videoId: string) => void;
  syncPurchasedVideoIds: (videoIds: string[]) => void;
  isUnlocked: (videoId: string, isFree?: boolean) => boolean;
}

export const useVideoPurchasesStore = create<VideoPurchasesStoreState>()(
  persist(
    (set, get) => ({
      purchasedVideoIds: [],

      addPurchasedVideoId: (videoId: string) => {
        set((state) => {
          if (state.purchasedVideoIds.includes(videoId)) return state;
          return { purchasedVideoIds: [...state.purchasedVideoIds, videoId] };
        });
      },

      syncPurchasedVideoIds: (videoIds: string[]) => {
        set((state) => {
          const merged = Array.from(new Set([...state.purchasedVideoIds, ...videoIds]));
          return { purchasedVideoIds: merged };
        });
      },

      isUnlocked: (videoId: string, isFree?: boolean) => {
        if (isFree) return true;
        return get().purchasedVideoIds.includes(videoId);
      },
    }),
    {
      name: 'cinmax-purchased-videos-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
    }
  )
);
