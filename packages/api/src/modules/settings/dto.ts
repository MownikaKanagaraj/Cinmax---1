export interface AppSettingsDTO {
  app_name: string;
  currency: string;
  tax_rate: number | string;
  free_shipping_threshold: number | string;
  standard_shipping_fee: number | string;
  contact_email: string;
  support_phone?: string | null;
  dispatch_time_days?: number | string | null;
}
