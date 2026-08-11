import type { ProductDTO } from '../products/dto';

export interface WishlistDTO {
  id: string;
  user_id?: string | null;
  product_ids: string[];
  products?: ProductDTO[] | null;
  created_at: string;
  updated_at: string;
}
