import { PlaylistEntity, PlaylistVideoEntity, UserPlaylistPurchaseEntity } from './entity';

export class PlaylistMapper {
  public static videoToEntity(row: any): PlaylistVideoEntity {
    return new PlaylistVideoEntity(
      row.id,
      row.playlist_id || row.playlistId,
      row.youtube_url || row.youtubeUrl,
      row.youtube_id || row.youtubeId,
      row.title,
      row.thumbnail_url || row.thumbnailUrl,
      row.duration || '15 Mins',
      Number(row.sort_order ?? row.sortOrder ?? 0),
      row.created_at || row.createdAt,
      row.updated_at || row.updatedAt
    );
  }

  public static toEntity(row: any, videos: any[] = [], productRow?: any): PlaylistEntity {
    const parsedVideos = videos.map((v) => (v instanceof PlaylistVideoEntity ? v : PlaylistMapper.videoToEntity(v)));
    const prodTitle = productRow?.title || row.product_title || row.productTitle || '';
    const prodImage = productRow?.images?.[0]?.url || row.product_image || row.productImage || '';

    return new PlaylistEntity(
      row.id,
      row.product_id || row.productId,
      row.title,
      row.description || '',
      row.thumbnail_url || row.thumbnailUrl || '',
      Number(row.price ?? 0),
      Boolean(row.is_published ?? row.isPublished ?? true),
      parsedVideos,
      prodTitle,
      prodImage,
      parsedVideos.length,
      '',
      row.created_at || row.createdAt,
      row.updated_at || row.updatedAt
    );
  }

  public static purchaseToEntity(row: any): UserPlaylistPurchaseEntity {
    return new UserPlaylistPurchaseEntity(
      row.id,
      row.user_id || row.userId,
      row.playlist_id || row.playlistId,
      row.product_id || row.productId || '',
      row.razorpay_order_id || row.razorpayOrderId || '',
      row.razorpay_payment_id || row.razorpayPaymentId || '',
      Number(row.amount ?? row.amount_paid ?? row.amountPaid ?? 0),
      row.payment_status || row.paymentStatus || 'verified',
      row.purchase_date || row.purchased_at || row.purchaseDate,
      row.access_status || row.accessStatus || 'active'
    );
  }
}
