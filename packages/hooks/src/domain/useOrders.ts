import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  useOrderService,
  queryKeys,
  type OrderEntity,
  type OrderFilter,
  type PaginatedResult,
  type PaginationParams,
} from '@cinmax/api';

export function useOrdersQuery(
  filter?: OrderFilter,
  pagination?: PaginationParams,
  options?: { enabled?: boolean }
) {
  const orderService = useOrderService();

  return useQuery<PaginatedResult<OrderEntity>>({
    queryKey: [...queryKeys.orders.lists(), { filter, pagination }],
    queryFn: () => orderService.getOrders(filter, pagination),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 2,
  });
}

export function useOrderByIdQuery(id: string, options?: { enabled?: boolean }) {
  const orderService = useOrderService();

  return useQuery<OrderEntity>({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => orderService.getOrderById(id),
    enabled: Boolean(id) && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 2,
  });
}

export const useOrderQuery = useOrderByIdQuery;

export function useCreateOrderMutation() {
  const orderService = useOrderService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => orderService.createOrder(payload),
    onSuccess: (newOrder) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

export function useCancelOrderMutation() {
  const orderService = useOrderService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      orderService.cancelOrder(id, reason),
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.setQueryData(queryKeys.orders.detail(updatedOrder.id), updatedOrder);
    },
  });
}
