export interface BlogFilter {
  category?: string;
  tag?: string;
  searchQuery?: string;
}

import type { PaginatedResult, PaginationParams } from '../../pagination';
import { BlogPostEntity } from './entity';

export interface IBlogRepository {
  getAll(filter?: BlogFilter, pagination?: PaginationParams): Promise<PaginatedResult<BlogPostEntity>>;
  getBySlug(slug: string): Promise<BlogPostEntity | null>;
  getFeatured(): Promise<BlogPostEntity[]>;
}
