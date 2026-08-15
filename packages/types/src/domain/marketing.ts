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

export interface HomeMarketingSettings {
  topOffers: string[];
  heroBanners: HeroBannerItem[];
  watchShopVideos: WatchShopVideoItem[];
  midBanner: PromoBannerConfig;
  realResults: TransformationStoryItem[];
  trustBadges: TrustBadgeItem[];
  bottomBanner: PromoBannerConfig;
  updatedAt: string;
}
