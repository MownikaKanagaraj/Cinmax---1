'use client';

import React, { createContext, useContext, useState } from 'react';
import type { Order } from '@cinmax/types';

interface OrderContextValue {
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  return (
    <OrderContext.Provider value={{ activeOrder, setActiveOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrderContext() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrderContext must be used within OrderProvider');
  return context;
}
