import type { CustomerProfile } from '@cinmax/types';
import type { CustomerDTO } from './dto';
import { CustomerEntity } from './entity';

export class CustomerMapper {
  public static toEntity(dto: CustomerDTO): CustomerEntity {
    return new CustomerEntity({
      id: dto.id,
      authId: dto.auth_id,
      email: dto.email,
      firstName: dto.first_name ?? undefined,
      lastName: dto.last_name ?? undefined,
      phone: dto.phone ?? undefined,
      avatarUrl: dto.avatar_url ?? undefined,
      role: dto.role as any,
      loyaltyTier: dto.loyalty_tier as any,
      loyaltyPoints: dto.loyalty_points,
      savedAddresses: dto.saved_addresses || [],
      wishlistProductIds: dto.wishlist_product_ids || [],
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
    });
  }

  public static toDTO(entity: CustomerProfile | CustomerEntity): CustomerDTO {
    return {
      id: entity.id,
      auth_id: entity.authId,
      email: entity.email,
      first_name: entity.firstName ?? null,
      last_name: entity.lastName ?? null,
      phone: entity.phone ?? null,
      avatar_url: entity.avatarUrl ?? null,
      role: entity.role,
      loyalty_tier: entity.loyaltyTier,
      loyalty_points: entity.loyaltyPoints,
      saved_addresses: entity.savedAddresses,
      wishlist_product_ids: entity.wishlistProductIds,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    };
  }

  public static toEntityList(dtos: CustomerDTO[]): CustomerEntity[] {
    return dtos.map(this.toEntity);
  }
}
