import { z } from 'zod';

export const AddressValidationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  streetLine1: z.string().min(1, 'Street address is required'),
  streetLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State / Province is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  isDefaultShipping: z.boolean().optional(),
  isDefaultBilling: z.boolean().optional(),
});

export const UpdateCustomerProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
});

export const NotificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  orderUpdates: z.boolean(),
});

export const CustomerPreferencesSchema = z.object({
  skinType: z.string().optional(),
  fragrancePreference: z.string().optional(),
  favoriteIngredients: z.array(z.string()).optional(),
});
