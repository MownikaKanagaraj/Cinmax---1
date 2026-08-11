import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, ProductReview } from '@cinmax/types';

export class ReviewService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getReviewsByProduct(productId: string): Promise<ProductReview[]> {
    const { data, error } = await this.supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((r) => ({
      id: r.id,
      productId: r.product_id,
      userId: r.user_id,
      authorName: r.author_name,
      rating: r.rating,
      title: r.title,
      content: r.content,
      scentRating: r.scent_rating || undefined,
      latherRating: r.lather_rating || undefined,
      moistureRating: r.moisture_rating || undefined,
      isVerifiedPurchaser: r.is_verified,
      helpfulCount: 0,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }
}
