import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface PlaylistPurchasesStoreState {
  purchasedPlaylistIds: string[];
  addPurchasedPlaylistId: (playlistId: string) => void;
  syncPurchasedPlaylistIds: (playlistIds: string[]) => void;
  isPlaylistUnlocked: (playlistId: string) => boolean;
}

export const usePlaylistPurchasesStore = create<PlaylistPurchasesStoreState>()(
  persist(
    (set, get) => ({
      purchasedPlaylistIds: [],

      addPurchasedPlaylistId: (playlistId: string) => {
        set((state) => {
          if (state.purchasedPlaylistIds.includes(playlistId)) return state;
          return { purchasedPlaylistIds: [...state.purchasedPlaylistIds, playlistId] };
        });
      },

      syncPurchasedPlaylistIds: (playlistIds: string[]) => {
        set((state) => {
          const merged = Array.from(new Set([...state.purchasedPlaylistIds, ...playlistIds]));
          return { purchasedPlaylistIds: merged };
        });
      },

      isPlaylistUnlocked: (playlistId: string) => {
        if (!playlistId) return false;
        return get().purchasedPlaylistIds.includes(playlistId);
      },
    }),
    {
      name: 'cinmax-purchased-playlists-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
    }
  )
);
