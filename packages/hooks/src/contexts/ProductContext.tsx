'use client';

import React, { createContext, useContext, useState } from 'react';
import type { Product, ProductFilter } from '@cinmax/types';

interface ProductContextValue {
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  activeFilter: ProductFilter;
  setActiveFilter: (filter: ProductFilter) => void;
}

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeFilter, setActiveFilter] = useState<ProductFilter>({});

  return (
    <ProductContext.Provider
      value={{ selectedProduct, setSelectedProduct, activeFilter, setActiveFilter }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProductContext() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProductContext must be used within ProductProvider');
  return context;
}
