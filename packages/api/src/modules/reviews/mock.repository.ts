import type { ReviewStatus } from '@cinmax/types';
import { mockReviewsData } from '../../mockData';
import { paginateArray, type PaginatedResult, type PaginationParams } from '../../pagination';
import { ReviewEntity } from './entity';
import type { IReviewRepository } from './repository.interface';

export class MockReviewRepository implements IReviewRepository {
  private reviews: ReviewEntity[];

  constructor(initialData?: ReviewEntity[]) {
    this.reviews = initialData || mockReviewsData.map((r) => new ReviewEntity(r));
  }

  public async getAllReviews(
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ReviewEntity>> {
    return paginateArray(this.reviews, pagination);
  }

  public async getByProductId(
    productId: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ReviewEntity>> {
    const filtered = this.reviews.filter((r) => r.productId === productId);
    return paginateArray(filtered, pagination);
  }

  public async create(
    review: Omit<ReviewEntity, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ReviewEntity> {
    const newEntity = new ReviewEntity({
      ...review,
      id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    this.reviews.push(newEntity);
    return newEntity;
  }

  public async updateStatus(id: string, status: ReviewStatus): Promise<ReviewEntity> {
    const index = this.reviews.findIndex((r) => r.id === id);
    const isApproved = status === 'approved';
    if (index !== -1) {
      const updated = new ReviewEntity({
        ...this.reviews[index],
        isApproved,
        updatedAt: new Date().toISOString(),
      });
      this.reviews[index] = updated;
      return updated;
    }
    return new ReviewEntity({
      id,
      productId: 'p1',
      authorName: 'Patron Reviewer',
      rating: 5,
      title: 'Artisanal Review',
      content: 'Excellent formulation.',
      isVerifiedPurchaser: true,
      isApproved,
      helpfulCount: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}
