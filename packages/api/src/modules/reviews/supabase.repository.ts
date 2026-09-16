import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, ReviewStatus } from '@cinmax/types';
import { paginateArray, type PaginatedResult, type PaginationParams } from '../../pagination';
import { ReviewEntity } from './entity';
import { ReviewMapper } from './mapper';
import type { IReviewRepository } from './repository.interface';

export class SupabaseReviewRepository implements IReviewRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  public async getAllReviews(
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ReviewEntity>> {
    const { data, error } = await this.supabase
      .from('reviews' as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return { items: [], meta: { page: 1, pageSize: 20, totalCount: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false } };
    const entities = ReviewMapper.toEntityList(data as any);
    return paginateArray(entities, pagination);
  }

  public async getByProductId(
    productId: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ReviewEntity>> {
    const { data, error } = await this.supabase
      .from('reviews' as any)
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    const entities = ReviewMapper.toEntityList(data as any);
    return paginateArray(entities, pagination);
  }

  public async create(
    review: Omit<ReviewEntity, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ReviewEntity> {
    const dtoData: any = {
      product_id: review.productId,
      user_id: review.userId,
      author_name: review.authorName,
      rating: review.rating,
      title: review.title,
      content: review.content,
      scent_rating: review.scentRating ?? null,
      lather_rating: review.latherRating ?? null,
      moisture_rating: review.moistureRating ?? null,
      is_verified_purchaser: review.isVerifiedPurchaser,
      helpful_count: review.helpfulCount,
      images: review.images ?? null,
    };

    const { data, error } = await this.supabase
      .from('reviews' as any)
      .insert(dtoData)
      .select('*')
      .single();

    if (error) throw error;
    return ReviewMapper.toEntity(data as any);
  }

  public static REVIEW_REWARD_POINTS = 4;

  public async updateStatus(id: string, status: ReviewStatus): Promise<ReviewEntity> {
    const isApproved = status === 'approved';
    const { data, error } = await this.supabase
      .from('reviews' as any)
      .update({ is_approved: isApproved, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;

    // Award loyalty points for approved review (duplicate proof)
    if (isApproved && data?.user_id) {
      try {
        const reviewUserId = data.user_id;
        const reviewPoints = SupabaseReviewRepository.REVIEW_REWARD_POINTS;
        const desc = `Approved product review bonus (Review #${id})`;

        const { data: rpcRes, error: rpcErr } = await this.supabase.rpc('process_loyalty_transaction', {
          p_user_id: reviewUserId,
          p_order_id: null,
          p_transaction_type: 'REVIEW',
          p_points: reviewPoints,
          p_description: desc,
        });

        if (rpcErr) {
          // Fallback duplicate check if RPC unavailable
          const { data: existingTx } = await this.supabase
            .from('loyalty_transactions' as any)
            .select('id')
            .eq('user_id', reviewUserId)
            .eq('transaction_type', 'REVIEW')
            .ilike('description', `%${id}%`)
            .maybeSingle();

          if (!existingTx) {
            const { data: profile } = await this.supabase
              .from('profiles' as any)
              .select('loyalty_points')
              .eq('id', reviewUserId)
              .maybeSingle();

            const currentPoints = Math.max(0, Number(profile?.loyalty_points) || 0);
            const newBal = currentPoints + reviewPoints;

            await this.supabase.from('loyalty_transactions' as any).insert({
              user_id: reviewUserId,
              transaction_type: 'REVIEW',
              points: reviewPoints,
              balance_after: newBal,
              description: desc,
            });
            await this.supabase.from('profiles' as any).update({ loyalty_points: newBal }).eq('id', reviewUserId);
          }
        }
      } catch (err) {
        console.error('Error awarding review loyalty points:', err);
      }
    }

    return ReviewMapper.toEntity(data as any);
  }
}
