import { VideoEntity, UserVideoPurchaseEntity } from './entity';
import type { CreateVideoPayload, UpdateVideoPayload, RecordVideoPurchasePayload } from './types';

export interface IVideoRepository {
  getPublishedVideos(): Promise<VideoEntity[]>;
  getAllAdminVideos(): Promise<VideoEntity[]>;
  getVideoById(id: string): Promise<VideoEntity | null>;
  createVideo(payload: CreateVideoPayload): Promise<VideoEntity>;
  updateVideo(id: string, payload: UpdateVideoPayload): Promise<VideoEntity>;
  deleteVideo(id: string): Promise<void>;
  getUserPurchases(userId: string): Promise<UserVideoPurchaseEntity[]>;
  hasUserPurchasedVideo(userId: string, videoId: string): Promise<boolean>;
  recordVideoPurchase(payload: RecordVideoPurchasePayload): Promise<UserVideoPurchaseEntity>;
}
