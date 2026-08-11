import { AuthSessionEntity, UserEntity } from './entity';
import type { LoginPayload, RegisterPayload, VerifyOTPPayload, OAuthLoginOptions } from './types';

export interface IAuthRepository {
  login(payload: LoginPayload): Promise<AuthSessionEntity>;
  register(payload: RegisterPayload): Promise<AuthSessionEntity>;
  logout(): Promise<void>;
  getSession(): Promise<AuthSessionEntity | null>;
  refreshSession(): Promise<AuthSessionEntity | null>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(newPassword: string): Promise<void>;
  verifyOTP(payload: VerifyOTPPayload): Promise<AuthSessionEntity>;
  loginWithGoogle(options?: OAuthLoginOptions): Promise<void>;
  loginWithApple(options?: OAuthLoginOptions): Promise<void>;
  loginWithPhone(phone: string): Promise<void>;
  updateProfile(data: Partial<UserEntity>): Promise<UserEntity | null>;
  deleteAccount(): Promise<void>;
}
