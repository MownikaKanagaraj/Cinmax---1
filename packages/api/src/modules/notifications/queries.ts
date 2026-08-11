import type { SupabaseClient } from '@supabase/supabase-js';
import type { AppNotification } from '@cinmax/types';

export async function fetchUserNotifications(
  supabase: SupabaseClient,
  userId?: string
): Promise<AppNotification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .or(`user_id.eq.${userId},user_id.is.null`)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as unknown as AppNotification[];
}
