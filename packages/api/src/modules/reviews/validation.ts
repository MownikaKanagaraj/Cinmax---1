import { z } from 'zod';

export const SubmitReviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().min(1).max(5),
  title: z.string().min(2).max(100),
  comment: z.string().min(5).max(1000),
  images: z.array(z.string().url()).optional(),
});
