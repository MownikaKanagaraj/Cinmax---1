import { z } from 'zod';

export const addressSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  company: z.string().optional(),
  streetLine1: z.string().min(5, 'Street address is required'),
  streetLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State / Province is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().min(7, 'Valid phone number is required'),
  isDefault: z.boolean().optional(),
});

export const checkoutSchema = z.object({
  email: z.string().email('Valid email address is required'),
  shippingAddress: addressSchema,
  billingSameAsShipping: z.boolean().default(true),
  billingAddress: addressSchema.optional(),
  giftMessage: z.string().max(250).optional(),
  paymentMethod: z.enum(['stripe', 'apple_pay', 'google_pay']).default('stripe'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const productReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(3, 'Review title is required').max(100),
  content: z.string().min(10, 'Review content must be at least 10 characters').max(1000),
  scentRating: z.number().min(1).max(5).optional(),
  latherRating: z.number().min(1).max(5).optional(),
  moistureRating: z.number().min(1).max(5).optional(),
});

export const productAdminSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  slug: z.string().min(3, 'Slug is required'),
  subtitle: z.string().optional(),
  description: z.string().min(10, 'Description is required'),
  howToUse: z.string().optional(),
  processType: z.enum([
    'cold-process',
    'triple-milled',
    'melt-and-pour',
    'liquid-botanical',
    'whipped-butter',
  ]),
  categoryId: z.string().uuid('Category must be selected'),
  basePrice: z.number().positive('Price must be greater than 0'),
  compareAtPrice: z.number().positive().optional().nullable(),
  fragranceFamily: z.enum([
    'unscented',
    'citrus',
    'woody',
    'floral',
    'herbal',
    'earthy',
    'aquatic',
    'spicy',
  ]),
  skinTypes: z.array(z.string()).min(1, 'Select at least one skin type'),
  certifications: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export type AddressFormData = z.infer<typeof addressSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProductReviewFormData = z.infer<typeof productReviewSchema>;
export type ProductAdminFormData = z.infer<typeof productAdminSchema>;
