import type { Product } from '@cinmax/types';

export interface WishlistState {
  items: Product[];
  productIds: string[];
}

export interface ToggleWishlistPayload {
  userId?: string;
  productId: string;
}
