import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useWishlistService, queryKeys, type WishlistEntity } from '@cinmax/api';

export function useWishlistDomainQuery(userId?: string | null) {
  const wishlistService = useWishlistService();

  return useQuery<WishlistEntity>({
    queryKey: queryKeys.wishlist.user(userId ?? undefined),
    queryFn: () => wishlistService.getWishlist(userId),
    staleTime: 1000 * 60 * 5,
  });
}

export const useWishlistQuery = useWishlistDomainQuery;

export function useIsInWishlistDomainQuery(userId: string | null, productId: string) {
  const wishlistService = useWishlistService();

  return useQuery<boolean>({
    queryKey: [...queryKeys.wishlist.user(userId ?? undefined), 'item', productId],
    queryFn: () => wishlistService.isInWishlist(userId, productId),
    enabled: Boolean(productId),
    staleTime: 1000 * 60 * 2,
  });
}

export function useAddWishlistMutation() {
  const wishlistService = useWishlistService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, productId }: { userId: string | null; productId: string }) =>
      wishlistService.add(userId, productId),
    onSuccess: (updatedWishlist) => {
      queryClient.setQueryData(
        queryKeys.wishlist.user(updatedWishlist.userId ?? undefined),
        updatedWishlist
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
    },
  });
}

export function useRemoveWishlistMutation() {
  const wishlistService = useWishlistService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, productId }: { userId: string | null; productId: string }) =>
      wishlistService.remove(userId, productId),
    onSuccess: (updatedWishlist) => {
      queryClient.setQueryData(
        queryKeys.wishlist.user(updatedWishlist.userId ?? undefined),
        updatedWishlist
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
    },
  });
}

export function useToggleWishlistDomainMutation() {
  const wishlistService = useWishlistService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, productId }: { userId: string | null; productId: string }) =>
      wishlistService.toggleItem(userId, productId),
    onSuccess: (updatedWishlist) => {
      queryClient.setQueryData(
        queryKeys.wishlist.user(updatedWishlist.userId ?? undefined),
        updatedWishlist
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
    },
  });
}

export function useMoveWishlistToCartMutation() {
  const wishlistService = useWishlistService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, productId }: { userId: string | null; productId: string }) =>
      wishlistService.moveToCart(userId, productId),
    onSuccess: (updatedWishlist) => {
      queryClient.setQueryData(
        queryKeys.wishlist.user(updatedWishlist.userId ?? undefined),
        updatedWishlist
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

export function useClearWishlistDomainMutation() {
  const wishlistService = useWishlistService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId?: string | null }) => wishlistService.clearWishlist(userId),
    onSuccess: (updatedWishlist) => {
      queryClient.setQueryData(
        queryKeys.wishlist.user(updatedWishlist.userId ?? undefined),
        updatedWishlist
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
    },
  });
}

export function useShareWishlistMutation() {
  const wishlistService = useWishlistService();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) => wishlistService.shareWishlist(userId),
  });
}
