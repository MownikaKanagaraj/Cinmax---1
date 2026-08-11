import { WishlistEntity } from './entity';
import type { IWishlistRepository } from './repository.interface';

export class GetWishlistUseCase {
  constructor(private wishlistRepo: IWishlistRepository) {}

  public async execute(userId?: string | null): Promise<WishlistEntity> {
    return this.wishlistRepo.getWishlist(userId);
  }
}

export class ToggleWishlistItemUseCase {
  constructor(private wishlistRepo: IWishlistRepository) {}

  public async execute(userId: string | null, productId: string): Promise<WishlistEntity> {
    return this.wishlistRepo.toggleItem(userId, productId);
  }
}

export class IsInWishlistUseCase {
  constructor(private wishlistRepo: IWishlistRepository) {}

  public async execute(userId: string | null, productId: string): Promise<boolean> {
    const wishlist = await this.wishlistRepo.getWishlist(userId);
    return wishlist.hasProduct(productId);
  }
}

export class ClearWishlistUseCase {
  constructor(private wishlistRepo: IWishlistRepository) {}

  public async execute(userId?: string | null): Promise<WishlistEntity> {
    return this.wishlistRepo.clear(userId);
  }
}
