// ==============================================================================
// CINMAX Global Products - Product-Wise Playlist & Access Control Models
// ==============================================================================

export interface PlaylistVideo {
  id: string;
  playlistId: string;
  youtubeUrl: string;
  youtubeId: string;
  title: string;
  thumbnailUrl?: string;
  duration?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Playlist {
  id: string;
  productId: string;
  productTitle?: string;
  productImage?: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  price: number;
  isPublished: boolean;
  videos: PlaylistVideo[];
  videoCount?: number;
  totalDuration?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPlaylistPurchase {
  id: string;
  userId: string;
  playlistId: string;
  productId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amount: number;
  paymentStatus: 'verified' | 'completed' | 'pending' | 'failed';
  purchaseDate: string;
  accessStatus: 'active' | 'revoked';
}

export interface CreatePlaylistPayload {
  productId: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  price: number;
  isPublished?: boolean;
  videos?: CreatePlaylistVideoPayload[];
}

export interface UpdatePlaylistPayload {
  productId?: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  price?: number;
  isPublished?: boolean;
  videos?: PlaylistVideo[];
}

export interface CreatePlaylistVideoPayload {
  playlistId?: string;
  youtubeUrl: string;
  youtubeId?: string;
  title: string;
  thumbnailUrl?: string;
  duration?: string;
  sortOrder?: number;
}

export interface UpdatePlaylistVideoPayload {
  youtubeUrl?: string;
  youtubeId?: string;
  title?: string;
  thumbnailUrl?: string;
  duration?: string;
  sortOrder?: number;
}

export interface RecordPlaylistPurchasePayload {
  userId: string;
  playlistId: string;
  productId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amountPaid: number;
  paymentStatus?: 'verified' | 'completed';
}
