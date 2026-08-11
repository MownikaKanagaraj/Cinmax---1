import { create } from 'zustand';
import type { ProductFilter, SkinType, FragranceFamily, SoapProcessType } from '@cinmax/types';

export interface FilterStoreState {
  filter: ProductFilter;
  setCategory: (categorySlug?: string) => void;
  setProcessType: (processType?: SoapProcessType) => void;
  setSkinType: (skinType?: SkinType) => void;
  setFragranceFamily: (fragranceFamily?: FragranceFamily) => void;
  setPriceRange: (min?: number, max?: number) => void;
  setSortBy: (sortBy: ProductFilter['sortBy']) => void;
  setInStockOnly: (inStockOnly: boolean) => void;
  toggleCertification: (cert: string) => void;
  resetFilters: () => void;
}

const initialFilter: ProductFilter = {
  sortBy: 'featured',
  inStockOnly: false,
  certifications: [],
};

export const useFilterStore = create<FilterStoreState>((set) => ({
  filter: initialFilter,

  setCategory: (categorySlug) =>
    set((state) => ({ filter: { ...state.filter, categorySlug } })),

  setProcessType: (processType) =>
    set((state) => ({ filter: { ...state.filter, processType } })),

  setSkinType: (skinType) =>
    set((state) => ({ filter: { ...state.filter, skinType } })),

  setFragranceFamily: (fragranceFamily) =>
    set((state) => ({ filter: { ...state.filter, fragranceFamily } })),

  setPriceRange: (minPrice, maxPrice) =>
    set((state) => ({ filter: { ...state.filter, minPrice, maxPrice } })),

  setSortBy: (sortBy) =>
    set((state) => ({ filter: { ...state.filter, sortBy } })),

  setInStockOnly: (inStockOnly) =>
    set((state) => ({ filter: { ...state.filter, inStockOnly } })),

  toggleCertification: (cert) =>
    set((state) => {
      const current = state.filter.certifications || [];
      const updated = current.includes(cert)
        ? current.filter((c) => c !== cert)
        : [...current, cert];
      return { filter: { ...state.filter, certifications: updated } };
    }),

  resetFilters: () => set({ filter: initialFilter }),
}));
