import type { Product, ProductFilter, ProductVariant } from '@cinmax/types';

export type ProductListResponse = {
  items: Product[];
  totalCount: number;
  hasMore: boolean;
};

export interface CreateProductPayload {
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  howToUse?: string;
  processType: Product['processType'];
  categoryId: string;
  basePrice: number;
  compareAtPrice?: number | null;
  skinTypes: Product['skinTypes'];
  fragranceFamily: Product['fragranceFamily'];
  certifications: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  variants?: Omit<ProductVariant, 'id' | 'productId'>[];
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {
  id: string;
}
