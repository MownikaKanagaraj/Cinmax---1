import type { IReviewRepository, ReviewEntity } from '../modules/reviews';
import type { PaginatedResult, PaginationParams } from '../pagination';
import { GetProductReviewsUseCase, SubmitReviewUseCase } from '../modules/reviews/useCases';

export class ReviewService {
  private getReviewsUseCase: GetProductReviewsUseCase;
  private submitReviewUseCase: SubmitReviewUseCase;

  constructor(private reviewRepo: IReviewRepository) {
    this.getReviewsUseCase = new GetProductReviewsUseCase(reviewRepo);
    this.submitReviewUseCase = new SubmitReviewUseCase(reviewRepo);
  }

  public async getProductReviews(
    productId: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ReviewEntity>> {
    return this.getReviewsUseCase.execute(productId, pagination);
  }

  public async getAllReviews(
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ReviewEntity>> {
    return this.reviewRepo.getAllReviews(pagination);
  }

  public async updateReviewStatus(
    id: string,
    status: any
  ): Promise<ReviewEntity> {
    return this.reviewRepo.updateStatus(id, status);
  }

  public async submitReview(
    review: Omit<ReviewEntity, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ReviewEntity> {
    return this.submitReviewUseCase.execute(review);
  }
}
