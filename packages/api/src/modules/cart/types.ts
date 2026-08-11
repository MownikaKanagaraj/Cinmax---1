import type { Cart, CartItem, Product, ProductVariant } from '@cinmax/types';

export interface AddToCartPayload {
  cartId?: string;
  userId?: string | null;
  product: Product;
  variant: ProductVariant;
  quantity?: number;
}

export interface UpdateCartItemQuantityPayload {
  cartItemId: string;
  quantity: number;
}
