import type { PaginatedResult, PaginationParams } from '../../pagination';
import { ReviewEntity } from './entity';
import type { IReviewRepository } from './repository.interface';

export class GetProductReviewsUseCase {
  constructor(private reviewRepo: IReviewRepository) {}

  public async execute(
    productId: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ReviewEntity>> {
    return this.reviewRepo.getByProductId(productId, pagination);
  }
}

export class SubmitReviewUseCase {
  constructor(private reviewRepo: IReviewRepository) {}

  public async execute(
    review: Omit<ReviewEntity, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ReviewEntity> {
    return this.reviewRepo.create(review);
  }
}
