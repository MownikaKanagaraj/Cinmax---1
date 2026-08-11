import type { PaginatedResult, PaginationParams } from '../../pagination';
import { BlogPostNotFoundError } from '../../errors';
import { BlogPostEntity } from './entity';
import type { IBlogRepository, BlogFilter } from './repository.interface';

export class GetBlogPostsUseCase {
  constructor(private blogRepo: IBlogRepository) {}

  public async execute(
    filter?: BlogFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<BlogPostEntity>> {
    return this.blogRepo.getAll(filter, pagination);
  }
}

export class GetBlogPostBySlugUseCase {
  constructor(private blogRepo: IBlogRepository) {}

  public async execute(slug: string): Promise<BlogPostEntity> {
    const post = await this.blogRepo.getBySlug(slug);
    if (!post) {
      throw new BlogPostNotFoundError(slug);
    }
    return post;
  }
}

export class GetFeaturedBlogPostsUseCase {
  constructor(private blogRepo: IBlogRepository) {}

  public async execute(): Promise<BlogPostEntity[]> {
    return this.blogRepo.getFeatured();
  }
}
