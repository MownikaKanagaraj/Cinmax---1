import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@cinmax/types';
import { CategoryEntity } from './entity';
import { CategoryMapper } from './mapper';
import type { ICategoryRepository } from './repository.interface';

export class SupabaseCategoryRepository implements ICategoryRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  public async getAll(): Promise<CategoryEntity[]> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw new Error(`Supabase Category Query Error: ${error.message}`);
    return (data || []).map((row: any) => CategoryMapper.toEntity(row));
  }

  public async getCategories(): Promise<CategoryEntity[]> {
    return this.getAll();
  }

  public async getBySlug(slug: string): Promise<CategoryEntity | null> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw new Error(`Supabase Category Query Error: ${error.message}`);
    if (!data) return null;
    return CategoryMapper.toEntity(data);
  }

  public async getCategoryBySlug(slug: string): Promise<CategoryEntity | null> {
    return this.getBySlug(slug);
  }

  public async getById(id: string): Promise<CategoryEntity | null> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(`Supabase Category Query Error: ${error.message}`);
    if (!data) return null;
    return CategoryMapper.toEntity(data);
  }

  public async getCategory(id: string): Promise<CategoryEntity | null> {
    return this.getById(id);
  }

  public async getFeaturedCategories(limit = 4): Promise<CategoryEntity[]> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .limit(limit);

    if (error) throw new Error(`Supabase Category Query Error: ${error.message}`);
    return (data || []).map((row: any) => CategoryMapper.toEntity(row));
  }
}
