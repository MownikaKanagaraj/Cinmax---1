import { PlaylistEntity, PlaylistVideoEntity, UserPlaylistPurchaseEntity } from './entity';
import type {
  CreatePlaylistPayload,
  UpdatePlaylistPayload,
  CreatePlaylistVideoPayload,
  UpdatePlaylistVideoPayload,
  RecordPlaylistPurchasePayload,
} from './types';

export interface IPlaylistRepository {
  getPublishedPlaylists(): Promise<PlaylistEntity[]>;
  getAllAdminPlaylists(): Promise<PlaylistEntity[]>;
  getPlaylistsByProduct(productId: string): Promise<PlaylistEntity[]>;
  getPlaylistById(id: string): Promise<PlaylistEntity | null>;
  createPlaylist(payload: CreatePlaylistPayload): Promise<PlaylistEntity>;
  updatePlaylist(id: string, payload: UpdatePlaylistPayload): Promise<PlaylistEntity>;
  deletePlaylist(id: string): Promise<void>;
  
  addVideoToPlaylist(playlistId: string, payload: CreatePlaylistVideoPayload): Promise<PlaylistVideoEntity>;
  updatePlaylistVideo(videoId: string, payload: UpdatePlaylistVideoPayload): Promise<PlaylistVideoEntity>;
  deletePlaylistVideo(videoId: string): Promise<void>;
  
  getUserPurchases(userId: string): Promise<UserPlaylistPurchaseEntity[]>;
  verifyPlaylistAccess(userId: string, playlistId: string): Promise<boolean>;
  recordPlaylistPurchase(payload: RecordPlaylistPurchasePayload): Promise<UserPlaylistPurchaseEntity>;
}
