export interface OrderDTO {
  id: string;
  order_number: string;
  user_id?: string | null;
  guest_email?: string | null;
  status: string;
  payment_status: string;
  payment_method?: string | null;
  payment_intent_id?: string | null;
  subtotal: number | string;
  discount_total: number | string;
  tax_total: number | string;
  shipping_total: number | string;
  grand_total: number | string;
  currency?: string | null;
  shipping_address: any;
  billing_address?: any | null;
  metadata?: Record<string, any> | null;
  items?: Array<{
    id: string;
    order_id: string;
    product_id: string;
    variant_id?: string | null;
    product_title: string;
    variant_title?: string | null;
    sku: string;
    unit_price: number | string;
    quantity: number;
    total_price: number | string;
    image_url?: string | null;
  }> | null;
  tracking_number?: string | null;
  carrier?: string | null;
  estimated_delivery_date?: string | null;
  timeline?: Array<{
    id: string;
    title: string;
    description?: string | null;
    timestamp: string;
    status: string;
  }> | null;
  created_at: string;
  updated_at: string;
}
