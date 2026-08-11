export interface BannerDTO {
  id: string;
  title: string;
  subtitle?: string | null;
  cta_text: string;
  cta_link: string;
  image_url: string;
  mobile_image_url?: string | null;
  badge_text?: string | null;
  background_color?: string | null;
  is_active: boolean;
  sort_order: number;
}
