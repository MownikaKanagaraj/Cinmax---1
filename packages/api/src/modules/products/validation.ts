import { z } from 'zod';

export const ProductFilterSchema = z.object({
  categorySlug: z.string().optional(),
  skinType: z.string().optional(),
  fragranceFamily: z.string().optional(),
  processType: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  inStockOnly: z.boolean().optional(),
  searchQuery: z.string().optional(),
  sortBy: z.enum(['featured', 'price-asc', 'price-desc', 'rating', 'newest']).optional(),
});

export const CreateProductSchema = z.object({
  slug: z.string().min(2),
  title: z.string().min(2),
  subtitle: z.string().optional(),
  description: z.string().min(10),
  howToUse: z.string().optional(),
  processType: z.enum(['cold-process', 'hot-process', 'triple-milled', 'liquid-botanical', 'whipped-butter', 'scrub-polish']),
  categoryId: z.string(),
  basePrice: z.number().positive(),
  compareAtPrice: z.number().positive().nullable().optional(),
  currency: z.string().default('USD'),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
});

export const UpdateProductSchema = CreateProductSchema.partial();
