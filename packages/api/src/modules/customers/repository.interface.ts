import type { Address } from '@cinmax/types';
import { CustomerEntity } from './entity';

export interface NotificationSettingsData {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  orderUpdates: boolean;
}

export interface CustomerPreferencesData {
  skinType?: string;
  fragrancePreference?: string;
  favoriteIngredients?: string[];
}

export interface ICustomerRepository {
  getCustomers(): Promise<CustomerEntity[]>;
  getProfile(userId: string): Promise<CustomerEntity | null>;
  updateProfile(userId: string, data: Partial<CustomerEntity>): Promise<CustomerEntity>;
  getAddresses(userId: string): Promise<Address[]>;
  addAddress(userId: string, address: Omit<Address, 'id'> | Address): Promise<Address>;
  updateAddress(userId: string, addressId: string, data: Partial<Address>): Promise<Address>;
  deleteAddress(userId: string, addressId: string): Promise<void>;
  setDefaultAddress(userId: string, addressId: string, type?: 'shipping' | 'billing'): Promise<Address[]>;
  getNotificationSettings(userId: string): Promise<NotificationSettingsData>;
  updateNotificationSettings(userId: string, data: Partial<NotificationSettingsData>): Promise<NotificationSettingsData>;
  getCustomerPreferences(userId: string): Promise<CustomerPreferencesData>;
  updateCustomerPreferences(userId: string, data: Partial<CustomerPreferencesData>): Promise<CustomerPreferencesData>;
}
