import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  useOrderService,
  queryKeys,
  CheckoutEngine,
  RazorpayProvider,
  type CreateCheckoutSessionInput,
  type VerifyPaymentPayload,
  type OrderEntity,
} from '@cinmax/api';
import type { OrderStatus } from '@cinmax/types';

export function useCheckoutSessionMutation() {
  return useMutation({
    mutationFn: (input: CreateCheckoutSessionInput) => CheckoutEngine.createCheckoutSession(input),
  });
}

export function useVerifyPaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: VerifyPaymentPayload) => {
      const razorpayProvider = new RazorpayProvider();
      return razorpayProvider.verifyPayment(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

export function useOrderInvoiceQuery(order?: OrderEntity | null) {
  const orderService = useOrderService();

  return useQuery({
    queryKey: [...queryKeys.orders.all, 'invoice', order?.id],
    queryFn: () => (order ? orderService.generateInvoice(order) : null),
    enabled: Boolean(order),
    staleTime: 1000 * 60 * 10,
  });
}

export function useUpdateOrderStatusMutation() {
  const orderService = useOrderService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      reason,
      trackingNumber,
      carrier,
      estimatedDeliveryDate,
    }: {
      id: string;
      status: OrderStatus;
      reason?: string;
      trackingNumber?: string;
      carrier?: string;
      estimatedDeliveryDate?: string;
    }) =>
      orderService.updateStatus(id, status, reason, undefined, trackingNumber, carrier, estimatedDeliveryDate),
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.setQueryData(queryKeys.orders.detail(updatedOrder.id), updatedOrder);
    },
  });
}

export function useReturnOrderMutation() {
  const orderService = useOrderService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      orderService.returnOrder(id, reason),
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.setQueryData(queryKeys.orders.detail(updatedOrder.id), updatedOrder);
    },
  });
}
