export interface CouponDTO {
  id: string;
  code: string;
  title: string;
  description?: string | null;
  discount_type: string;
  discount_value: number | string;
  min_order_amount?: number | string | null;
  max_discount_amount?: number | string | null;
  start_date: string;
  end_date: string;
  usage_limit?: number | null;
  usage_count: number;
  is_active: boolean;
}
