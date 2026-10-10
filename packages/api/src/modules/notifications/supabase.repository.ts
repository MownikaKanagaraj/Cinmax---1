import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@cinmax/types';
import { NotificationEntity } from './entity';
import { NotificationMapper } from './mapper';
import type { INotificationRepository } from './repository.interface';

export class SupabaseNotificationRepository implements INotificationRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  public async getAll(userId?: string): Promise<NotificationEntity[]> {
    try {
      let query = this.supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId && userId !== 'undefined') {
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      } else {
        query = query.is('user_id', null);
      }

      const { data, error } = await query;
      if (error || !data) return [];
      return NotificationMapper.toEntityList(data as any);
    } catch {
      return [];
    }
  }

  public async getUnreadCount(userId?: string): Promise<number> {
    try {
      let query = this.supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);

      if (userId && userId !== 'undefined') {
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      } else {
        query = query.is('user_id', null);
      }

      const { count, error } = await query;
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
    try {
      let query = this.supabase
        .from('notifications')
        .update({ is_read: true } as any)
        .eq('is_read', false);

      if (userId && userId !== 'undefined') {
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      } else {
        query = query.is('user_id', null);
      }

      await query;
    } catch {
      // Graceful fallback
    }
  }
}

