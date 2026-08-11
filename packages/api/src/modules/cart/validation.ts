import { z } from 'zod';

export const AddCartItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  quantity: z.number().int().positive().default(1),
});

export const UpdateCartQuantitySchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().min(0),
});

export const ApplyCouponSchema = z.object({
  code: z.string().min(2).max(30),
});
