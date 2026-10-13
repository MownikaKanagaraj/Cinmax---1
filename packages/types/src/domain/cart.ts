import type { Product, ProductVariant } from './product';

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId: string;
  product: Pick<Product, 'id' | 'title' | 'slug' | 'images' | 'processType'> & {
    minOrderQuantity?: number;
    quantityPrice?: number | null;
  };
  variant: Pick<ProductVariant, 'id' | 'sku' | 'title' | 'price' | 'weightGrams' | 'options'>;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed_amount' | 'free_shipping';
  discountValue: number;
  minimumOrderValue?: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface CartPriceBreakdown {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  estimatedTotal: number;
  currency: string;
  freeShippingThreshold: number;
  amountUntilFreeShipping: number;
}

export interface Cart {
  id: string;
  userId?: string | null;
  guestId?: string | null;
  items: CartItem[];
  appliedDiscount?: DiscountCode | null;
  pricing: CartPriceBreakdown;
  itemCount: number;
  updatedAt: string;
}
