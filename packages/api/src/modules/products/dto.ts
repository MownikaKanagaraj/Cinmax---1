export interface ProductDTO {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description: string;
  how_to_use?: string | null;
  process_type: string;
  category_id: string;
  category?: {
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    image_url?: string | null;
    parent_id?: string | null;
    sort_order: number;
    is_active: boolean;
  } | null;
  base_price: number | string;
  compare_at_price?: number | string | null;
  currency?: string | null;
  images?: Array<{
    id: string;
    url: string;
    alt?: string | null;
    sort_order?: number | null;
    is_primary?: boolean | null;
  }> | null;
  variants?: Array<{
    id: string;
    product_id: string;
    sku: string;
    title: string;
    weight_grams?: number | null;
    volume_ml?: number | null;
    price: number | string;
    compare_at_price?: number | string | null;
    inventory_quantity: number;
    low_stock_threshold: number;
    is_available: boolean;
    options?: Record<string, any> | null;
  }> | null;
  ingredients?: Array<{
    id: string;
    name: string;
    inci_name?: string | null;
    purpose?: string | null;
    is_organic: boolean;
    is_key_botanical: boolean;
    sort_order: number;
  }> | null;
  skin_types?: string[] | null;
  fragrance_family?: string | null;
  certifications?: string[] | null;
  is_featured?: boolean | null;
  is_new?: boolean | null;
  is_best_seller?: boolean | null;
  min_order_quantity?: number | string | null;
  quantity_price?: number | string | null;
  average_rating?: number | null;
  review_count?: number | null;
  created_at: string;
  updated_at: string;
}
