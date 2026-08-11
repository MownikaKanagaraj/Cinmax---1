import type { ProductReview } from '@cinmax/types';

export interface CreateReviewPayload {
  productId: string;
  userId?: string;
  authorName: string;
  rating: number;
  title: string;
  content: string;
  scentRating?: number;
  latherRating?: number;
  moistureRating?: number;
}

export interface ModerateReviewPayload {
  reviewId: string;
  isApproved: boolean;
}
