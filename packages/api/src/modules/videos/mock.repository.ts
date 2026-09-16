import { VideoEntity, UserVideoPurchaseEntity } from './entity';
import type { IVideoRepository } from './repository.interface';
import type { CreateVideoPayload, UpdateVideoPayload, RecordVideoPurchasePayload } from './types';
import { getYouTubeVideoId, getYouTubeThumbnailUrl } from '@cinmax/utils';

export class MockVideoRepository implements IVideoRepository {
  private videos: VideoEntity[] = [
    new VideoEntity(
      'v1',
      'Artisanal Cold-Process Soapmaking Masterclass',
      'Learn the traditional cold-process formulation techniques, lye safety, botanical infusion, and essential oil blending from master artisans.',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'dQw4w9WgXcQ',
      'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
      299,
      true,
      1,
      new Date().toISOString(),
      new Date().toISOString()
    ),
    new VideoEntity(
      'v2',
      'Organic Herbal Balm & Salve Crafting',
      'Step-by-step guide to formulating soothing botanical salves, beeswax melting ratios, and calendula oil extraction for ultra-hydrating skin balms.',
      'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
      '3JZ_D3ELwOQ',
      'https://img.youtube.com/vi/3JZ_D3ELwOQ/hqdefault.jpg',
      199,
      true,
      2,
      new Date().toISOString(),
      new Date().toISOString()
    ),
    new VideoEntity(
      'v3',
      'Natural Skin Therapeutics & Essential Oil Blending',
      'Discover how to craft custom aromatherapy scent profiles and select non-comedogenic carrier oils for therapeutic body soaps.',
      'https://www.youtube.com/watch?v=L_LUpnjgPso',
      'L_LUpnjgPso',
      'https://img.youtube.com/vi/L_LUpnjgPso/hqdefault.jpg',
      0,
      true,
      3,
      new Date().toISOString(),
      new Date().toISOString()
    ),
  ];

  private purchases: UserVideoPurchaseEntity[] = [];

  public async getPublishedVideos(): Promise<VideoEntity[]> {
    return this.videos
      .filter((v) => v.isPublished)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public async getAllAdminVideos(): Promise<VideoEntity[]> {
    return [...this.videos].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public async getVideoById(id: string): Promise<VideoEntity | null> {
    return this.videos.find((v) => v.id === id) || null;
  }

  public async createVideo(payload: CreateVideoPayload): Promise<VideoEntity> {
    const ytId = payload.youtubeId || getYouTubeVideoId(payload.youtubeUrl) || 'dQw4w9WgXcQ';
    const thumb = payload.thumbnailUrl || getYouTubeThumbnailUrl(payload.youtubeUrl);
    const newVideo = new VideoEntity(
      `v_${Date.now()}`,
      payload.title,
      payload.description || null,
      payload.youtubeUrl,
      ytId,
      thumb,
      payload.price,
      payload.isPublished ?? true,
      payload.sortOrder ?? this.videos.length + 1,
      new Date().toISOString(),
      new Date().toISOString()
    );
    this.videos.push(newVideo);
    return newVideo;
  }

  public async updateVideo(id: string, payload: UpdateVideoPayload): Promise<VideoEntity> {
    const index = this.videos.findIndex((v) => v.id === id);
    if (index === -1) throw new Error(`Video not found: ${id}`);
    const existing = this.videos[index];
    const ytId = payload.youtubeUrl
      ? getYouTubeVideoId(payload.youtubeUrl) || existing.youtubeId
      : existing.youtubeId;

    const updated = new VideoEntity(
      existing.id,
      payload.title ?? existing.title,
      payload.description !== undefined ? payload.description : existing.description,
      payload.youtubeUrl ?? existing.youtubeUrl,
      ytId,
      payload.thumbnailUrl ?? existing.thumbnailUrl,
      payload.price ?? existing.price,
      payload.isPublished ?? existing.isPublished,
      payload.sortOrder ?? existing.sortOrder,
      existing.createdAt,
      new Date().toISOString()
    );
    this.videos[index] = updated;
    return updated;
  }

  public async deleteVideo(id: string): Promise<void> {
    this.videos = this.videos.filter((v) => v.id !== id);
  }

  public async getUserPurchases(userId: string): Promise<UserVideoPurchaseEntity[]> {
    return this.purchases.filter((p) => p.userId === userId);
  }

  public async hasUserPurchasedVideo(userId: string, videoId: string): Promise<boolean> {
    return this.purchases.some((p) => p.userId === userId && p.videoId === videoId);
  }

  public async recordVideoPurchase(payload: RecordVideoPurchasePayload): Promise<UserVideoPurchaseEntity> {
    const existing = this.purchases.find(
      (p) => p.userId === payload.userId && p.videoId === payload.videoId
    );
    if (existing) return existing;

    const newPurchase = new UserVideoPurchaseEntity(
      `uvp_${Date.now()}`,
      payload.userId,
      payload.videoId,
      payload.paymentId || `pay_${Date.now()}`,
      payload.amountPaid,
      new Date().toISOString()
    );
    this.purchases.push(newPurchase);
    return newPurchase;
  }
}
