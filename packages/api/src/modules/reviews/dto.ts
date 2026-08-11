export interface ReviewDTO {
  id: string;
  product_id: string;
  user_id: string;
  author_name: string;
  rating: number;
  title: string;
  content: string;
  scent_rating?: number | null;
  lather_rating?: number | null;
  moisture_rating?: number | null;
  is_verified_purchaser: boolean;
  helpful_count: number;
  images?: string[] | null;
  created_at: string;
  updated_at: string;
}
