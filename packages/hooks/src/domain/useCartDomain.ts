import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCartService, queryKeys, type CartEntity } from '@cinmax/api';
import type { Product, ProductVariant } from '@cinmax/types';

export function useCartDomainQuery(userIdOrAnonId?: string | null) {
  const cartService = useCartService();

  return useQuery<CartEntity>({
    queryKey: queryKeys.cart.active(userIdOrAnonId ?? undefined),
    queryFn: () => cartService.getCart(userIdOrAnonId),
    staleTime: 1000 * 30, // 30 seconds
  });
}

export const useCartQuery = useCartDomainQuery;

export function useCalculateCartTotalsQuery(userIdOrAnonId?: string | null) {
  const cartService = useCartService();

  return useQuery({
    queryKey: [...queryKeys.cart.all, 'totals', userIdOrAnonId],
    queryFn: () => cartService.calculateTotals(userIdOrAnonId ?? null),
    staleTime: 1000 * 15,
  });
}

export function useAddToCartDomainMutation() {
  const cartService = useCartService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userIdOrAnonId,
      product,
      variant,
      quantity = 1,
    }: {
      userIdOrAnonId: string | null;
      product: Product;
      variant?: ProductVariant;
      quantity?: number;
    }) => cartService.addItem(userIdOrAnonId, product, variant, quantity),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(
        queryKeys.cart.active(updatedCart.userId || updatedCart.anonymousId || undefined),
        updatedCart
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

export function useUpdateCartItemDomainMutation() {
  const cartService = useCartService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userIdOrAnonId,
      itemId,
      quantity,
    }: {
      userIdOrAnonId: string | null;
      itemId: string;
      quantity: number;
    }) => cartService.updateQuantity(userIdOrAnonId, itemId, quantity),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(
        queryKeys.cart.active(updatedCart.userId || updatedCart.anonymousId || undefined),
        updatedCart
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

export function useRemoveCartItemDomainMutation() {
  const cartService = useCartService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userIdOrAnonId,
      itemId,
    }: {
      userIdOrAnonId: string | null;
      itemId: string;
    }) => cartService.removeItem(userIdOrAnonId, itemId),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(
        queryKeys.cart.active(updatedCart.userId || updatedCart.anonymousId || undefined),
        updatedCart
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

export function useApplyCouponDomainMutation() {
  const cartService = useCartService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userIdOrAnonId,
      code,
    }: {
      userIdOrAnonId: string | null;
      code: string;
    }) => cartService.applyCoupon(userIdOrAnonId, code),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(
        queryKeys.cart.active(updatedCart.userId || updatedCart.anonymousId || undefined),
        updatedCart
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

export function useRemoveCouponDomainMutation() {
  const cartService = useCartService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userIdOrAnonId }: { userIdOrAnonId: string | null }) =>
      cartService.removeCoupon(userIdOrAnonId),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(
        queryKeys.cart.active(updatedCart.userId || updatedCart.anonymousId || undefined),
        updatedCart
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

export function useClearCartDomainMutation() {
  const cartService = useCartService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userIdOrAnonId }: { userIdOrAnonId: string | null }) =>
      cartService.clearCart(userIdOrAnonId),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(
        queryKeys.cart.active(updatedCart.userId || updatedCart.anonymousId || undefined),
        updatedCart
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

export function useMergeGuestCartMutation() {
  const cartService = useCartService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ guestAnonId, loggedUserId }: { guestAnonId: string; loggedUserId: string }) =>
      cartService.mergeGuestCart(guestAnonId, loggedUserId),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(
        queryKeys.cart.active(updatedCart.userId || undefined),
        updatedCart
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

export function useSaveForLaterMutation() {
  const cartService = useCartService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userIdOrAnonId, itemId }: { userIdOrAnonId: string | null; itemId: string }) =>
      cartService.saveForLater(userIdOrAnonId, itemId),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(
        queryKeys.cart.active(updatedCart.userId || updatedCart.anonymousId || undefined),
        updatedCart
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

export function useMoveToWishlistMutation() {
  const cartService = useCartService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userIdOrAnonId, itemId }: { userIdOrAnonId: string | null; itemId: string }) =>
      cartService.moveToWishlist(userIdOrAnonId, itemId),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(
        queryKeys.cart.active(updatedCart.userId || updatedCart.anonymousId || undefined),
        updatedCart
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
    },
  });
}
