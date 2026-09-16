import type { IProductRepository, ProductFilter, ProductEntity } from '../modules/products';
import type { ICategoryRepository, CategoryEntity } from '../modules/categories';
import type { PaginatedResult, PaginationParams } from '../pagination';
import {
  GetProductsUseCase,
  GetProductByIdUseCase,
  GetProductBySlugUseCase,
  GetFeaturedProductsUseCase,
  GetProductsByCategoryUseCase,
  SearchProductsUseCase,
} from '../modules/products/useCases';
import { GetCategoriesUseCase, GetCategoryBySlugUseCase } from '../modules/categories/useCases';

export class ProductService {
  private getProductsUseCase: GetProductsUseCase;
  private getProductByIdUseCase: GetProductByIdUseCase;
  private getProductBySlugUseCase: GetProductBySlugUseCase;
  private getFeaturedProductsUseCase: GetFeaturedProductsUseCase;
  private getProductsByCategoryUseCase: GetProductsByCategoryUseCase;
  private searchProductsUseCase: SearchProductsUseCase;
  private getCategoriesUseCase: GetCategoriesUseCase;
  private getCategoryBySlugUseCase: GetCategoryBySlugUseCase;

  constructor(
    private productRepo: IProductRepository,
    private categoryRepo: ICategoryRepository
  ) {
    this.getProductsUseCase = new GetProductsUseCase(productRepo);
    this.getProductByIdUseCase = new GetProductByIdUseCase(productRepo);
    this.getProductBySlugUseCase = new GetProductBySlugUseCase(productRepo);
    this.getFeaturedProductsUseCase = new GetFeaturedProductsUseCase(productRepo);
    this.getProductsByCategoryUseCase = new GetProductsByCategoryUseCase(productRepo);
    this.searchProductsUseCase = new SearchProductsUseCase(productRepo);
    this.getCategoriesUseCase = new GetCategoriesUseCase(categoryRepo);
    this.getCategoryBySlugUseCase = new GetCategoryBySlugUseCase(categoryRepo);
  }

  public async getProducts(
    filter?: ProductFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.getProductsUseCase.execute(filter, pagination);
  }

  public async getProductById(id: string): Promise<ProductEntity> {
    return this.getProductByIdUseCase.execute(id);
  }

  public async getProductBySlug(slug: string): Promise<ProductEntity> {
    return this.getProductBySlugUseCase.execute(slug);
  }

  public async getFeaturedProducts(limit = 6): Promise<ProductEntity[]> {
    return this.getFeaturedProductsUseCase.execute(limit);
  }

  public async getNewArrivals(limit = 6): Promise<ProductEntity[]> {
    return this.productRepo.getNewArrivals(limit);
  }

  public async getBestSellers(limit = 6): Promise<ProductEntity[]> {
    return this.productRepo.getBestSellers(limit);
  }

  public async getProductsByCategory(
    categoryIdOrSlug: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.getProductsByCategoryUseCase.execute(categoryIdOrSlug, pagination);
  }

  public async getProductsByCollection(
    collectionSlug: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.productRepo.getProductsByCollection(collectionSlug, pagination);
  }

  public async searchProducts(
    query: string,
    filter?: ProductFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.searchProductsUseCase.execute(query, filter, pagination);
  }

  public async filterProducts(
    filter: ProductFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.productRepo.filterProducts(filter, pagination);
  }

  public async getRelatedProducts(
    productIdOrSlug: string,
    limit = 4
  ): Promise<ProductEntity[]> {
    return this.productRepo.getRelatedProducts(productIdOrSlug, limit);
  }

  public async getRecommendedProducts(
    productIdOrSlug: string,
    limit = 4
  ): Promise<ProductEntity[]> {
    return this.productRepo.getRecommendedProducts(productIdOrSlug, limit);
  }

  public async getCategories(): Promise<CategoryEntity[]> {
    return this.getCategoriesUseCase.execute();
  }

  public async getCategoryBySlug(slug: string): Promise<CategoryEntity> {
    return this.getCategoryBySlugUseCase.execute(slug);
  }

  public async getFeaturedCategories(limit = 4): Promise<CategoryEntity[]> {
    return this.categoryRepo.getFeaturedCategories(limit);
  }

  public async createProduct(payload: import('../modules/products').CreateProductPayload): Promise<ProductEntity> {
    return this.productRepo.createProduct(payload);
  }

  public async updateProduct(id: string, payload: import('../modules/products').UpdateProductPayload): Promise<ProductEntity> {
    return this.productRepo.updateProduct(id, payload);
  }

  public async deleteProduct(id: string): Promise<void> {
    return this.productRepo.deleteProduct(id);
  }
}
