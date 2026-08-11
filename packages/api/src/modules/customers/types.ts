import type { Address, CustomerProfile, UserRole } from '@cinmax/types';

export interface UpdateCustomerProfilePayload {
  userId: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface SaveAddressPayload {
  userId: string;
  address: Omit<Address, 'id' | 'userId'>;
  addressId?: string;
}
