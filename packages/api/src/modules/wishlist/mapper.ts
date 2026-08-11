import type { Wishlist, Product } from '@cinmax/types';
import { ProductMapper } from '../products/mapper';
import type { WishlistDTO } from './dto';
import { WishlistEntity } from './entity';

export class WishlistMapper {
  public static toEntity(dto: WishlistDTO): WishlistEntity {
    return new WishlistEntity({
      id: dto.id,
      userId: dto.user_id,
      productIds: dto.product_ids || [],
      products: dto.products ? ProductMapper.toEntityList(dto.products) : [],
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
    });
  }

  public static toDTO(entity: Wishlist | WishlistEntity): WishlistDTO {
    return {
      id: entity.id,
      user_id: entity.userId ?? null,
      product_ids: entity.productIds,
      products: entity.products ? entity.products.map((p: Product) => ProductMapper.toDTO(p)) : null,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    };
  }
}
