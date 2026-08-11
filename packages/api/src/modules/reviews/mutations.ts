import type { SupabaseClient } from '@supabase/supabase-js';
import type { CreateReviewPayload, ModerateReviewPayload } from './types';

export async function createReview(
  supabase: SupabaseClient,
  payload: CreateReviewPayload
) {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      product_id: payload.productId,
      user_id: payload.userId,
      author_name: payload.authorName,
      rating: payload.rating,
      title: payload.title,
      content: payload.content,
      scent_rating: payload.scentRating,
      lather_rating: payload.latherRating,
      moisture_rating: payload.moistureRating,
      is_approved: false, // Default to moderation queue
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function moderateReview(
  supabase: SupabaseClient,
  payload: ModerateReviewPayload
) {
  const { data, error } = await supabase
    .from('reviews')
    .update({ is_approved: payload.isApproved })
    .eq('id', payload.reviewId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
