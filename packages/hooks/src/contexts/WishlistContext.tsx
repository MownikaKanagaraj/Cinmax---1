'use client';

import React, { createContext, useContext } from 'react';
import { useWishlistStore, WishlistStoreState } from '../stores/useWishlistStore';

const WishlistContext = createContext<WishlistStoreState | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const wishlist = useWishlistStore();
  return (
    <WishlistContext.Provider value={wishlist}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlistContext() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlistContext must be used within WishlistProvider');
  return context;
}
