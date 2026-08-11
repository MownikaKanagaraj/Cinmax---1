import { WishlistEntity } from './entity';

export interface IWishlistRepository {
  getWishlist(userId?: string | null): Promise<WishlistEntity>;
  add(userId: string | null, productId: string): Promise<WishlistEntity>;
  remove(userId: string | null, productId: string): Promise<WishlistEntity>;
  toggleItem(userId: string | null, productId: string): Promise<WishlistEntity>;
  moveToCart(userId: string | null, productId: string): Promise<WishlistEntity>;
  clear(userId?: string | null): Promise<WishlistEntity>;
  shareWishlist(userId: string): Promise<{ shareUrl: string }>;
}
