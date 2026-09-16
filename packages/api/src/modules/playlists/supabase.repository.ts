import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@cinmax/types';
import { PlaylistEntity, PlaylistVideoEntity, UserPlaylistPurchaseEntity } from './entity';
import { PlaylistMapper } from './mapper';
import type { IPlaylistRepository } from './repository.interface';
import type {
  CreatePlaylistPayload,
  UpdatePlaylistPayload,
  CreatePlaylistVideoPayload,
  UpdatePlaylistVideoPayload,
  RecordPlaylistPurchasePayload,
} from './types';
import { getYouTubeVideoId, getYouTubeThumbnailUrl } from '@cinmax/utils';
import { MockPlaylistRepository } from './mock.repository';

export class SupabasePlaylistRepository implements IPlaylistRepository {
  private mockFallback = new MockPlaylistRepository();

  constructor(private supabase: SupabaseClient<Database>) {}

  public async getPublishedPlaylists(): Promise<PlaylistEntity[]> {
    try {
      const { data: playlistsData, error } = await this.supabase
        .from('playlists' as any)
        .select(`
          *,
          product:products (id, title)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!playlistsData) return [];

      const playlistIds = playlistsData.map((row: any) => row.id);
      const { data: allVideos } = await this.supabase
        .from('playlist_videos' as any)
        .select('*')
        .in('playlist_id', playlistIds)
        .order('sort_order', { ascending: true });

      const videosByPlaylist = new Map<string, any[]>();
      (allVideos || []).forEach((v: any) => {
        const list = videosByPlaylist.get(v.playlist_id) || [];
        list.push(v);
        videosByPlaylist.set(v.playlist_id, list);
      });

      return playlistsData.map((row: any) =>
        PlaylistMapper.toEntity(row, videosByPlaylist.get(row.id) || [], row.product)
      );
    } catch (err) {
      console.warn('[SupabasePlaylistRepository] getPublishedPlaylists error, using fallback:', err);
      return this.mockFallback.getPublishedPlaylists();
    }
  }

  public async getAllAdminPlaylists(): Promise<PlaylistEntity[]> {
    try {
      const { data: playlistsData, error } = await this.supabase
        .from('playlists' as any)
        .select(`
          *,
          product:products (id, title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!playlistsData) return [];

      const playlistIds = playlistsData.map((row: any) => row.id);
      const { data: allVideos } = await this.supabase
        .from('playlist_videos' as any)
        .select('*')
        .in('playlist_id', playlistIds)
        .order('sort_order', { ascending: true });

      const videosByPlaylist = new Map<string, any[]>();
      (allVideos || []).forEach((v: any) => {
        const list = videosByPlaylist.get(v.playlist_id) || [];
        list.push(v);
        videosByPlaylist.set(v.playlist_id, list);
      });

      return playlistsData.map((row: any) =>
        PlaylistMapper.toEntity(row, videosByPlaylist.get(row.id) || [], row.product)
      );
    } catch (err) {
      console.warn('[SupabasePlaylistRepository] getAllAdminPlaylists error, using fallback:', err);
      return this.mockFallback.getAllAdminPlaylists();
    }
  }

  public async getPlaylistsByProduct(productId: string): Promise<PlaylistEntity[]> {
    try {
      const { data: playlistsData, error } = await this.supabase
        .from('playlists' as any)
        .select(`
          *,
          product:products (id, title)
        `)
        .eq('product_id', productId)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!playlistsData) return [];

      const results: PlaylistEntity[] = [];
      for (const row of playlistsData) {
        const { data: videosData } = await this.supabase
          .from('playlist_videos' as any)
          .select('*')
          .eq('playlist_id', row.id)
          .order('sort_order', { ascending: true });

        results.push(PlaylistMapper.toEntity(row, videosData || [], row.product));
      }

      return results;
    } catch (err) {
      console.warn('[SupabasePlaylistRepository] getPlaylistsByProduct error, using fallback:', err);
      return this.mockFallback.getPlaylistsByProduct(productId);
    }
  }

  public async getPlaylistById(id: string): Promise<PlaylistEntity | null> {
    try {
      const { data: row, error } = await this.supabase
        .from('playlists' as any)
        .select(`
          *,
          product:products (id, title)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!row) return this.mockFallback.getPlaylistById(id);

      const { data: videosData } = await this.supabase
        .from('playlist_videos' as any)
        .select('*')
        .eq('playlist_id', id)
        .order('sort_order', { ascending: true });

      return PlaylistMapper.toEntity(row, videosData || [], row.product);
    } catch (err) {
      console.warn('[SupabasePlaylistRepository] getPlaylistById error, using fallback:', err);
      return this.mockFallback.getPlaylistById(id);
    }
  }

  public async createPlaylist(payload: CreatePlaylistPayload): Promise<PlaylistEntity> {
    try {
      const isValidUuid = (id?: string) => Boolean(id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));
      const targetProductId = isValidUuid(payload.productId) ? payload.productId : null;

      const playlistRow = {
        product_id: targetProductId,
        title: payload.title,
        description: payload.description || null,
        thumbnail_url: payload.thumbnailUrl || null,
        price: payload.price,
        is_published: payload.isPublished ?? true,
      };

      const { data: createdPlaylist, error } = await this.supabase
        .from('playlists' as any)
        .insert(playlistRow)
        .select()
        .single();

      if (error) throw error;

      const createdVideos: any[] = [];
      if (payload.videos && payload.videos.length > 0) {
        const videoRows = payload.videos.map((v, idx) => {
          const ytId = v.youtubeId || getYouTubeVideoId(v.youtubeUrl) || 'dQw4w9WgXcQ';
          const thumb = v.thumbnailUrl || getYouTubeThumbnailUrl(v.youtubeUrl);
          return {
            playlist_id: createdPlaylist.id,
            youtube_url: v.youtubeUrl,
            youtube_id: ytId,
            title: v.title,
            thumbnail_url: thumb,
            duration: v.duration || '15 Mins',
            sort_order: v.sortOrder ?? idx + 1,
          };
        });

        const { data: vData } = await this.supabase
          .from('playlist_videos' as any)
          .insert(videoRows)
          .select();
        if (vData) createdVideos.push(...vData);
      }

      await this.mockFallback.createPlaylist(payload);
      return PlaylistMapper.toEntity(createdPlaylist, createdVideos);
    } catch (err) {
      console.warn('[SupabasePlaylistRepository] createPlaylist error, using fallback:', err);
      return this.mockFallback.createPlaylist(payload);
    }
  }

  public async updatePlaylist(id: string, payload: UpdatePlaylistPayload): Promise<PlaylistEntity> {
    try {
      const isValidUuid = (id?: string) => Boolean(id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));
      const updates: any = { updated_at: new Date().toISOString() };
      if (payload.productId !== undefined) {
        updates.product_id = isValidUuid(payload.productId) ? payload.productId : null;
      }
      if (payload.title !== undefined) updates.title = payload.title;
      if (payload.description !== undefined) updates.description = payload.description;
      if (payload.thumbnailUrl !== undefined) updates.thumbnail_url = payload.thumbnailUrl;
      if (payload.price !== undefined) updates.price = payload.price;
      if (payload.isPublished !== undefined) updates.is_published = payload.isPublished;

      const { data: updatedPlaylist, error } = await this.supabase
        .from('playlists' as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Handle Videos reorder / update if provided
      if (payload.videos) {
        // Clear and re-insert for clean video order sync
        await this.supabase.from('playlist_videos' as any).delete().eq('playlist_id', id);
        
        const videoRows = payload.videos.map((v, idx) => ({
          playlist_id: id,
          youtube_url: v.youtubeUrl,
          youtube_id: v.youtubeId || getYouTubeVideoId(v.youtubeUrl) || 'dQw4w9WgXcQ',
          title: v.title,
          thumbnail_url: v.thumbnailUrl || getYouTubeThumbnailUrl(v.youtubeUrl),
          duration: v.duration || '15 Mins',
          sort_order: v.sortOrder ?? idx + 1,
        }));

        if (videoRows.length > 0) {
          await this.supabase.from('playlist_videos' as any).insert(videoRows);
        }
      }

      const { data: videosData } = await this.supabase
        .from('playlist_videos' as any)
        .select('*')
        .eq('playlist_id', id)
        .order('sort_order', { ascending: true });

      await this.mockFallback.updatePlaylist(id, payload);
      return PlaylistMapper.toEntity(updatedPlaylist, videosData || []);
    } catch (err) {
      console.warn('[SupabasePlaylistRepository] updatePlaylist error, using fallback:', err);
      return this.mockFallback.updatePlaylist(id, payload);
    }
  }

  public async deletePlaylist(id: string): Promise<void> {
    try {
      const { error } = await this.supabase.from('playlists' as any).delete().eq('id', id);
      if (error) throw error;
      await this.mockFallback.deletePlaylist(id);
    } catch (err) {
      console.warn('[SupabasePlaylistRepository] deletePlaylist error, using fallback:', err);
      await this.mockFallback.deletePlaylist(id);
    }
  }

  public async addVideoToPlaylist(playlistId: string, payload: CreatePlaylistVideoPayload): Promise<PlaylistVideoEntity> {
    try {
      const ytId = payload.youtubeId || getYouTubeVideoId(payload.youtubeUrl) || 'dQw4w9WgXcQ';
      const thumb = payload.thumbnailUrl || getYouTubeThumbnailUrl(payload.youtubeUrl);

      const videoRow = {
        playlist_id: playlistId,
        youtube_url: payload.youtubeUrl,
        youtube_id: ytId,
        title: payload.title,
        thumbnail_url: thumb,
        duration: payload.duration || '15 Mins',
        sort_order: payload.sortOrder ?? 0,
      };

      const { data, error } = await this.supabase
        .from('playlist_videos' as any)
        .insert(videoRow)
        .select()
        .single();

      if (error) throw error;

      await this.mockFallback.addVideoToPlaylist(playlistId, payload);
      return PlaylistMapper.videoToEntity(data);
    } catch (err) {
      console.warn('[SupabasePlaylistRepository] addVideoToPlaylist error, using fallback:', err);
      return this.mockFallback.addVideoToPlaylist(playlistId, payload);
    }
  }

  public async updatePlaylistVideo(videoId: string, payload: UpdatePlaylistVideoPayload): Promise<PlaylistVideoEntity> {
    try {
      const updates: any = { updated_at: new Date().toISOString() };
      if (payload.title !== undefined) updates.title = payload.title;
      if (payload.youtubeUrl !== undefined) {
        updates.youtube_url = payload.youtubeUrl;
        updates.youtube_id = payload.youtubeId || getYouTubeVideoId(payload.youtubeUrl) || '';
      }
      if (payload.thumbnailUrl !== undefined) updates.thumbnail_url = payload.thumbnailUrl;
      if (payload.duration !== undefined) updates.duration = payload.duration;
      if (payload.sortOrder !== undefined) updates.sort_order = payload.sortOrder;

      const { data, error } = await this.supabase
        .from('playlist_videos' as any)
        .update(updates)
        .eq('id', videoId)
        .select()
        .single();

      if (error) throw error;

      await this.mockFallback.updatePlaylistVideo(videoId, payload);
      return PlaylistMapper.videoToEntity(data);
    } catch (err) {
      console.warn('[SupabasePlaylistRepository] updatePlaylistVideo error, using fallback:', err);
      return this.mockFallback.updatePlaylistVideo(videoId, payload);
    }
  }

  public async deletePlaylistVideo(videoId: string): Promise<void> {
    try {
      const { error } = await this.supabase.from('playlist_videos' as any).delete().eq('id', videoId);
      if (error) throw error;
      await this.mockFallback.deletePlaylistVideo(videoId);
    } catch (err) {
      console.warn('[SupabasePlaylistRepository] deletePlaylistVideo error, using fallback:', err);
      await this.mockFallback.deletePlaylistVideo(videoId);
    }
  }

  public async getUserPurchases(userId: string): Promise<UserPlaylistPurchaseEntity[]> {
    try {
      const { data, error } = await this.supabase
        .from('user_playlist_purchases' as any)
        .select('*')
        .eq('user_id', userId)
        .eq('access_status', 'active');

      if (error) throw error;
      if (!data || data.length === 0) return this.mockFallback.getUserPurchases(userId);

      return data.map((row: any) => PlaylistMapper.purchaseToEntity(row));
    } catch (err) {
      return this.mockFallback.getUserPurchases(userId);
    }
  }

  public async verifyPlaylistAccess(userId: string, playlistId: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('user_playlist_purchases' as any)
        .select('id, payment_status, access_status')
        .eq('user_id', userId)
        .eq('playlist_id', playlistId)
        .eq('access_status', 'active')
        .maybeSingle();

      if (error) throw error;
      if (data?.id && (data.payment_status === 'verified' || data.payment_status === 'completed')) {
        return true;
      }
      return this.mockFallback.verifyPlaylistAccess(userId, playlistId);
    } catch (err) {
      return this.mockFallback.verifyPlaylistAccess(userId, playlistId);
    }
  }

  public async recordPlaylistPurchase(payload: RecordPlaylistPurchasePayload): Promise<UserPlaylistPurchaseEntity> {
    try {
      const purchaseRow = {
        user_id: payload.userId,
        playlist_id: payload.playlistId,
        product_id: payload.productId || null,
        razorpay_order_id: payload.razorpayOrderId || null,
        razorpay_payment_id: payload.razorpayPaymentId || `pay_${Date.now()}`,
        amount: payload.amountPaid,
        payment_status: payload.paymentStatus || 'verified',
        access_status: 'active',
      };

      const { data, error } = await this.supabase
        .from('user_playlist_purchases' as any)
        .insert(purchaseRow)
        .select()
        .single();

      if (error) throw error;
      await this.mockFallback.recordPlaylistPurchase(payload);
      return PlaylistMapper.purchaseToEntity(data);
    } catch (err) {
      console.warn('[SupabasePlaylistRepository] recordPlaylistPurchase error, using fallback:', err);
      return this.mockFallback.recordPlaylistPurchase(payload);
    }
  }
}
