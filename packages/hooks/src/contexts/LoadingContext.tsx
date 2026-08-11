'use client';

import React, { createContext, useContext, useState } from 'react';

interface LoadingContextValue {
  isLoading: boolean;
  message?: string;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextValue | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const startLoading = (msg?: string) => {
    setMessage(msg);
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setMessage(undefined);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, message, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoadingContext() {
  const context = useContext(LoadingContext);
  if (!context) throw new Error('useLoadingContext must be used within LoadingProvider');
  return context;
}
