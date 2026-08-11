'use client';

import React, { createContext, useContext } from 'react';
import { useCartStore, CartStoreState } from '../stores/useCartStore';

const CartContext = createContext<CartStoreState | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cart = useCartStore();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCartContext must be used within CartProvider');
  return context;
}
