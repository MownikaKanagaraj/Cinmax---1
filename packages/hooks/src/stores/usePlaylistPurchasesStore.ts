import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface PlaylistPurchasesStoreState {
  purchasedPlaylistIds: string[];
  addPurchasedPlaylistId: (playlistId: string) => void;
  syncPurchasedPlaylistIds: (playlistIds: string[]) => void;
  isPlaylistUnlocked: (playlistId: string) => boolean;
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
      storage: createJSONStorage(() => universalStorage),
    }
  )
);
