export interface CartDTO {
  id: string;
  user_id?: string | null;
  anonymous_id?: string | null;
  items?: Array<{
    id: string;
    cart_id: string;
    product_id: string;
    variant_id?: string | null;
    product: {
      id: string;
      title: string;
      slug: string;
      images: Array<{ url: string; alt?: string | null; is_primary?: boolean | null }>;
      process_type: string;
    };
    variant?: {
      id: string;
      sku: string;
      title: string;
      price: number | string;
      weight_grams?: number | null;
      volume_ml?: number | null;
      options?: Record<string, string> | null;
    } | null;
    quantity: number;
    unit_price: number | string;
    total_price: number | string;
    created_at: string;
    updated_at: string;
  }> | null;
  applied_discount?: {
    code: string;
    discount_type: string;
    discount_value: number;
    description?: string | null;
  } | null;
  subtotal: number | string;
  discount_total: number | string;
  tax_total: number | string;
  shipping_total: number | string;
  grand_total: number | string;
  currency?: string | null;
  created_at: string;
  updated_at: string;
}
