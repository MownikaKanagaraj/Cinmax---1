import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCouponService, queryKeys, type CouponEntity } from '@cinmax/api';

export function useCouponsQuery() {
  const couponService = useCouponService();

  return useQuery<CouponEntity[]>({
    queryKey: queryKeys.coupons.list(),
    queryFn: () => couponService.getAvailableCoupons(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useValidateCouponMutation() {
  const couponService = useCouponService();

  return useMutation({
    mutationFn: ({ code, subtotal }: { code: string; subtotal?: number }) =>
      couponService.validateCoupon(code, subtotal),
  });
}

export function useCreateCouponMutation() {
  const couponService = useCouponService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (coupon: any) => couponService.createCoupon(coupon),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.coupons.list() });
    },
  });
}

export function useDeactivateCouponMutation() {
  const couponService = useCouponService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => couponService.deactivateCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.coupons.list() });
    },
  });
}
