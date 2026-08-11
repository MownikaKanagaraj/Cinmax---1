import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  useReviewService,
  queryKeys,
  type ReviewEntity,
  type PaginatedResult,
  type PaginationParams,
} from '@cinmax/api';

export function useReviewsQuery(
  pagination?: PaginationParams,
  options?: { enabled?: boolean }
) {
  const reviewService = useReviewService();

  return useQuery<PaginatedResult<ReviewEntity>>({
    queryKey: [...queryKeys.reviews.all, { pagination }],
    queryFn: () => reviewService.getAllReviews(pagination),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductReviewsQuery(
  productId: string,
  pagination?: PaginationParams,
  options?: { enabled?: boolean }
) {
  const reviewService = useReviewService();

  return useQuery<PaginatedResult<ReviewEntity>>({
    queryKey: [...queryKeys.reviews.byProduct(productId), { pagination }],
    queryFn: () => reviewService.getProductReviews(productId, pagination),
    enabled: Boolean(productId) && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateReviewStatusMutation() {
  const reviewService = useReviewService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: any }) =>
      reviewService.updateReviewStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
    },
  });
}

export function useSubmitReviewMutation() {
  const reviewService = useReviewService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (review: Omit<ReviewEntity, 'id' | 'createdAt' | 'updatedAt' | 'isPositive'>) =>
      reviewService.submitReview(review as any),
    onSuccess: (newReview) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.byProduct(newReview.productId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(newReview.productId),
      });
    },
  });
}
