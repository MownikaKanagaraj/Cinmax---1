'use client';

import * as React from 'react';
import { AppProviders } from '@cinmax/hooks';
import { GlobalErrorBoundary, ToastContainer } from '@cinmax/ui';

import { SidebarProvider } from '../context/sidebar-context';

export interface AdminProvidersProps {
  children: React.ReactNode;
}

export function AdminProviders({ children }: AdminProvidersProps) {
  return (
    <GlobalErrorBoundary>
      <AppProviders>
        <SidebarProvider>
          {children}
          <ToastContainer />
        </SidebarProvider>
      </AppProviders>
    </GlobalErrorBoundary>
  );
}

