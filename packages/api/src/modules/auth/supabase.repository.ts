import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@cinmax/types';
import { AuthSessionEntity, UserEntity } from './entity';
import type { IAuthRepository } from './repository.interface';
import type { LoginPayload, RegisterPayload, VerifyOTPPayload, OAuthLoginOptions } from './types';

export class SupabaseAuthRepository implements IAuthRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  public async login(payload: LoginPayload): Promise<AuthSessionEntity> {
    const cleanEmail = (payload.email || '').trim().toLowerCase();
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: payload.password || '',
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password. Please verify your credentials and try again.');
      }
      throw new Error(error.message);
    }

    let profileData: any = null;
    if (data.user?.id) {
      try {
        const { data: prof } = await this.supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (!prof) {
          const newProf = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            first_name: data.user.user_metadata?.first_name || cleanEmail.split('@')[0],
            last_name: data.user.user_metadata?.last_name || '',
            role: (data.user.user_metadata?.role as any) || 'customer',
            updated_at: new Date().toISOString(),
          };
          await this.supabase.from('profiles').upsert(newProf as any, { onConflict: 'id' });
          profileData = newProf;
        } else {
          profileData = prof;
        }
      } catch (e) {
        // Ignore if profile already exists or table issue
      }
    }

    const userMeta = data.user?.user_metadata || {};
    const role = profileData?.role || userMeta.role || 'customer';

    const enrichedUser = {
      ...data.user,
      id: data.user?.id,
      email: data.user?.email || cleanEmail,
      firstName: profileData?.first_name || userMeta.first_name || cleanEmail.split('@')[0],
      lastName: profileData?.last_name || userMeta.last_name || '',
      phone: profileData?.phone || userMeta.phone || '',
      role,
      loyaltyTier: profileData?.loyalty_tier || 'bronze',
      loyaltyPoints: Math.max(0, Number(profileData?.loyalty_points) || 0),
    };

    return new AuthSessionEntity({
      user: enrichedUser as any,
      token: data.session?.access_token || null,
      isAuthenticated: !!data.session,
    });
  }

  public async register(payload: RegisterPayload): Promise<AuthSessionEntity> {
    const cleanEmail = (payload.email || '').trim().toLowerCase();
    const { data, error } = await this.supabase.auth.signUp({
      email: cleanEmail,
      password: payload.password || '',
      options: {
        data: {
          first_name: payload.firstName,
          last_name: payload.lastName,
          phone: payload.phone || '',
          role: 'customer',
        },
      },
    });

    if (error) {
      if (error.message.includes('User already registered')) {
        throw new Error('An account with this email address already exists. Please sign in instead.');
      }
      throw new Error(error.message);
    }

    let session = data.session;
    let user = data.user;

    // If session was not returned by signUp, perform immediate login
    if (!session && user && payload.password) {
      const loginRes = await this.supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: payload.password,
      });
      if (loginRes.data?.session) {
        session = loginRes.data.session;
        user = loginRes.data.user;
      }
    }

    // Failsafe profile upsert
    if (user?.id) {
      try {
        await this.supabase.from('profiles').upsert({
          id: user.id,
          email: cleanEmail,
          first_name: payload.firstName,
          last_name: payload.lastName,
          phone: payload.phone || null,
          role: 'customer',
          updated_at: new Date().toISOString(),
        } as any, { onConflict: 'id' });
      } catch (e) {
        // Ignore if trigger already populated profile
      }
    }

    const enrichedUser = {
      ...user,
      id: user?.id,
      email: cleanEmail,
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone || '',
      role: 'customer',
      loyaltyTier: 'bronze',
      loyaltyPoints: 0,
    };

    return new AuthSessionEntity({
      user: enrichedUser as any,
      token: session?.access_token || null,
      isAuthenticated: !!session,
    });
  }

  public async logout(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  public async getSession(): Promise<AuthSessionEntity | null> {
    const { data, error } = await this.supabase.auth.getSession();
    if (error || !data.session) return null;

    let profileData: any = null;
    if (data.session.user?.id) {
      try {
        const { data: prof } = await this.supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
        profileData = prof;
      } catch (e) {
        // Ignore fallback
      }
    }

    const userMeta = data.session.user.user_metadata || {};
    const role = profileData?.role || userMeta.role || 'customer';

    const enrichedUser = {
      ...data.session.user,
      id: data.session.user.id,
      email: data.session.user.email,
      firstName: profileData?.first_name || userMeta.first_name || data.session.user.email?.split('@')[0] || '',
      lastName: profileData?.last_name || userMeta.last_name || '',
      phone: profileData?.phone || userMeta.phone || '',
      role,
      loyaltyTier: profileData?.loyalty_tier || 'bronze',
      loyaltyPoints: Math.max(0, Number(profileData?.loyalty_points) || 0),
    };

    return new AuthSessionEntity({
      user: enrichedUser as any,
      token: data.session.access_token,
      isAuthenticated: true,
    });
  }

  public async refreshSession(): Promise<AuthSessionEntity | null> {
    const { data, error } = await this.supabase.auth.refreshSession();
    if (error || !data.session) return null;

    return this.getSession();
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
