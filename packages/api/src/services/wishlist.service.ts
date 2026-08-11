import type { IWishlistRepository, WishlistEntity } from '../modules/wishlist';
import {
  GetWishlistUseCase,
  ToggleWishlistItemUseCase,
  IsInWishlistUseCase,
  ClearWishlistUseCase,
} from '../modules/wishlist/useCases';

export class WishlistService {
  private getWishlistUseCase: GetWishlistUseCase;
  private toggleItemUseCase: ToggleWishlistItemUseCase;
  private isInWishlistUseCase: IsInWishlistUseCase;
  private clearWishlistUseCase: ClearWishlistUseCase;

  constructor(private wishlistRepo: IWishlistRepository) {
    this.getWishlistUseCase = new GetWishlistUseCase(wishlistRepo);
    this.toggleItemUseCase = new ToggleWishlistItemUseCase(wishlistRepo);
    this.isInWishlistUseCase = new IsInWishlistUseCase(wishlistRepo);
    this.clearWishlistUseCase = new ClearWishlistUseCase(wishlistRepo);
  }

  public async getWishlist(userId?: string | null): Promise<WishlistEntity> {
    return this.getWishlistUseCase.execute(userId);
  }

  public async add(userId: string | null, productId: string): Promise<WishlistEntity> {
    return this.wishlistRepo.add(userId, productId);
  }

  public async remove(userId: string | null, productId: string): Promise<WishlistEntity> {
    return this.wishlistRepo.remove(userId, productId);
  }

  public async toggleItem(userId: string | null, productId: string): Promise<WishlistEntity> {
    return this.toggleItemUseCase.execute(userId, productId);
  }

  public async isInWishlist(userId: string | null, productId: string): Promise<boolean> {
    return this.isInWishlistUseCase.execute(userId, productId);
  }

  public async moveToCart(userId: string | null, productId: string): Promise<WishlistEntity> {
    return this.wishlistRepo.moveToCart(userId, productId);
  }

  public async clearWishlist(userId?: string | null): Promise<WishlistEntity> {
    return this.clearWishlistUseCase.execute(userId);
  }

  public async shareWishlist(userId: string): Promise<{ shareUrl: string }> {
    return this.wishlistRepo.shareWishlist(userId);
  }
}
