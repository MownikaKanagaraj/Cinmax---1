import { CategoryNotFoundError } from '../../errors';
import { CategoryEntity } from './entity';
import type { ICategoryRepository } from './repository.interface';

export class GetCategoriesUseCase {
  constructor(private categoryRepo: ICategoryRepository) {}

  public async execute(): Promise<CategoryEntity[]> {
    return this.categoryRepo.getAll();
  }
}

export class GetCategoryBySlugUseCase {
  constructor(private categoryRepo: ICategoryRepository) {}

  public async execute(slug: string): Promise<CategoryEntity> {
    const category = await this.categoryRepo.getBySlug(slug);
    if (!category) {
      throw new CategoryNotFoundError(slug);
    }
    return category;
  }
}

export class GetCategoryByIdUseCase {
  constructor(private categoryRepo: ICategoryRepository) {}

  public async execute(id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepo.getById(id);
    if (!category) {
      throw new CategoryNotFoundError(id);
    }
    return category;
  }
}
