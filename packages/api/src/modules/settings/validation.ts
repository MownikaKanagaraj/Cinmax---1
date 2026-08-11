import { z } from 'zod';

export const UpdateSettingsSchema = z.object({
  appName: z.string().min(1).optional(),
  currency: z.string().min(1).optional(),
  taxRate: z.number().min(0).max(1).optional(),
  freeShippingThreshold: z.number().min(0).optional(),
  standardShippingFee: z.number().min(0).optional(),
  contactEmail: z.string().email().optional(),
  supportPhone: z.string().optional(),
});
