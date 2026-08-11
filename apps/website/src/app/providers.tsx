'use client';

import * as React from 'react';
import { AppProviders } from '@cinmax/hooks';
import { GlobalErrorBoundary, ToastContainer } from '@cinmax/ui';

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <GlobalErrorBoundary>
      <AppProviders>
        {children}
        <ToastContainer />
      </AppProviders>
    </GlobalErrorBoundary>
  );
}
