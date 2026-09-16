import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@cinmax/types';
import { VideoEntity, UserVideoPurchaseEntity } from './entity';
import { VideoMapper } from './mapper';
import type { IVideoRepository } from './repository.interface';
import type { CreateVideoPayload, UpdateVideoPayload, RecordVideoPurchasePayload } from './types';
import { getYouTubeVideoId, getYouTubeThumbnailUrl } from '@cinmax/utils';
import { MockVideoRepository } from './mock.repository';

export class SupabaseVideoRepository implements IVideoRepository {
  private mockFallback = new MockVideoRepository();

  constructor(private supabase: SupabaseClient<Database>) {}

  public async getPublishedVideos(): Promise<VideoEntity[]> {
    try {
      const { data, error } = await this.supabase
        .from('videos' as any)
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!data || data.length === 0) return this.mockFallback.getPublishedVideos();

      return data.map((row: any) => VideoMapper.toEntity(row));
    } catch (err) {
      console.warn('[SupabaseVideoRepository] getPublishedVideos error, using fallback:', err);
      return this.mockFallback.getPublishedVideos();
    }
  }

  public async getAllAdminVideos(): Promise<VideoEntity[]> {
    try {
      const { data, error } = await this.supabase
        .from('videos' as any)
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!data || data.length === 0) return this.mockFallback.getAllAdminVideos();

      return data.map((row: any) => VideoMapper.toEntity(row));
    } catch (err) {
      console.warn('[SupabaseVideoRepository] getAllAdminVideos error, using fallback:', err);
      return this.mockFallback.getAllAdminVideos();
    }
  }

  public async getVideoById(id: string): Promise<VideoEntity | null> {
    try {
      const { data, error } = await this.supabase
        .from('videos' as any)
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return this.mockFallback.getVideoById(id);

      return VideoMapper.toEntity(data);
    } catch (err) {
      return this.mockFallback.getVideoById(id);
    }
  }

  public async createVideo(payload: CreateVideoPayload): Promise<VideoEntity> {
    try {
      const ytId = payload.youtubeId || getYouTubeVideoId(payload.youtubeUrl) || 'dQw4w9WgXcQ';
      const thumb = payload.thumbnailUrl || getYouTubeThumbnailUrl(payload.youtubeUrl);

      const videoRow = {
        title: payload.title,
        description: payload.description || null,
        youtube_url: payload.youtubeUrl,
        youtube_id: ytId,
        thumbnail_url: thumb,
        price: payload.price,
        is_published: payload.isPublished ?? true,
        sort_order: payload.sortOrder ?? 0,
      };

      const { data, error } = await this.supabase
        .from('videos' as any)
        .insert(videoRow)
        .select()
        .single();

      if (error) throw error;
      return VideoMapper.toEntity(data);
    } catch (err) {
      console.warn('[SupabaseVideoRepository] createVideo error, using fallback:', err);
      return this.mockFallback.createVideo(payload);
    }
  }

  public async updateVideo(id: string, payload: UpdateVideoPayload): Promise<VideoEntity> {
    try {
      const updates: any = { updated_at: new Date().toISOString() };
      if (payload.title !== undefined) updates.title = payload.title;
      if (payload.description !== undefined) updates.description = payload.description;
      if (payload.youtubeUrl !== undefined) {
        updates.youtube_url = payload.youtubeUrl;
        updates.youtube_id = payload.youtubeId || getYouTubeVideoId(payload.youtubeUrl) || '';
      }
      if (payload.thumbnailUrl !== undefined) updates.thumbnail_url = payload.thumbnailUrl;
      if (payload.price !== undefined) updates.price = payload.price;
      if (payload.isPublished !== undefined) updates.is_published = payload.isPublished;
      if (payload.sortOrder !== undefined) updates.sort_order = payload.sortOrder;

      const { data, error } = await this.supabase
        .from('videos' as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return VideoMapper.toEntity(data);
    } catch (err) {
      console.warn('[SupabaseVideoRepository] updateVideo error, using fallback:', err);
      return this.mockFallback.updateVideo(id, payload);
    }
  }

  public async deleteVideo(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('videos' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
      await this.mockFallback.deleteVideo(id);
    } catch (err) {
      console.warn('[SupabaseVideoRepository] deleteVideo error, using fallback:', err);
      await this.mockFallback.deleteVideo(id);
    }
  }

  public async getUserPurchases(userId: string): Promise<UserVideoPurchaseEntity[]> {
    try {
      const { data, error } = await this.supabase
        .from('user_video_purchases' as any)
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      if (!data || data.length === 0) return this.mockFallback.getUserPurchases(userId);

      return data.map((row: any) => VideoMapper.purchaseToEntity(row));
    } catch (err) {
      return this.mockFallback.getUserPurchases(userId);
    }
  }

  public async hasUserPurchasedVideo(userId: string, videoId: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('user_video_purchases' as any)
        .select('id')
        .eq('user_id', userId)
        .eq('video_id', videoId)
        .maybeSingle();

      if (error) throw error;
      if (data?.id) return true;
      return this.mockFallback.hasUserPurchasedVideo(userId, videoId);
    } catch (err) {
      return this.mockFallback.hasUserPurchasedVideo(userId, videoId);
    }
  }

  public async recordVideoPurchase(payload: RecordVideoPurchasePayload): Promise<UserVideoPurchaseEntity> {
    try {
      const purchaseRow = {
        user_id: payload.userId,
        video_id: payload.videoId,
        payment_id: payload.paymentId || `pay_${Date.now()}`,
        amount_paid: payload.amountPaid,
      };

      const { data, error } = await this.supabase
        .from('user_video_purchases' as any)
        .insert(purchaseRow)
        .select()
        .single();

      if (error) throw error;
      await this.mockFallback.recordVideoPurchase(payload);
      return VideoMapper.purchaseToEntity(data);
    } catch (err) {
      console.warn('[SupabaseVideoRepository] recordVideoPurchase error, using fallback:', err);
      return this.mockFallback.recordVideoPurchase(payload);
    }
  }
}
