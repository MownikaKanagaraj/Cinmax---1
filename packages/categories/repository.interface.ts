import { CategoryEntity } from './entity';

export interface ICategoryRepository {
  // Legacy / standard method signatures
  getAll(): Promise<CategoryEntity[]>;
  getById(id: string): Promise<CategoryEntity | null>;
  getBySlug(slug: string): Promise<CategoryEntity | null>;

  // Task 3 explicit domain methods
  getCategories(): Promise<CategoryEntity[]>;
  getCategory(id: string): Promise<CategoryEntity | null>;
  getCategoryBySlug(slug: string): Promise<CategoryEntity | null>;
  getFeaturedCategories(limit?: number): Promise<CategoryEntity[]>;
}
