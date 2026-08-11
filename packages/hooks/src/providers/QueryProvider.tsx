'use client';

import React, { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createCinmaxQueryClient } from '@cinmax/api';

export function QueryProvider({ children }: { children: any }) {
  const [queryClient] = useState(() => createCinmaxQueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
