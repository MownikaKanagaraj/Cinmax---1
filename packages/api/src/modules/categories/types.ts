import type { ProductCategory } from '@cinmax/types';

export interface CreateCategoryPayload {
  slug: string;
  name: string;
  description?: string;
  imageUrl?: string;
  parentId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryPayload extends Partial<CreateCategoryPayload> {
  id: string;
}
