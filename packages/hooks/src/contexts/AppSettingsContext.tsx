'use client';

import React, { createContext, useContext } from 'react';
import { useAppSettingsStore, AppSettingsStoreState } from '../stores/useAppSettingsStore';

const AppSettingsContext = createContext<AppSettingsStoreState | undefined>(undefined);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const settings = useAppSettingsStore();
  return (
    <AppSettingsContext.Provider value={settings}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettingsContext() {
  const context = useContext(AppSettingsContext);
  if (!context) throw new Error('useAppSettingsContext must be used within AppSettingsProvider');
  return context;
}
