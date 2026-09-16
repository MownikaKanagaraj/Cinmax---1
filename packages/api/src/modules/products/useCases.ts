import type { ProductFilter } from '@cinmax/types';
import type { PaginatedResult, PaginationParams } from '../../pagination';
import { ProductNotFoundError } from '../../errors';
import { ProductEntity } from './entity';
import type { IProductRepository } from './repository.interface';

export class GetProductsUseCase {
  constructor(private productRepo: IProductRepository) {}

  public async execute(
    filter?: ProductFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.productRepo.getAll(filter, pagination);
  }
}

export class GetFeaturedProductsUseCase {
  constructor(private productRepo: IProductRepository) {}

  public async execute(limit = 4): Promise<ProductEntity[]> {
    return this.productRepo.getFeatured(limit);
  }
}

export class GetProductBySlugUseCase {
  constructor(private productRepo: IProductRepository) {}

  public async execute(slug: string): Promise<ProductEntity> {
    const product = await this.productRepo.getBySlug(slug);
    if (!product) {
      throw new ProductNotFoundError(slug);
    }
    return product;
  }
}

export class GetProductByIdUseCase {
  constructor(private productRepo: IProductRepository) {}

  public async execute(id: string): Promise<ProductEntity> {
    const product = await this.productRepo.getById(id);
    if (!product) {
      throw new ProductNotFoundError(id);
    }
    return product;
  }
}

export class GetProductsByCategoryUseCase {
  constructor(private productRepo: IProductRepository) {}

  public async execute(
    categorySlug: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.productRepo.getByCategory(categorySlug, pagination);
  }
}

export class SearchProductsUseCase {
  constructor(private productRepo: IProductRepository) {}

  public async execute(
    query: string,
    filter?: ProductFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.productRepo.search(query, filter, pagination);
  }
}

export class CreateProductUseCase {
  constructor(private productRepo: IProductRepository) {}

  public async execute(payload: import('./types').CreateProductPayload): Promise<ProductEntity> {
    return this.productRepo.createProduct(payload);
  }
}

export class UpdateProductUseCase {
  constructor(private productRepo: IProductRepository) {}

  public async execute(id: string, payload: import('./types').UpdateProductPayload): Promise<ProductEntity> {
    return this.productRepo.updateProduct(id, payload);
  }
}

export class DeleteProductUseCase {
  constructor(private productRepo: IProductRepository) {}

  public async execute(id: string): Promise<void> {
    return this.productRepo.deleteProduct(id);
  }
}
