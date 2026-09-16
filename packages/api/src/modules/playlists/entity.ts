import type { Playlist, PlaylistVideo, UserPlaylistPurchase } from '@cinmax/types';

export class PlaylistVideoEntity implements PlaylistVideo {
  constructor(
    public id: string,
    public playlistId: string,
    public youtubeUrl: string,
    public youtubeId: string,
    public title: string,
    public thumbnailUrl?: string,
    public duration: string = '15 Mins',
    public sortOrder: number = 0,
    public createdAt: string = new Date().toISOString(),
    public updatedAt: string = new Date().toISOString()
  ) {}
}

export class PlaylistEntity implements Playlist {
  constructor(
    public id: string,
    public productId: string,
    public title: string,
    public description: string = '',
    public thumbnailUrl: string = '',
    public price: number = 0,
    public isPublished: boolean = true,
    public videos: PlaylistVideo[] = [],
    public productTitle: string = '',
    public productImage: string = '',
    public videoCount: number = 0,
    public totalDuration: string = '',
    public createdAt: string = new Date().toISOString(),
    public updatedAt: string = new Date().toISOString()
  ) {
    this.videoCount = videos.length;
  }
}

export class UserPlaylistPurchaseEntity implements UserPlaylistPurchase {
  constructor(
    public id: string,
    public userId: string,
    public playlistId: string,
    public productId: string = '',
    public razorpayOrderId: string = '',
    public razorpayPaymentId: string = '',
    public amount: number = 0,
    public paymentStatus: 'verified' | 'completed' | 'pending' | 'failed' = 'verified',
    public purchaseDate: string = new Date().toISOString(),
    public accessStatus: 'active' | 'revoked' = 'active'
  ) {}
}
