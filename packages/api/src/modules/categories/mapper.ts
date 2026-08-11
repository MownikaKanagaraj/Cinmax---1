import type { ProductCategory } from '@cinmax/types';
import type { CategoryDTO } from './dto';
import { CategoryEntity } from './entity';

export class CategoryMapper {
  public static toEntity(dto: CategoryDTO): CategoryEntity {
    return new CategoryEntity({
      id: dto.id,
      slug: dto.slug,
      name: dto.name,
      description: dto.description ?? undefined,
      imageUrl: dto.image_url ?? undefined,
      parentId: dto.parent_id ?? null,
      sortOrder: dto.sort_order,
      isActive: dto.is_active,
    });
  }

  public static toDTO(entity: ProductCategory | CategoryEntity): CategoryDTO {
    return {
      id: entity.id,
      slug: entity.slug,
      name: entity.name,
      description: entity.description ?? null,
      image_url: entity.imageUrl ?? null,
      parent_id: entity.parentId ?? null,
      sort_order: entity.sortOrder,
      is_active: entity.isActive,
    };
  }

  public static toEntityList(dtos: CategoryDTO[]): CategoryEntity[] {
    return dtos.map(this.toEntity);
  }
}
