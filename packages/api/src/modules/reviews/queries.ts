import type { SupabaseClient } from '@supabase/supabase-js';
import type { ProductReview } from '@cinmax/types';
import { ReviewService } from '../../services/reviews';

export async function fetchProductReviews(
  supabase: SupabaseClient,
  productId: string
): Promise<ProductReview[]> {
  const service = new ReviewService(supabase as any);
  return service.getReviewsByProduct(productId);
}

export async function fetchReviewsModerationQueue(
  supabase: SupabaseClient
): Promise<ProductReview[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_approved', false)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as unknown as ProductReview[];
}
