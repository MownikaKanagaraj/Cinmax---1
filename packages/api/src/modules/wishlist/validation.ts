import { z } from 'zod';

export const ToggleWishlistItemSchema = z.object({
  productId: z.string().min(1),
});
