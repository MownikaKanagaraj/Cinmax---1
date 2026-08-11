'use client';

import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { Container, getContainer } from './container';
import type { ContainerConfig, IContainer } from './types';

const ContainerContext = createContext<IContainer | null>(null);

export interface RepositoryProviderProps {
  children: ReactNode;
  config?: ContainerConfig;
  container?: IContainer;
}

export function RepositoryProvider({
  children,
  config,
  container,
}: RepositoryProviderProps): React.JSX.Element {
  const instance = useMemo(() => {
    if (container) return container;
    return getContainer(config);
  }, [container, config]);

  return (
    <ContainerContext.Provider value={instance}>
      {children}
    </ContainerContext.Provider>
  );
}

export function useContainer(): IContainer {
  const context = useContext(ContainerContext);
  if (!context) {
    // Fallback to default singleton container if not wrapped in provider
    return getContainer();
  }
  return context;
}

// Alias for convenience
export const CinmaxProvider = RepositoryProvider;
export const ServiceProvider = RepositoryProvider;
