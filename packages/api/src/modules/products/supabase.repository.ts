import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, ProductFilter } from '@cinmax/types';
import { paginateArray, type PaginatedResult, type PaginationParams } from '../../pagination';
import { ProductNotFoundError } from '../../errors';
import { ProductEntity } from './entity';
import { ProductMapper } from './mapper';
import type { IProductRepository } from './repository.interface';

export class SupabaseProductRepository implements IProductRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  private get baseSelectQuery() {
    return this.supabase.from('products').select(`
      *,
      category:categories(*),
      variants:product_variants(*),
      images:product_images(*),
      ingredients:ingredients(*)
    `);
  }

  public async getAll(
    filter?: ProductFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    let query = this.baseSelectQuery.eq('is_active', true);

    if (filter?.searchQuery) {
      const q = filter.searchQuery.trim();
      if (q) {
        query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,subtitle.ilike.%${q}%`);
      }
    }

    if (filter?.categorySlug) {
      const { data: catData } = await this.supabase
        .from('categories')
        .select('id')
        .eq('slug', filter.categorySlug)
        .maybeSingle();

      if (catData?.id) {
        query = query.eq('category_id', catData.id);
      }
    }

    if (filter?.categoryId) {
      query = query.eq('category_id', filter.categoryId);
    }

    if (filter?.skinType && filter.skinType !== 'all') {
      query = query.contains('skin_types', [filter.skinType]);
    }

    if (filter?.fragranceFamily && (filter.fragranceFamily as string) !== 'all') {
      query = query.eq('fragrance_family', filter.fragranceFamily);
    }

    if (filter?.minPrice !== undefined) {
      query = query.gte('base_price', filter.minPrice);
    }

    if (filter?.maxPrice !== undefined) {
      query = query.lte('base_price', filter.maxPrice);
    }

    if (filter?.isFeatured) {
      query = query.eq('is_featured', true);
    }

    if (filter?.isNew) {
      query = query.eq('is_new', true);
    }

    // Sorting strategies
    switch (filter?.sortBy) {
      case 'price-asc':
        query = query.order('base_price', { ascending: true });
        break;
      case 'price-desc':
        query = query.order('base_price', { ascending: false });
        break;
      case 'rating':
        query = query.order('average_rating', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'popularity':
      case 'best-seller':
        query = query.order('average_rating', { ascending: false }).order('review_count', { ascending: false });
        break;
      default:
        query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
        break;
    }

    const { data, error } = await query;
    if (error) throw new Error(`Supabase Database Error: ${error.message}`);

    const entities = (data || []).map((row: any) => ProductMapper.toEntity(row));
    return paginateArray(entities, pagination);
  }

  public async getProducts(
    filter?: ProductFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.getAll(filter, pagination);
  }

  public async getFeatured(limit = 6): Promise<ProductEntity[]> {
    const { data, error } = await this.baseSelectQuery
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Supabase Database Error: ${error.message}`);
    return (data || []).map((row: any) => ProductMapper.toEntity(row));
  }

  public async getFeaturedProducts(limit = 6): Promise<ProductEntity[]> {
    return this.getFeatured(limit);
  }

  public async getNewArrivals(limit = 6): Promise<ProductEntity[]> {
    const { data, error } = await this.baseSelectQuery
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Supabase Database Error: ${error.message}`);
    return (data || []).map((row: any) => ProductMapper.toEntity(row));
  }

  public async getBestSellers(limit = 6): Promise<ProductEntity[]> {
    const { data, error } = await this.baseSelectQuery
      .eq('is_active', true)
      .order('average_rating', { ascending: false })
      .order('review_count', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Supabase Database Error: ${error.message}`);
    return (data || []).map((row: any) => ProductMapper.toEntity(row));
  }

  public async getBySlug(slug: string): Promise<ProductEntity | null> {
    const { data, error } = await this.baseSelectQuery
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw new Error(`Supabase Database Error: ${error.message}`);
    if (!data) return null;
    return ProductMapper.toEntity(data);
  }

  public async getProductBySlug(slug: string): Promise<ProductEntity | null> {
    return this.getBySlug(slug);
  }

  public async getById(id: string): Promise<ProductEntity | null> {
    const { data, error } = await this.baseSelectQuery
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(`Supabase Database Error: ${error.message}`);
    if (!data) return null;
    return ProductMapper.toEntity(data);
  }

  public async getProductById(id: string): Promise<ProductEntity | null> {
    return this.getById(id);
  }

  public async getByCategory(
    categorySlug: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.getAll({ categorySlug }, pagination);
  }

  public async getProductsByCategory(
    categorySlug: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.getByCategory(categorySlug, pagination);
  }

  public async getProductsByCollection(
    collectionSlug: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.getAll({ categorySlug: collectionSlug }, pagination);
  }

  public async search(
    query: string,
    filter?: ProductFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.getAll({ ...filter, searchQuery: query }, pagination);
  }

  public async searchProducts(
    query: string,
    filter?: ProductFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.search(query, filter, pagination);
  }

  public async filterProducts(
    filter: ProductFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.getAll(filter, pagination);
  }

  public async getRelatedProducts(
    productIdOrSlug: string,
    limit = 4
  ): Promise<ProductEntity[]> {
    const targetProduct = (await this.getById(productIdOrSlug)) || (await this.getBySlug(productIdOrSlug));
    if (!targetProduct) return this.getFeaturedProducts(limit);

    const { data, error } = await this.baseSelectQuery
      .eq('is_active', true)
      .eq('category_id', targetProduct.categoryId)
      .neq('id', targetProduct.id)
      .limit(limit);

    if (error || !data || data.length === 0) {
      return this.getFeaturedProducts(limit);
    }
    return data.map((row: any) => ProductMapper.toEntity(row));
  }

  public async getRecommendedProducts(
    productIdOrSlug: string,
    limit = 4
  ): Promise<ProductEntity[]> {
    return this.getRelatedProducts(productIdOrSlug, limit);
  }
}
