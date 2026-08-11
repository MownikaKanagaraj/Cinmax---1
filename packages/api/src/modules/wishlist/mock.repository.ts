import { mockProductsData } from '../../mockData';
import { WishlistEntity } from './entity';
import type { IWishlistRepository } from './repository.interface';

export class MockWishlistRepository implements IWishlistRepository {
  private wishlist: WishlistEntity;

  constructor(initialData?: WishlistEntity) {
    const initialProductIds = ['prod_001', 'prod_004'];
    const products = mockProductsData.filter((p) => initialProductIds.includes(p.id));
    this.wishlist =
      initialData ||
      new WishlistEntity({
        id: 'wish_mock_001',
        userId: 'usr_mock_001',
        productIds: initialProductIds,
        products,
        createdAt: '2026-08-01T00:00:00Z',
        updatedAt: '2026-08-01T00:00:00Z',
      });
  }

  public async getWishlist(_userId?: string | null): Promise<WishlistEntity> {
    const products = mockProductsData.filter((p) => this.wishlist.productIds.includes(p.id));
    return new WishlistEntity({
      ...this.wishlist,
      products,
    });
  }

  public async add(userId: string | null, productId: string): Promise<WishlistEntity> {
    if (!this.wishlist.productIds.includes(productId)) {
      const newProductIds = [...this.wishlist.productIds, productId];
      const products = mockProductsData.filter((p) => newProductIds.includes(p.id));
      this.wishlist = new WishlistEntity({
        ...this.wishlist,
        productIds: newProductIds,
        products,
        updatedAt: new Date().toISOString(),
      });
    }
    return this.getWishlist(userId);
  }

  public async remove(userId: string | null, productId: string): Promise<WishlistEntity> {
    if (this.wishlist.productIds.includes(productId)) {
      const newProductIds = this.wishlist.productIds.filter((id) => id !== productId);
      const products = mockProductsData.filter((p) => newProductIds.includes(p.id));
      this.wishlist = new WishlistEntity({
        ...this.wishlist,
        productIds: newProductIds,
        products,
        updatedAt: new Date().toISOString(),
      });
    }
    return this.getWishlist(userId);
  }

  public async toggleItem(userId: string | null, productId: string): Promise<WishlistEntity> {
    if (this.wishlist.productIds.includes(productId)) {
      return this.remove(userId, productId);
    }
    return this.add(userId, productId);
  }

  public async moveToCart(userId: string | null, productId: string): Promise<WishlistEntity> {
    return this.remove(userId, productId);
  }

  public async clear(_userId?: string | null): Promise<WishlistEntity> {
    this.wishlist = new WishlistEntity({
      ...this.wishlist,
      productIds: [],
      products: [],
      updatedAt: new Date().toISOString(),
    });
    return this.wishlist;
  }

  public async shareWishlist(userId: string): Promise<{ shareUrl: string }> {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://cinmax.luxury';
    return { shareUrl: `${baseUrl}/wishlist/share?user=${encodeURIComponent(userId)}` };
  }
}
