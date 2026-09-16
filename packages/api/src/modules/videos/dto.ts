export interface VideoDTO {
  id: string;
  title: string;
  description: string | null;
  youtube_url: string;
  youtube_id: string;
  thumbnail_url: string | null;
  price: number;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface UserVideoPurchaseDTO {
  id: string;
  user_id: string;
  video_id: string;
  payment_id: string | null;
  amount_paid: number;
  purchased_at: string;
}
