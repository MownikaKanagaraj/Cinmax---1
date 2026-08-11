import { mockBlogPostsData } from '../../mockData';
import { paginateArray, type PaginatedResult, type PaginationParams } from '../../pagination';
import { BlogPostEntity } from './entity';
import type { IBlogRepository, BlogFilter } from './repository.interface';

export class MockBlogRepository implements IBlogRepository {
  private posts: BlogPostEntity[];

  constructor(initialData?: BlogPostEntity[]) {
    this.posts = initialData || mockBlogPostsData.map((p) => new BlogPostEntity(p));
  }

  public async getAll(
    filter?: BlogFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<BlogPostEntity>> {
    let filtered = this.posts.filter((p) => p.isPublished);

    if (filter?.category) {
      filtered = filtered.filter((p) => p.category === filter.category);
    }

    if (filter?.tag) {
      filtered = filtered.filter((p) => p.tags.includes(filter.tag!));
    }

    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    filtered.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return paginateArray(filtered, pagination);
  }

  public async getBySlug(slug: string): Promise<BlogPostEntity | null> {
    const post = this.posts.find((p) => p.slug === slug && p.isPublished);
    return post || null;
  }

  public async getFeatured(): Promise<BlogPostEntity[]> {
    return this.posts.filter((p) => p.isPublished).slice(0, 3);
  }
}
