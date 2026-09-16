import type { IPlaylistRepository } from './repository.interface';
import type {
  CreatePlaylistPayload,
  UpdatePlaylistPayload,
  CreatePlaylistVideoPayload,
  UpdatePlaylistVideoPayload,
  RecordPlaylistPurchasePayload,
} from './types';

export class PlaylistUseCases {
  constructor(private playlistRepo: IPlaylistRepository) {}

  public getPublishedPlaylists() {
    return this.playlistRepo.getPublishedPlaylists();
  }

  public getAllAdminPlaylists() {
    return this.playlistRepo.getAllAdminPlaylists();
  }

  public getPlaylistsByProduct(productId: string) {
    return this.playlistRepo.getPlaylistsByProduct(productId);
  }

  public getPlaylistById(id: string) {
    return this.playlistRepo.getPlaylistById(id);
  }

  public createPlaylist(payload: CreatePlaylistPayload) {
    return this.playlistRepo.createPlaylist(payload);
  }

  public updatePlaylist(id: string, payload: UpdatePlaylistPayload) {
    return this.playlistRepo.updatePlaylist(id, payload);
  }

  public deletePlaylist(id: string) {
    return this.playlistRepo.deletePlaylist(id);
  }

  public addVideoToPlaylist(playlistId: string, payload: CreatePlaylistVideoPayload) {
    return this.playlistRepo.addVideoToPlaylist(playlistId, payload);
  }

  public updatePlaylistVideo(videoId: string, payload: UpdatePlaylistVideoPayload) {
    return this.playlistRepo.updatePlaylistVideo(videoId, payload);
  }

  public deletePlaylistVideo(videoId: string) {
    return this.playlistRepo.deletePlaylistVideo(videoId);
  }

  public getUserPurchases(userId: string) {
    return this.playlistRepo.getUserPurchases(userId);
  }

  public verifyPlaylistAccess(userId: string, playlistId: string) {
    return this.playlistRepo.verifyPlaylistAccess(userId, playlistId);
  }

  public recordPlaylistPurchase(payload: RecordPlaylistPurchasePayload) {
    return this.playlistRepo.recordPlaylistPurchase(payload);
  }
}
