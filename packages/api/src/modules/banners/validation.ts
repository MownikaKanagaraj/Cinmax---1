import { z } from 'zod';

export const BannerFilterSchema = z.object({
  activeOnly: z.boolean().optional(),
});
