import { z } from 'zod';

export const AddressSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  streetLine1: z.string().min(3),
  streetLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(2),
  country: z.string().min(2),
  phone: z.string().optional(),
  isDefaultShipping: z.boolean().optional(),
  isDefaultBilling: z.boolean().optional(),
});

export const OrderFilterSchema = z.object({
  userId: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).optional(),
  searchQuery: z.string().optional(),
});
