'use client';

import * as React from 'react';
import { QueryProvider, ToastProvider } from '@cinmax/hooks';
import { GlobalErrorBoundary, ToastContainer } from '@cinmax/ui';

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <GlobalErrorBoundary>
      <QueryProvider>
        <ToastProvider>
          {children}
          <ToastContainer />
        </ToastProvider>
      </QueryProvider>
    </GlobalErrorBoundary>
  );
}

