import { z } from 'zod';

export const CouponFilterSchema = z.object({
  code: z.string().min(2).max(30),
  orderAmount: z.number().nonnegative().optional(),
});
