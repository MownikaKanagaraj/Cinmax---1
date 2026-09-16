export interface CreateVideoPayload {
  title: string;
  description?: string;
  youtubeUrl: string;
  youtubeId?: string;
  thumbnailUrl?: string;
  price: number;
  isPublished?: boolean;
  sortOrder?: number;
}

export interface UpdateVideoPayload {
  title?: string;
  description?: string;
  youtubeUrl?: string;
  youtubeId?: string;
  thumbnailUrl?: string;
  price?: number;
  isPublished?: boolean;
  sortOrder?: number;
}

export interface RecordVideoPurchasePayload {
  userId: string;
  videoId: string;
  paymentId?: string;
  amountPaid: number;
}
