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

  public async updateStatus(id: string, status: ReviewStatus): Promise<ReviewEntity> {
    const isApproved = status === 'approved';
    const { data, error } = await this.supabase
      .from('reviews' as any)
      .update({ is_approved: isApproved, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return ReviewMapper.toEntity(data as any);
  }
}
