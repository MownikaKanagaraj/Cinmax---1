import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@cinmax/types';
import { WishlistEntity } from './entity';
import { WishlistMapper } from './mapper';
import type { IWishlistRepository } from './repository.interface';

export class SupabaseWishlistRepository implements IWishlistRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  public async getWishlist(userId?: string | null): Promise<WishlistEntity> {
    if (!userId) {
      return new WishlistEntity({
        id: 'wish_guest',
        userId: null,
        productIds: [],
        products: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    const { data, error } = await this.supabase
      .from('wishlists')
      .select('*, products(*)')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) {
      return new WishlistEntity({
        id: `wish_${userId}`,
        userId,
        productIds: [],
        products: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return WishlistMapper.toEntity(data as any);
  }

  public async add(userId: string | null, productId: string): Promise<WishlistEntity> {
    const current = await this.getWishlist(userId);
    if (!current.hasProduct(productId)) {
      const updatedIds = [...current.productIds, productId];
      if (userId) {
        await this.supabase
          .from('wishlists')
          .upsert({ user_id: userId, product_ids: updatedIds, updated_at: new Date().toISOString() } as any);
      }
    }
    return this.getWishlist(userId);
  }

  public async remove(userId: string | null, productId: string): Promise<WishlistEntity> {
    const current = await this.getWishlist(userId);
    if (current.hasProduct(productId)) {
      const updatedIds = current.productIds.filter((id) => id !== productId);
      if (userId) {
        await this.supabase
          .from('wishlists')
          .upsert({ user_id: userId, product_ids: updatedIds, updated_at: new Date().toISOString() } as any);
      }
    }
    return this.getWishlist(userId);
  }

  public async toggleItem(userId: string | null, productId: string): Promise<WishlistEntity> {
    const current = await this.getWishlist(userId);
    if (current.hasProduct(productId)) {
      return this.remove(userId, productId);
    }
    return this.add(userId, productId);
  }

  public async moveToCart(userId: string | null, productId: string): Promise<WishlistEntity> {
    await this.remove(userId, productId);
    return this.getWishlist(userId);
  }

  public async clear(userId?: string | null): Promise<WishlistEntity> {
    if (userId) {
      await this.supabase
        .from('wishlists')
        .update({ product_ids: [], updated_at: new Date().toISOString() } as any)
        .eq('user_id', userId);
    }
    return this.getWishlist(userId);
  }

  public async shareWishlist(userId: string): Promise<{ shareUrl: string }> {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://cinmax.luxury';
    return { shareUrl: `${baseUrl}/wishlist/share?user=${encodeURIComponent(userId)}` };
  }
}
