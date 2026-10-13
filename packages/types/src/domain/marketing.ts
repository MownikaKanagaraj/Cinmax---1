export interface TopOfferItem {
  id: string;
  text: string;
  linkUrl?: string;
  code?: string;
  minSubtotal?: number;
  offerType?: 'free_shipping' | 'coupon_code' | 'link' | 'announcement';
  isActive: boolean;
  sortOrder?: number;
}

export interface HeroBannerItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  badgeText?: string;
  buttonText: string;
  linkUrl: string;
  isActive: boolean;
}

export interface WatchShopVideoItem {
  id: string;
  title: string;
  slug: string;
  videoUrl: string;
  productName: string;
  productPrice: string;
  productImage: string;
  isActive: boolean;
}

export interface TransformationStoryItem {
  id: string;
  beforeUrl: string;
  afterUrl: string;
  quote: string;
  userName: string;
  isActive: boolean;
}

export interface TrustBadgeItem {
  id: string;
  label: string;
  iconName: string;
  isActive: boolean;
}

export interface PromoBannerConfig {
  title: string;
  subtitle: string;
  badgeText?: string;
  imageUrl: string;
  buttonText: string;
  linkUrl: string;
  isActive: boolean;
}

export interface ComboOfferItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  imageUrl: string;
  linkUrl?: string;
  bgColor?: string;
  borderColor?: string;
  badgeBg?: string;
  badgeTextColor?: string;
  sortOrder?: number;
  isActive: boolean;
}

export interface HomeMarketingSettings {
  topOffers: (string | TopOfferItem)[];
  heroBanners: HeroBannerItem[];
  watchShopVideos: WatchShopVideoItem[];
  midBanner: PromoBannerConfig;
  comboOffers?: ComboOfferItem[];
  realResults: TransformationStoryItem[];
  trustBadges: TrustBadgeItem[];
  bottomBanner: PromoBannerConfig;
  dispatchTimeDays?: number;
  updatedAt: string;
}

