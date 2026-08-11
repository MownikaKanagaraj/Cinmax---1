import { z } from 'zod';

export const CreateCategorySchema = z.object({
  slug: z.string().min(2),
  name: z.string().min(2),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  parentId: z.string().nullable().optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();
