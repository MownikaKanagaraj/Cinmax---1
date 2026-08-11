import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@cinmax/types';
import { NotificationEntity } from './entity';
import { NotificationMapper } from './mapper';
import type { INotificationRepository } from './repository.interface';

export class SupabaseNotificationRepository implements INotificationRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  public async getAll(userId?: string): Promise<NotificationEntity[]> {
    if (!userId || userId === 'undefined') return [];

    try {
      const { data, error } = await this.supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data) return [];
      return NotificationMapper.toEntityList(data as any);
    } catch {
      return [];
    }
  }

  public async getUnreadCount(userId?: string): Promise<number> {
    if (!userId || userId === 'undefined') return 0;

    try {
      const { count, error } = await this.supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) return 0;
      return count || 0;
    } catch {
      return 0;
    }
  }

  public async markAsRead(id: string): Promise<NotificationEntity> {
    try {
      const { data, error } = await this.supabase
        .from('notifications')
        .update({ is_read: true } as any)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return NotificationMapper.toEntity(data as any);
    } catch {
      return new NotificationEntity({
        id,
        userId: '',
        title: 'Notification',
        message: '',
        type: 'system',
        isRead: true,
        createdAt: new Date().toISOString(),
      });
    }
  }

  public async markAllAsRead(userId?: string): Promise<void> {
    if (!userId || userId === 'undefined') return;

    try {
      await this.supabase
        .from('notifications')
        .update({ is_read: true } as any)
        .eq('user_id', userId)
        .eq('is_read', false);
    } catch {
      // Graceful fallback
    }
  }
}
