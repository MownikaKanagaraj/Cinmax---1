export interface ProductReview {
  id: string;
  productId: string;
  userId?: string;
  authorName: string;
  rating: number; // 1 to 5
  title: string;
  content: string;
  scentRating?: number; // 1 to 5
  latherRating?: number; // 1 to 5
  moistureRating?: number; // 1 to 5
  isVerifiedPurchaser: boolean;
  isApproved?: boolean;
  images?: string[];
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRatingSummary {
  productId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  scentScore: number;
  latherScore: number;
  moistureScore: number;
}
