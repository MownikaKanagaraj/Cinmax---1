import { PlaylistEntity, PlaylistVideoEntity, UserPlaylistPurchaseEntity } from './entity';
import type { IPlaylistRepository } from './repository.interface';
import type {
  CreatePlaylistPayload,
  UpdatePlaylistPayload,
  CreatePlaylistVideoPayload,
  UpdatePlaylistVideoPayload,
  RecordPlaylistPurchasePayload,
} from './types';
import { getYouTubeVideoId, getYouTubeThumbnailUrl } from '@cinmax/utils';

export class MockPlaylistRepository implements IPlaylistRepository {
  private playlists: PlaylistEntity[] = [
    new PlaylistEntity(
      'p1000000-0000-0000-0000-000000000001',
      'b1000000-0000-0000-0000-000000000001',
      'Master Marine Botanical Soapmaking Class',
      'Complete masterclass on wild-harvested sea kelp infusion, slow cold-cure soapmaking, and bergamot essential oil formulation.',
      'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800&auto=format&fit=crop&q=80',
      299,
      true,
      [
        new PlaylistVideoEntity('v1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 'Lesson 1: Introduction to Botanical Soap Chemistry', 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', '12 Mins', 1),
        new PlaylistVideoEntity('v1000000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000001', 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ', '3JZ_D3ELwOQ', 'Lesson 2: Atlantic Sea Kelp Oil Infusion & Lye Safety', 'https://img.youtube.com/vi/3JZ_D3ELwOQ/hqdefault.jpg', '18 Mins', 2),
        new PlaylistVideoEntity('v1000000-0000-0000-0000-000000000003', 'p1000000-0000-0000-0000-000000000001', 'https://www.youtube.com/watch?v=L_LUpnjgPso', 'L_LUpnjgPso', 'Lesson 3: Cold-Process Temperature Control & Emulsification', 'https://img.youtube.com/vi/L_LUpnjgPso/hqdefault.jpg', '22 Mins', 3),
        new PlaylistVideoEntity('v1000000-0000-0000-0000-000000000004', 'p1000000-0000-0000-0000-000000000001', 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ', 'fJ9rUzIMcZQ', 'Lesson 4: Pouring, Swirling, and Marine Texture Design', 'https://img.youtube.com/vi/fJ9rUzIMcZQ/hqdefault.jpg', '15 Mins', 4),
        new PlaylistVideoEntity('v1000000-0000-0000-0000-000000000005', 'p1000000-0000-0000-0000-000000000001', 'https://www.youtube.com/watch?v=9bZkp7q19f0', '9bZkp7q19f0', 'Lesson 5: 6-Week Curing Routine & Final pH Verification', 'https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg', '14 Mins', 5),
      ],
      'Azure Marine Botanical Bar',
      'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800&auto=format&fit=crop&q=80'
    ),
    new PlaylistEntity(
      'p1000000-0000-0000-0000-000000000002',
      'b1000000-0000-0000-0000-000000000002',
      'French Lavender & Cashmere Formulation Masterclass',
      'In-depth masterclass covering high-altitude lavender scent compounding, Ghanaian shea butter melting, and soothing barrier repair chemistry.',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop&q=80',
      399,
      true,
      [
        new PlaylistVideoEntity('v2000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000002', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 'Module 1: Lavender Aromatherapy & Scent Compounding', 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', '14 Mins', 1),
        new PlaylistVideoEntity('v2000000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000002', 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ', '3JZ_D3ELwOQ', 'Module 2: Raw Ghanaian Shea Butter Processing', 'https://img.youtube.com/vi/3JZ_D3ELwOQ/hqdefault.jpg', '20 Mins', 2),
        new PlaylistVideoEntity('v2000000-0000-0000-0000-000000000003', 'p1000000-0000-0000-0000-000000000002', 'https://www.youtube.com/watch?v=L_LUpnjgPso', 'L_LUpnjgPso', 'Module 3: Formulation Ratios & Fatty Acid Balancing', 'https://img.youtube.com/vi/L_LUpnjgPso/hqdefault.jpg', '25 Mins', 3),
        new PlaylistVideoEntity('v2000000-0000-0000-0000-000000000004', 'p1000000-0000-0000-0000-000000000002', 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ', 'fJ9rUzIMcZQ', 'Module 4: Cashmere Smooth Texture Whipping Techniques', 'https://img.youtube.com/vi/fJ9rUzIMcZQ/hqdefault.jpg', '18 Mins', 4),
        new PlaylistVideoEntity('v2000000-0000-0000-0000-000000000005', 'p1000000-0000-0000-0000-000000000002', 'https://www.youtube.com/watch?v=9bZkp7q19f0', '9bZkp7q19f0', 'Module 5: Sensitive Skin Patch Testing & Moisture Barrier Science', 'https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg', '16 Mins', 5),
        new PlaylistVideoEntity('v2000000-0000-0000-0000-000000000006', 'p1000000-0000-0000-0000-000000000002', 'https://www.youtube.com/watch?v=kJQP7kiw5Fk', 'kJQP7kiw5Fk', 'Module 6: Packaging, Storage & Shelf-Life Optimization', 'https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg', '10 Mins', 6),
      ],
      'French Lavender & Cashmere Soap',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop&q=80'
    )
  ];

  private purchases: UserPlaylistPurchaseEntity[] = [];

  public async getPublishedPlaylists(): Promise<PlaylistEntity[]> {
    return this.playlists.filter((p) => p.isPublished);
  }

  public async getAllAdminPlaylists(): Promise<PlaylistEntity[]> {
    return this.playlists;
  }

  public async getPlaylistsByProduct(productId: string): Promise<PlaylistEntity[]> {
    return this.playlists.filter((p) => p.productId === productId);
  }

  public async getPlaylistById(id: string): Promise<PlaylistEntity | null> {
    return this.playlists.find((p) => p.id === id) || null;
  }

  public async createPlaylist(payload: CreatePlaylistPayload): Promise<PlaylistEntity> {
    const newId = `p_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const initialVideos = (payload.videos || []).map((v, idx) => {
      const ytId = v.youtubeId || getYouTubeVideoId(v.youtubeUrl) || 'dQw4w9WgXcQ';
      const thumb = v.thumbnailUrl || getYouTubeThumbnailUrl(v.youtubeUrl);
      return new PlaylistVideoEntity(
        `v_${Date.now()}_${idx}`,
        newId,
        v.youtubeUrl,
        ytId,
        v.title,
        thumb,
        v.duration || '15 Mins',
        v.sortOrder ?? idx + 1
      );
    });

    const newPlaylist = new PlaylistEntity(
      newId,
      payload.productId,
      payload.title,
      payload.description || '',
      payload.thumbnailUrl || '',
      payload.price,
      payload.isPublished ?? true,
      initialVideos
    );

    this.playlists.unshift(newPlaylist);
    return newPlaylist;
  }

  public async updatePlaylist(id: string, payload: UpdatePlaylistPayload): Promise<PlaylistEntity> {
    const existingIndex = this.playlists.findIndex((p) => p.id === id);
    if (existingIndex === -1) {
      throw new Error(`Playlist with ID ${id} not found.`);
    }

    const current = this.playlists[existingIndex];
    let updatedVideos = current.videos;

    if (payload.videos) {
      updatedVideos = payload.videos.map((v, idx) => {
        const ytId = v.youtubeId || getYouTubeVideoId(v.youtubeUrl) || 'dQw4w9WgXcQ';
        const thumb = v.thumbnailUrl || getYouTubeThumbnailUrl(v.youtubeUrl);
        return new PlaylistVideoEntity(
          v.id || `v_${Date.now()}_${idx}`,
          id,
          v.youtubeUrl,
          ytId,
          v.title,
          thumb,
          v.duration || '15 Mins',
          v.sortOrder ?? idx + 1
        );
      });
    }

    const updated = new PlaylistEntity(
      id,
      payload.productId !== undefined ? payload.productId : current.productId,
      payload.title !== undefined ? payload.title : current.title,
      payload.description !== undefined ? payload.description : current.description,
      payload.thumbnailUrl !== undefined ? payload.thumbnailUrl : current.thumbnailUrl,
      payload.price !== undefined ? payload.price : current.price,
      payload.isPublished !== undefined ? payload.isPublished : current.isPublished,
      updatedVideos,
      current.productTitle,
      current.productImage,
      updatedVideos.length,
      current.totalDuration,
      current.createdAt,
      new Date().toISOString()
    );

    this.playlists[existingIndex] = updated;
    return updated;
  }

  public async deletePlaylist(id: string): Promise<void> {
    this.playlists = this.playlists.filter((p) => p.id !== id);
  }

  public async addVideoToPlaylist(playlistId: string, payload: CreatePlaylistVideoPayload): Promise<PlaylistVideoEntity> {
    const playlist = await this.getPlaylistById(playlistId);
    if (!playlist) throw new Error('Playlist not found');

    const ytId = payload.youtubeId || getYouTubeVideoId(payload.youtubeUrl) || 'dQw4w9WgXcQ';
    const thumb = payload.thumbnailUrl || getYouTubeThumbnailUrl(payload.youtubeUrl);
    const newVideo = new PlaylistVideoEntity(
      `v_${Date.now()}`,
      playlistId,
      payload.youtubeUrl,
      ytId,
      payload.title,
      thumb,
      payload.duration || '15 Mins',
      payload.sortOrder ?? playlist.videos.length + 1
    );

    playlist.videos.push(newVideo);
    playlist.videoCount = playlist.videos.length;
    return newVideo;
  }

  public async updatePlaylistVideo(videoId: string, payload: UpdatePlaylistVideoPayload): Promise<PlaylistVideoEntity> {
    for (const pl of this.playlists) {
      const vIdx = pl.videos.findIndex((v) => v.id === videoId);
      if (vIdx !== -1) {
        const cur = pl.videos[vIdx];
        const ytId = payload.youtubeUrl ? (payload.youtubeId || getYouTubeVideoId(payload.youtubeUrl) || cur.youtubeId) : cur.youtubeId;
        const thumb = payload.youtubeUrl ? (payload.thumbnailUrl || getYouTubeThumbnailUrl(payload.youtubeUrl)) : (payload.thumbnailUrl || cur.thumbnailUrl);

        const updated = new PlaylistVideoEntity(
          videoId,
          cur.playlistId,
          payload.youtubeUrl || cur.youtubeUrl,
          ytId,
          payload.title || cur.title,
          thumb,
          payload.duration || cur.duration,
          payload.sortOrder ?? cur.sortOrder,
          cur.createdAt,
          new Date().toISOString()
        );
        pl.videos[vIdx] = updated;
        return updated;
      }
    }
    throw new Error('Playlist video not found');
  }

  public async deletePlaylistVideo(videoId: string): Promise<void> {
    for (const pl of this.playlists) {
      pl.videos = pl.videos.filter((v) => v.id !== videoId);
      pl.videoCount = pl.videos.length;
    }
  }

  public async getUserPurchases(userId: string): Promise<UserPlaylistPurchaseEntity[]> {
    return this.purchases.filter((p) => p.userId === userId && p.accessStatus === 'active');
  }

  public async verifyPlaylistAccess(userId: string, playlistId: string): Promise<boolean> {
    return this.purchases.some(
      (p) => p.userId === userId && p.playlistId === playlistId && (p.paymentStatus === 'verified' || p.paymentStatus === 'completed') && p.accessStatus === 'active'
    );
  }

  public async recordPlaylistPurchase(payload: RecordPlaylistPurchasePayload): Promise<UserPlaylistPurchaseEntity> {
    const existing = this.purchases.find((p) => p.userId === payload.userId && p.playlistId === payload.playlistId);
    if (existing) return existing;

    const newPurchase = new UserPlaylistPurchaseEntity(
      `pur_${Date.now()}`,
      payload.userId,
      payload.playlistId,
      payload.productId || '',
      payload.razorpayOrderId || `order_${Date.now()}`,
      payload.razorpayPaymentId || `pay_${Date.now()}`,
      payload.amountPaid,
      payload.paymentStatus || 'verified',
      new Date().toISOString(),
      'active'
    );

    this.purchases.push(newPurchase);
    return newPurchase;
  }
}
