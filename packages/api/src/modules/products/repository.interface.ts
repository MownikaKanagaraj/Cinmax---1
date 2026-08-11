import type { Product, ProductFilter } from '@cinmax/types';
import type { PaginatedResult, PaginationParams } from '../../pagination';
import { ProductEntity } from './entity';

export type { ProductFilter };

export interface IProductRepository {
  // Legacy / standard method signatures
  getAll(filter?: ProductFilter, pagination?: PaginationParams): Promise<PaginatedResult<ProductEntity>>;
  getFeatured(limit?: number): Promise<ProductEntity[]>;
  getBySlug(slug: string): Promise<ProductEntity | null>;
  getById(id: string): Promise<ProductEntity | null>;
  getByCategory(categorySlug: string, pagination?: PaginationParams): Promise<PaginatedResult<ProductEntity>>;
  search(query: string, filter?: ProductFilter, pagination?: PaginationParams): Promise<PaginatedResult<ProductEntity>>;

  // Task 2 explicit domain methods
  getProducts(filter?: ProductFilter, pagination?: PaginationParams): Promise<PaginatedResult<ProductEntity>>;
  getFeaturedProducts(limit?: number): Promise<ProductEntity[]>;
  getNewArrivals(limit?: number): Promise<ProductEntity[]>;
  getBestSellers(limit?: number): Promise<ProductEntity[]>;
  getProductById(id: string): Promise<ProductEntity | null>;
  getProductBySlug(slug: string): Promise<ProductEntity | null>;
  searchProducts(query: string, filter?: ProductFilter, pagination?: PaginationParams): Promise<PaginatedResult<ProductEntity>>;
  filterProducts(filter: ProductFilter, pagination?: PaginationParams): Promise<PaginatedResult<ProductEntity>>;
  getRelatedProducts(productIdOrSlug: string, limit?: number): Promise<ProductEntity[]>;
  getProductsByCollection(collectionSlug: string, pagination?: PaginationParams): Promise<PaginatedResult<ProductEntity>>;
  getRecommendedProducts(productIdOrSlug: string, limit?: number): Promise<ProductEntity[]>;
}
