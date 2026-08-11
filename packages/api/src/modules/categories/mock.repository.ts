import { mockCategoriesData } from '../../mockData';
import { CategoryEntity } from './entity';
import type { ICategoryRepository } from './repository.interface';

export class MockCategoryRepository implements ICategoryRepository {
  private categories: CategoryEntity[];

  constructor(initialData?: CategoryEntity[]) {
    this.categories = initialData || mockCategoriesData.map((c) => new CategoryEntity(c));
  }

  public async getAll(): Promise<CategoryEntity[]> {
    return this.categories
      .filter((c) => c.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public async getCategories(): Promise<CategoryEntity[]> {
    return this.getAll();
  }

  public async getBySlug(slug: string): Promise<CategoryEntity | null> {
    const category = this.categories.find((c) => c.slug === slug);
    return category || null;
  }

  public async getCategoryBySlug(slug: string): Promise<CategoryEntity | null> {
    return this.getBySlug(slug);
  }

  public async getById(id: string): Promise<CategoryEntity | null> {
    const category = this.categories.find((c) => c.id === id);
    return category || null;
  }

  public async getCategory(id: string): Promise<CategoryEntity | null> {
    return this.getById(id);
  }

  public async getFeaturedCategories(limit = 4): Promise<CategoryEntity[]> {
    const active = await this.getAll();
    return active.slice(0, limit);
  }
}
