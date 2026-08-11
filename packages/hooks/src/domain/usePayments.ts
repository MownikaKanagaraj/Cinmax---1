import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  usePaymentService,
  queryKeys,
  type CreatePaymentIntentPayload,
  type ConfirmPaymentPayload,
} from '@cinmax/api';

export function useSavedPaymentMethodsQuery(customerId?: string, options?: { enabled?: boolean }) {
  const paymentService = usePaymentService();

  return useQuery({
    queryKey: [...queryKeys.payments.methods(), customerId],
    queryFn: () => (customerId ? paymentService.getSavedPaymentMethods(customerId) : []),
    enabled: Boolean(customerId) && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreatePaymentIntentMutation() {
  const paymentService = usePaymentService();

  return useMutation({
    mutationFn: (payload: CreatePaymentIntentPayload) =>
      paymentService.createPaymentIntent(payload),
  });
}

export function useConfirmPaymentMutation() {
  const paymentService = usePaymentService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ConfirmPaymentPayload) => paymentService.confirmPayment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}
