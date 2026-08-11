import type { SupabaseClient } from '@supabase/supabase-js';
import type { LoginPayload, RegisterPayload } from './types';

export async function loginWithEmail(
  supabase: SupabaseClient,
  payload: LoginPayload
): Promise<any> {
  if (!payload.password) throw new Error('Password required');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });
  if (error) throw error;
  return data;
}

export async function registerWithEmail(
  supabase: SupabaseClient,
  payload: RegisterPayload
): Promise<any> {
  if (!payload.password) throw new Error('Password required');
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        first_name: payload.firstName,
        last_name: payload.lastName,
      },
    },
  });
  if (error) throw error;
  return data;
}

export async function signOutUser(supabase: SupabaseClient): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
