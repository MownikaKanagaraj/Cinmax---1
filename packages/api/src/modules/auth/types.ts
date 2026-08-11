import type { CustomerProfile, UserRole } from '@cinmax/types';

export interface LoginPayload {
  email: string;
  password?: string;
  otp?: string;
}

export interface RegisterPayload {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface VerifyOTPPayload {
  email?: string;
  phone?: string;
  token: string;
}

export interface OAuthLoginOptions {
  redirectTo?: string;
}

export interface AuthSession {
  user: CustomerProfile | null;
  token: string | null;
  isAuthenticated: boolean;
}
