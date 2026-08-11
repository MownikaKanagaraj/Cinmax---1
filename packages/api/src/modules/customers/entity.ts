import type { CustomerProfile, Address, LoyaltyTier, UserRole } from '@cinmax/types';

export class CustomerEntity implements CustomerProfile {
  public id: string;
  public authId: string;
  public email: string;
  public firstName?: string;
  public lastName?: string;
  public phone?: string;
  public avatarUrl?: string;
  public role: UserRole;
  public loyaltyTier: LoyaltyTier;
  public loyaltyPoints: number;
  public savedAddresses: Address[];
  public wishlistProductIds: string[];
  public createdAt: string;
  public updatedAt: string;

  constructor(props: CustomerProfile) {
    this.id = props.id;
    this.authId = props.authId;
    this.email = props.email;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.phone = props.phone;
    this.avatarUrl = props.avatarUrl;
    this.role = props.role || 'customer';
    this.loyaltyTier = props.loyaltyTier || 'bronze';
    this.loyaltyPoints = props.loyaltyPoints || 0;
    this.savedAddresses = props.savedAddresses || [];
    this.wishlistProductIds = props.wishlistProductIds || [];
    this.createdAt = props.createdAt || new Date().toISOString();
    this.updatedAt = props.updatedAt || new Date().toISOString();
  }

  public get fullName(): string {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim() || 'Valued Customer';
  }

  public get defaultShippingAddress(): Address | undefined {
    return this.savedAddresses.find((a) => a.isDefaultShipping) || this.savedAddresses[0];
  }
}
