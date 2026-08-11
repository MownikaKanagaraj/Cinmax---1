import type { SkinType, FragranceFamily } from './product';
import type { Address } from './order';

export type UserRole = 'customer' | 'admin' | 'super_admin' | 'inventory_manager';

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'azure_club';

export interface SkinProfile {
  primarySkinType: SkinType;
  secondarySkinType?: SkinType;
  skinConcerns: string[];
  preferredFragranceFamilies: FragranceFamily[];
  avoidIngredients: string[];
}

export interface CustomerProfile {
  id: string;
  authId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  loyaltyTier: LoyaltyTier;
  loyaltyPoints: number;
  skinProfile?: SkinProfile;
  defaultShippingAddressId?: string;
  defaultBillingAddressId?: string;
  savedAddresses: Address[];
  wishlistProductIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionFrequency = 'monthly' | 'bi_monthly' | 'quarterly';

export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'past_due';

export interface SoapSubscription {
  id: string;
  userId: string;
  planName: string; // e.g. "The Artisan Soap Box - 3 Curated Bars"
  frequency: SubscriptionFrequency;
  status: SubscriptionStatus;
  barQuantity: number;
  scentPreferences: FragranceFamily[];
  nextShipmentDate: string;
  pricePerShipment: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}
