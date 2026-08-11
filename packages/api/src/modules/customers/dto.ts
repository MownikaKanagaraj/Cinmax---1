export interface CustomerDTO {
  id: string;
  auth_id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  role: string;
  loyalty_tier: string;
  loyalty_points: number;
  saved_addresses?: any[] | null;
  wishlist_product_ids?: string[] | null;
  created_at: string;
  updated_at: string;
}
