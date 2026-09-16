import { VideoEntity, UserVideoPurchaseEntity } from './entity';
import type { IVideoRepository } from './repository.interface';
import type { CreateVideoPayload, UpdateVideoPayload, RecordVideoPurchasePayload } from './types';

export class GetVideosUseCase {
  constructor(private repository: IVideoRepository) {}

  public async execute(publishedOnly = true): Promise<VideoEntity[]> {
    if (publishedOnly) {
      return this.repository.getPublishedVideos();
    }
    return this.repository.getAllAdminVideos();
  }
}

export class GetVideoByIdUseCase {
  constructor(private repository: IVideoRepository) {}

  public async execute(id: string): Promise<VideoEntity | null> {
    return this.repository.getVideoById(id);
  }
}

export class CreateVideoUseCase {
  constructor(private repository: IVideoRepository) {}

  public async execute(payload: CreateVideoPayload): Promise<VideoEntity> {
    return this.repository.createVideo(payload);
  }
}

export class UpdateVideoUseCase {
  constructor(private repository: IVideoRepository) {}

  public async execute(id: string, payload: UpdateVideoPayload): Promise<VideoEntity> {
    return this.repository.updateVideo(id, payload);
  }
}

export class DeleteVideoUseCase {
  constructor(private repository: IVideoRepository) {}

  public async execute(id: string): Promise<void> {
    return this.repository.deleteVideo(id);
  }
}

export class GetUserVideoPurchasesUseCase {
  constructor(private repository: IVideoRepository) {}

  public async execute(userId: string): Promise<UserVideoPurchaseEntity[]> {
    return this.repository.getUserPurchases(userId);
  }
}

export class PurchaseVideoUseCase {
  constructor(private repository: IVideoRepository) {}

  public async execute(payload: RecordVideoPurchasePayload): Promise<UserVideoPurchaseEntity> {
    return this.repository.recordVideoPurchase(payload);
  }
}
