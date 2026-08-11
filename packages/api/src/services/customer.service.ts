import type { Address } from '@cinmax/types';
import type { ICustomerRepository, CustomerEntity, NotificationSettingsData, CustomerPreferencesData } from '../modules/customers';
import {
  GetCustomerProfileUseCase,
  UpdateCustomerProfileUseCase,
} from '../modules/customers/useCases';

export class CustomerService {
  private getProfileUseCase: GetCustomerProfileUseCase;
  private updateProfileUseCase: UpdateCustomerProfileUseCase;

  constructor(private customerRepo: ICustomerRepository) {
    this.getProfileUseCase = new GetCustomerProfileUseCase(customerRepo);
    this.updateProfileUseCase = new UpdateCustomerProfileUseCase(customerRepo);
  }

  public async getCustomers(): Promise<CustomerEntity[]> {
    return this.customerRepo.getCustomers();
  }

  public async getProfile(userId: string): Promise<CustomerEntity> {
    return this.getProfileUseCase.execute(userId);
  }

  public async updateProfile(
    userId: string,
    data: Partial<CustomerEntity>
  ): Promise<CustomerEntity> {
    return this.updateProfileUseCase.execute(userId, data);
  }

  public async getAddresses(userId: string): Promise<Address[]> {
    return this.customerRepo.getAddresses(userId);
  }

  public async addAddress(userId: string, address: Omit<Address, 'id'> | Address): Promise<Address> {
    return this.customerRepo.addAddress(userId, address);
  }

  public async updateAddress(
    userId: string,
    addressId: string,
    address: Partial<Address>
  ): Promise<Address> {
    return this.customerRepo.updateAddress(userId, addressId, address);
  }

  public async deleteAddress(userId: string, addressId: string): Promise<void> {
    return this.customerRepo.deleteAddress(userId, addressId);
  }

  public async setDefaultAddress(
    userId: string,
    addressId: string,
    type: 'shipping' | 'billing' = 'shipping'
  ): Promise<Address[]> {
    return this.customerRepo.setDefaultAddress(userId, addressId, type);
  }

  public async getNotificationSettings(userId: string): Promise<NotificationSettingsData> {
    return this.customerRepo.getNotificationSettings(userId);
  }

  public async updateNotificationSettings(
    userId: string,
    data: Partial<NotificationSettingsData>
  ): Promise<NotificationSettingsData> {
    return this.customerRepo.updateNotificationSettings(userId, data);
  }

  public async getCustomerPreferences(userId: string): Promise<CustomerPreferencesData> {
    return this.customerRepo.getCustomerPreferences(userId);
  }

  public async updateCustomerPreferences(
    userId: string,
    data: Partial<CustomerPreferencesData>
  ): Promise<CustomerPreferencesData> {
    return this.customerRepo.updateCustomerPreferences(userId, data);
  }
}
