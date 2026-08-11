import type { ProductFilter } from '@cinmax/types';
import { mockProductsData } from '../../mockData';
import { paginateArray, type PaginatedResult, type PaginationParams } from '../../pagination';
import { ProductEntity } from './entity';
import type { IProductRepository } from './repository.interface';

export class MockProductRepository implements IProductRepository {
  private products: ProductEntity[];

  constructor(initialData?: ProductEntity[]) {
    this.products = initialData || mockProductsData.map((p) => new ProductEntity(p));
  }

  public async getAll(
    filter?: ProductFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    let filtered = [...this.products];

    if (filter?.categorySlug && filter.categorySlug !== 'all') {
      filtered = filtered.filter((p) => p.category?.slug === filter.categorySlug);
    }

    if (filter?.skinType && filter.skinType !== 'all') {
      filtered = filtered.filter((p) => p.skinTypes.includes(filter.skinType as any));
    }

    if (filter?.fragranceFamily) {
      filtered = filtered.filter((p) => p.fragranceFamily === filter.fragranceFamily);
    }

    if (filter?.processType) {
      filtered = filtered.filter((p) => p.processType === filter.processType);
    }

    if (filter?.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.basePrice >= (filter.minPrice || 0));
    }

    if (filter?.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.basePrice <= (filter.maxPrice || Infinity));
    }

    if (filter?.inStockOnly) {
      filtered = filtered.filter((p) => p.isInStock);
    }

    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q)
      );
    }

    if (filter?.sortBy === 'price-asc') {
      filtered.sort((a, b) => a.basePrice - b.basePrice);
    } else if (filter?.sortBy === 'price-desc') {
      filtered.sort((a, b) => b.basePrice - a.basePrice);
    } else if (filter?.sortBy === 'rating') {
      filtered.sort((a, b) => b.averageRating - a.averageRating);
    } else if (filter?.sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      // Default: featured first
      filtered.sort((a, b) => (b.isFeatured === a.isFeatured ? 0 : b.isFeatured ? 1 : -1));
    }

    return paginateArray(filtered, pagination);
  }

  public async getProducts(
    filter?: ProductFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.getAll(filter, pagination);
  }

  public async getFeatured(limit = 4): Promise<ProductEntity[]> {
    return this.products.filter((p) => p.isFeatured).slice(0, limit);
  }

  public async getFeaturedProducts(limit = 4): Promise<ProductEntity[]> {
    return this.getFeatured(limit);
  }

  public async getNewArrivals(limit = 4): Promise<ProductEntity[]> {
    return [...this.products]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  public async getBestSellers(limit = 4): Promise<ProductEntity[]> {
    return [...this.products]
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, limit);
  }

  public async getBySlug(slug: string): Promise<ProductEntity | null> {
    const product = this.products.find((p) => p.slug === slug);
    return product || null;
  }

  public async getProductBySlug(slug: string): Promise<ProductEntity | null> {
    return this.getBySlug(slug);
  }

  public async getById(id: string): Promise<ProductEntity | null> {
    const product = this.products.find((p) => p.id === id);
    return product || null;
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
    return this.getByCategory(collectionSlug, pagination);
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
    const p = (await this.getById(productIdOrSlug)) || (await this.getBySlug(productIdOrSlug));
    if (!p) return this.getFeatured(limit);
    return this.products
      .filter((item) => item.categoryId === p.categoryId && item.id !== p.id)
      .slice(0, limit);
  }

  public async getRecommendedProducts(
    productIdOrSlug: string,
    limit = 4
  ): Promise<ProductEntity[]> {
    return this.getRelatedProducts(productIdOrSlug, limit);
  }
}
