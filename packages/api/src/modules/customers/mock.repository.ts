import type { Address } from '@cinmax/types';
import { mockCustomerProfileData } from '../../mockData';
import { CustomerEntity } from './entity';
import type { ICustomerRepository, NotificationSettingsData, CustomerPreferencesData } from './repository.interface';

export class MockCustomerRepository implements ICustomerRepository {
  private customer: CustomerEntity;
  private notificationSettings: NotificationSettingsData;
  private preferences: CustomerPreferencesData;

  constructor(initialData?: CustomerEntity) {
    this.customer = initialData || new CustomerEntity(mockCustomerProfileData);
    this.notificationSettings = {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      marketingEmails: true,
      orderUpdates: true,
    };
    this.preferences = {
      skinType: 'Combination',
      fragrancePreference: 'Citrus',
      favoriteIngredients: ['French Green Clay', 'Eucalyptus Essence'],
    };
  }

  public async getCustomers(): Promise<CustomerEntity[]> {
    return [
      this.customer,
      new CustomerEntity({
        id: 'cust_2',
        authId: 'auth_2',
        email: 'j.sterling@designsanctuary.com',
        firstName: 'Julian',
        lastName: 'Sterling',
        role: 'customer',
        loyaltyTier: 'silver',
        loyaltyPoints: 198,
        savedAddresses: [],
        wishlistProductIds: [],
        createdAt: '2026-07-24T10:00:00Z',
        updatedAt: '2026-07-24T10:00:00Z',
      }),
      new CustomerEntity({
        id: 'cust_3',
        authId: 'auth_3',
        email: 'elena@rostovastudio.co.uk',
        firstName: 'Elena',
        lastName: 'Rostova',
        role: 'customer',
        loyaltyTier: 'platinum',
        loyaltyPoints: 890,
        savedAddresses: [],
        wishlistProductIds: [],
        createdAt: '2026-07-18T10:00:00Z',
        updatedAt: '2026-07-18T10:00:00Z',
      }),
    ];
  }

  public async getProfile(userId: string): Promise<CustomerEntity | null> {
    return this.customer;
  }

  public async updateProfile(_userId: string, data: Partial<CustomerEntity>): Promise<CustomerEntity> {
    this.customer = new CustomerEntity({
      ...this.customer,
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return this.customer;
  }

  public async getAddresses(_userId: string): Promise<Address[]> {
    return this.customer.savedAddresses;
  }

  public async addAddress(_userId: string, address: Omit<Address, 'id'> | Address): Promise<Address> {
    const newAddress: Address = {
      ...address,
      id: (address as Address).id || `addr_${Date.now()}`,
    };
    const updatedAddresses = [...this.customer.savedAddresses, newAddress];
    this.customer = new CustomerEntity({
      ...this.customer,
      savedAddresses: updatedAddresses,
      updatedAt: new Date().toISOString(),
    });
    return newAddress;
  }

  public async updateAddress(
    _userId: string,
    addressId: string,
    data: Partial<Address>
  ): Promise<Address> {
    let updatedTarget: Address | null = null;
    const updatedAddresses = this.customer.savedAddresses.map((a) => {
      if (a.id === addressId) {
        updatedTarget = { ...a, ...data };
        return updatedTarget;
      }
      return a;
    });
    this.customer = new CustomerEntity({
      ...this.customer,
      savedAddresses: updatedAddresses,
      updatedAt: new Date().toISOString(),
    });
    return updatedTarget || ({ id: addressId, ...data } as Address);
  }

  public async deleteAddress(_userId: string, addressId: string): Promise<void> {
    const updatedAddresses = this.customer.savedAddresses.filter((a) => a.id !== addressId);
    this.customer = new CustomerEntity({
      ...this.customer,
      savedAddresses: updatedAddresses,
      updatedAt: new Date().toISOString(),
    });
  }

  public async setDefaultAddress(
    _userId: string,
    addressId: string,
    type: 'shipping' | 'billing' = 'shipping'
  ): Promise<Address[]> {
    const updatedAddresses = this.customer.savedAddresses.map((a) => {
      if (type === 'shipping') {
        return { ...a, isDefaultShipping: a.id === addressId };
      }
      return { ...a, isDefaultBilling: a.id === addressId };
    });
    this.customer = new CustomerEntity({
      ...this.customer,
      savedAddresses: updatedAddresses,
      updatedAt: new Date().toISOString(),
    });
    return updatedAddresses;
  }

  public async getNotificationSettings(_userId: string): Promise<NotificationSettingsData> {
    return this.notificationSettings;
  }

  public async updateNotificationSettings(
    _userId: string,
    data: Partial<NotificationSettingsData>
  ): Promise<NotificationSettingsData> {
    this.notificationSettings = {
      ...this.notificationSettings,
      ...data,
    };
    return this.notificationSettings;
  }

  public async getCustomerPreferences(_userId: string): Promise<CustomerPreferencesData> {
    return this.preferences;
  }

  public async updateCustomerPreferences(
    _userId: string,
    data: Partial<CustomerPreferencesData>
  ): Promise<CustomerPreferencesData> {
    this.preferences = {
      ...this.preferences,
      ...data,
    };
    return this.preferences;
  }
}
