import type { QueryClient } from '@tanstack/react-query';

/**
 * Optimistic update helper for collection queries
 */
export async function performOptimisticUpdate<TData, TItem>(
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  updater: (oldData: TData | undefined) => TData
): Promise<{ previousData: TData | undefined }> {
  await queryClient.cancelQueries({ queryKey });
  const previousData = queryClient.getQueryData<TData>(queryKey);
  queryClient.setQueryData<TData>(queryKey, updater);
  return { previousData };
}

/**
 * Invalidation helper to refresh related cache trees after mutations
 */
export async function invalidateCacheKeys(
  queryClient: QueryClient,
  keys: (readonly unknown[])[]
): Promise<void> {
  await Promise.all(
    keys.map((queryKey) => queryClient.invalidateQueries({ queryKey }))
  );
}
