import { z } from 'zod';

export const CreatePaymentIntentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  orderId: z.string().optional(),
});
