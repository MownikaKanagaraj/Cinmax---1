import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
});

export const PhoneOTPSchema = z.object({
  phone: z.string().min(10, 'Valid phone number is required'),
});

export const VerifyOTPSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  token: z.string().min(4, 'OTP token is required'),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const ResetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const ProfileUpdateValidationSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
});
