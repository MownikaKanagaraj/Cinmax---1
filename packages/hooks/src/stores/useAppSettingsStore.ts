import { create } from 'zustand';

export interface AppSettingsStoreState {
  currency: 'USD' | 'EUR' | 'GBP';
  locale: string;
  shippingCountry: string;
  setCurrency: (currency: 'USD' | 'EUR' | 'GBP') => void;
  setLocale: (locale: string) => void;
  setShippingCountry: (country: string) => void;
}

export const useAppSettingsStore = create<AppSettingsStoreState>((set) => ({
  currency: 'USD',
  locale: 'en-US',
  shippingCountry: 'United States',

  setCurrency: (currency) => set({ currency }),
  setLocale: (locale) => set({ locale }),
  setShippingCountry: (shippingCountry) => set({ shippingCountry }),
}));
