'use client';

import React from 'react';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import { WishlistProvider } from '../contexts/WishlistContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { ToastProvider } from '../contexts/ToastContext';
import { ModalProvider } from '../contexts/ModalContext';
import { LoadingProvider } from '../contexts/LoadingContext';
import { ProductProvider } from '../contexts/ProductContext';
import { OrderProvider } from '../contexts/OrderContext';
import { AppSettingsProvider } from '../contexts/AppSettingsContext';

import { RepositoryProvider } from '@cinmax/api';

export interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Universal Root Provider Composer for Web & Native applications
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <RepositoryProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppSettingsProvider>
              <CartProvider>
                <WishlistProvider>
                  <NotificationProvider>
                    <ProductProvider>
                      <OrderProvider>
                        <ModalProvider>
                          <LoadingProvider>
                            <ToastProvider>{children}</ToastProvider>
                          </LoadingProvider>
                        </ModalProvider>
                      </OrderProvider>
                    </ProductProvider>
                  </NotificationProvider>
                </WishlistProvider>
              </CartProvider>
            </AppSettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </RepositoryProvider>
    </QueryProvider>
  );
}
