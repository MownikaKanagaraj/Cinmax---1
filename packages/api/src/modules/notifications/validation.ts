import { z } from 'zod';

export const MarkNotificationAsReadSchema = z.object({
  id: z.string().min(1),
});
