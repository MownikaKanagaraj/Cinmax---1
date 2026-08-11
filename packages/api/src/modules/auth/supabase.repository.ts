import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@cinmax/types';
import { AuthSessionEntity, UserEntity } from './entity';
import type { IAuthRepository } from './repository.interface';
import type { LoginPayload, RegisterPayload, VerifyOTPPayload, OAuthLoginOptions } from './types';

export class SupabaseAuthRepository implements IAuthRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  public async login(payload: LoginPayload): Promise<AuthSessionEntity> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password || '',
    });

    if (error) throw new Error(`Supabase Auth Error: ${error.message}`);

    return new AuthSessionEntity({
      user: data.user as any,
      token: data.session?.access_token || null,
      isAuthenticated: !!data.session,
    });
  }

  public async register(payload: RegisterPayload): Promise<AuthSessionEntity> {
    const { data, error } = await this.supabase.auth.signUp({
      email: payload.email,
      password: payload.password || '',
      options: {
        data: {
          first_name: payload.firstName,
          last_name: payload.lastName,
          phone: payload.phone || '',
        },
      },
    });

    if (error) throw new Error(`Supabase Auth Error: ${error.message}`);

    return new AuthSessionEntity({
      user: data.user as any,
      token: data.session?.access_token || null,
      isAuthenticated: !!data.session,
    });
  }

  public async logout(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw new Error(`Supabase Auth Error: ${error.message}`);
  }

  public async getSession(): Promise<AuthSessionEntity | null> {
    const { data, error } = await this.supabase.auth.getSession();
    if (error || !data.session) return null;

    return new AuthSessionEntity({
      user: data.session.user as any,
      token: data.session.access_token,
      isAuthenticated: true,
    });
  }

  public async refreshSession(): Promise<AuthSessionEntity | null> {
    const { data, error } = await this.supabase.auth.refreshSession();
    if (error || !data.session) return null;

    return new AuthSessionEntity({
      user: data.session.user as any,
      token: data.session.access_token,
      isAuthenticated: true,
    });
  }

  public async forgotPassword(email: string): Promise<void> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined,
    });
    if (error) throw new Error(`Supabase Password Reset Error: ${error.message}`);
  }

  public async resetPassword(newPassword: string): Promise<void> {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw new Error(`Supabase Password Update Error: ${error.message}`);
  }

  public async verifyOTP(payload: VerifyOTPPayload): Promise<AuthSessionEntity> {
    if (payload.phone) {
      const { data, error } = await this.supabase.auth.verifyOtp({
        phone: payload.phone,
        token: payload.token,
        type: 'sms',
      });
      if (error) throw new Error(`Supabase OTP Error: ${error.message}`);
      return new AuthSessionEntity({
        user: data.user as any,
        token: data.session?.access_token || null,
        isAuthenticated: !!data.session,
      });
    }

    const { data, error } = await this.supabase.auth.verifyOtp({
      email: payload.email || '',
      token: payload.token,
      type: 'email',
    });

    if (error) throw new Error(`Supabase OTP Error: ${error.message}`);

    return new AuthSessionEntity({
      user: data.user as any,
      token: data.session?.access_token || null,
      isAuthenticated: !!data.session,
    });
  }

  public async loginWithGoogle(options?: OAuthLoginOptions): Promise<void> {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: options?.redirectTo || (typeof window !== 'undefined' ? window.location.origin : undefined),
      },
    });
    if (error) throw new Error(`Supabase Google OAuth Error: ${error.message}`);
  }

  public async loginWithApple(options?: OAuthLoginOptions): Promise<void> {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: options?.redirectTo || (typeof window !== 'undefined' ? window.location.origin : undefined),
      },
    });
    if (error) throw new Error(`Supabase Apple OAuth Error: ${error.message}`);
  }

  public async loginWithPhone(phone: string): Promise<void> {
    const { error } = await this.supabase.auth.signInWithOtp({
      phone,
    });
    if (error) throw new Error(`Supabase Phone OTP Error: ${error.message}`);
  }

  public async updateProfile(data: Partial<UserEntity>): Promise<UserEntity | null> {
    const { data: userData, error } = await this.supabase.auth.updateUser({
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        avatar_url: data.avatarUrl,
      },
    });

    if (error) throw new Error(`Supabase User Update Error: ${error.message}`);
    if (!userData.user) return null;

    return new UserEntity({
      id: userData.user.id,
      email: userData.user.email || '',
      firstName: userData.user.user_metadata?.first_name || '',
      lastName: userData.user.user_metadata?.last_name || '',
      avatarUrl: userData.user.user_metadata?.avatar_url || '',
      role: (userData.user.user_metadata?.role as any) || 'customer',
      createdAt: userData.user.created_at || new Date().toISOString(),
    });
  }

  public async deleteAccount(): Promise<void> {
    const session = await this.getSession();
    if (!session?.user?.id) throw new Error('No active session found to delete account');

    const { error } = await this.supabase
      .from('profiles')
      .delete()
      .eq('id', session.user.id);

    if (error) throw new Error(`Account Deletion Error: ${error.message}`);
    await this.logout();
  }
}
