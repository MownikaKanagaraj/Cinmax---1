import type { ReviewStatus } from '@cinmax/types';
import type { PaginatedResult, PaginationParams } from '../../pagination';
import { ReviewEntity } from './entity';

export interface IReviewRepository {
  getAllReviews(pagination?: PaginationParams): Promise<PaginatedResult<ReviewEntity>>;
  getByProductId(productId: string, pagination?: PaginationParams): Promise<PaginatedResult<ReviewEntity>>;
  create(review: Omit<ReviewEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ReviewEntity>;
  updateStatus(id: string, status: ReviewStatus): Promise<ReviewEntity>;
}
