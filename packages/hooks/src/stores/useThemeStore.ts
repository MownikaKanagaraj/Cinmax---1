import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeStoreState {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStoreState>((set, get) => ({
  theme: 'light',
  resolvedTheme: 'light',

  setTheme: (theme) => {
    const resolved =
      theme === 'system'
        ? typeof window !== 'undefined' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme;

    set({ theme, resolvedTheme: resolved });
  },

  toggleTheme: () => {
    const current = get().resolvedTheme;
    const next = current === 'light' ? 'dark' : 'light';
    set({ theme: next, resolvedTheme: next });
  },
}));
