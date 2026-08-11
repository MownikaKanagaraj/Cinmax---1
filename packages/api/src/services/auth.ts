import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, CustomerProfile } from '@cinmax/types';

export class AuthService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getCurrentSession() {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }

  async getProfile(userId: string): Promise<CustomerProfile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      authId: data.id,
      email: data.email,
      firstName: data.first_name || undefined,
      lastName: data.last_name || undefined,
      phone: data.phone || undefined,
      avatarUrl: data.avatar_url || undefined,
      role: data.role as any,
      loyaltyTier: data.loyalty_tier as any,
      loyaltyPoints: data.loyalty_points,
      savedAddresses: [],
      wishlistProductIds: [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }
}
