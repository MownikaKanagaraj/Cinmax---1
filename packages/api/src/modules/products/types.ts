import type { Product, ProductFilter, ProductVariant } from '@cinmax/types';

export type ProductListResponse = {
  items: Product[];
  totalCount: number;
  hasMore: boolean;
};

export interface ProductImageInput {
  id?: string;
  url: string;
  alt?: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface ProductVariantInput {
  id?: string;
  title: string;
  sku?: string;
  weightGrams?: number;
  volumeMl?: number;
  price: number;
  compareAtPrice?: number | null;
  inventoryQuantity?: number;
  lowStockThreshold?: number;
  isAvailable?: boolean;
  options?: Record<string, any>;
}

export interface ProductIngredientInput {
  id?: string;
  name: string;
  inciName?: string;
  purpose?: string;
  isOrganic?: boolean;
  isKeyBotanical?: boolean;
  sortOrder?: number;
}

export interface CreateProductPayload {
  title: string;
  slug: string;
  brand?: string;
  subtitle?: string;
  description: string;
  howToUse?: string;
  processType: Product['processType'];
  categoryId: string;
  basePrice: number;
  compareAtPrice?: number | null;
  currency?: string;
  stock?: number;
  weightGrams?: number;
  skinTypes?: Product['skinTypes'];
  fragranceFamily?: Product['fragranceFamily'];
  certifications?: string[];
  trustBadges?: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  isActive?: boolean;
  minOrderQuantity?: number;
  quantityPrice?: number | null;
  images?: ProductImageInput[];
  variants?: ProductVariantInput[];
  ingredients?: ProductIngredientInput[];
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {
  id: string;
}
