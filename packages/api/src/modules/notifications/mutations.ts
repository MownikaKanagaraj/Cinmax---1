import type { SupabaseClient } from '@supabase/supabase-js';
import type { MarkNotificationReadPayload, SendNotificationPayload } from './types';

export async function sendNotification(
  supabase: SupabaseClient,
  payload: SendNotificationPayload
) {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: payload.userId,
      title: payload.title,
      message: payload.message,
      type: payload.type,
      link: payload.link,
      is_read: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function markNotificationRead(
  supabase: SupabaseClient,
  payload: MarkNotificationReadPayload
) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: payload.isRead })
    .eq('id', payload.notificationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
