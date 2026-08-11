import type { Wishlist, Product } from '@cinmax/types';

export class WishlistEntity implements Wishlist {
  public id: string;
  public userId?: string | null;
  public productIds: string[];
  public products?: Product[];
  public createdAt: string;
  public updatedAt: string;

  constructor(props: Wishlist) {
    this.id = props.id;
    this.userId = props.userId;
    this.productIds = props.productIds || [];
    this.products = props.products || [];
    this.createdAt = props.createdAt || new Date().toISOString();
    this.updatedAt = props.updatedAt || new Date().toISOString();
  }

  public hasProduct(productId: string): boolean {
    return this.productIds.includes(productId);
  }

  public get count(): number {
    return this.productIds.length;
  }
}
