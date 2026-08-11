'use client';

import * as React from 'react';
import { AppProviders } from '@cinmax/hooks';
import { GlobalErrorBoundary, ToastContainer } from '@cinmax/ui';

export interface AdminProvidersProps {
  children: React.ReactNode;
}

export function AdminProviders({ children }: AdminProvidersProps) {
  return (
    <GlobalErrorBoundary>
      <AppProviders>
        {children}
        <ToastContainer />
      </AppProviders>
    </GlobalErrorBoundary>
  );
}
