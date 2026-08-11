import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@cinmax/types';
import { paginateArray, type PaginatedResult, type PaginationParams } from '../../pagination';
import { BlogPostEntity } from './entity';
import { BlogPostMapper } from './mapper';
import type { IBlogRepository, BlogFilter } from './repository.interface';

export class SupabaseBlogRepository implements IBlogRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  public async getAll(
    filter?: BlogFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<BlogPostEntity>> {
    let query = (this.supabase as any)
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (filter?.category) {
      query = query.eq('category', filter.category);
    }

    const { data, error } = await query;
    if (error) throw error;

    let entities = BlogPostMapper.toEntityList(data as any);

    if (filter?.tag) {
      entities = entities.filter((p) => p.tags.includes(filter.tag!));
    }
    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      entities = entities.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q)
      );
    }

    return paginateArray(entities, pagination);
  }

  public async getBySlug(slug: string): Promise<BlogPostEntity | null> {
    const { data, error } = await (this.supabase as any)
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error || !data) return null;
    return BlogPostMapper.toEntity(data as any);
  }

  public async getFeatured(): Promise<BlogPostEntity[]> {
    const { data, error } = await (this.supabase as any)
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .limit(3);

    if (error) throw error;
    return BlogPostMapper.toEntityList(data as any);
  }
}
