import { z } from 'zod';

export const BlogFilterSchema = z.object({
  category: z.string().optional(),
  tag: z.string().optional(),
  searchQuery: z.string().optional(),
});
