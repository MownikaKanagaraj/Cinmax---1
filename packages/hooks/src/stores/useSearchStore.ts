import { create } from 'zustand';

export interface SearchStoreState {
  query: string;
  recentSearches: string[];
  isSearchOpen: boolean;
  setQuery: (query: string) => void;
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;
  openSearch: () => void;
  closeSearch: () => void;
}

export const useSearchStore = create<SearchStoreState>((set) => ({
  query: '',
  recentSearches: ['Bergamot', 'Cold-Process Bar', 'Shea Butter', 'Lavender', 'Scrub'],
  isSearchOpen: false,

  setQuery: (query) => set({ query }),
  addRecentSearch: (term) =>
    set((state) => ({
      recentSearches: [term, ...state.recentSearches.filter((s) => s !== term)].slice(0, 8),
    })),
  clearRecentSearches: () => set({ recentSearches: [] }),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
}));
