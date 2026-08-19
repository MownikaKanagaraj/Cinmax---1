import { QueryClient } from '@tanstack/react-query';

export function createCinmaxQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 10 minutes stale time — navigating between admin tabs won't re-fetch
        // unless data is actually stale. This makes tab switching feel instant.
        staleTime: 1000 * 60 * 10,
        // Keep unused data in memory for 60 minutes
        gcTime: 1000 * 60 * 60,
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        // Show cached data immediately while fetching fresh data in background
        placeholderData: (previousData: unknown) => previousData,
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

