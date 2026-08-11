import type { Address } from '@cinmax/types';
import { CustomerNotFoundError } from '../../errors';
import { CustomerEntity } from './entity';
import type { ICustomerRepository } from './repository.interface';

export class GetCustomerProfileUseCase {
  constructor(private customerRepo: ICustomerRepository) {}

  public async execute(userId: string): Promise<CustomerEntity> {
    const customer = await this.customerRepo.getProfile(userId);
    if (!customer) {
      throw new CustomerNotFoundError(userId);
    }
    return customer;
  }
}

export class UpdateCustomerProfileUseCase {
  constructor(private customerRepo: ICustomerRepository) {}

  public async execute(userId: string, data: Partial<CustomerEntity>): Promise<CustomerEntity> {
    return this.customerRepo.updateProfile(userId, data);
  }
}

export class AddCustomerAddressUseCase {
  constructor(private customerRepo: ICustomerRepository) {}

  public async execute(userId: string, address: Omit<Address, 'id'> | Address): Promise<Address> {
    return this.customerRepo.addAddress(userId, address);
  }
}

export class UpdateCustomerAddressUseCase {
  constructor(private customerRepo: ICustomerRepository) {}

  public async execute(
    userId: string,
    addressId: string,
    data: Partial<Address>
  ): Promise<Address> {
    return this.customerRepo.updateAddress(userId, addressId, data);
  }
}

export class DeleteCustomerAddressUseCase {
  constructor(private customerRepo: ICustomerRepository) {}

  public async execute(userId: string, addressId: string): Promise<void> {
    return this.customerRepo.deleteAddress(userId, addressId);
  }
}

export class SetDefaultCustomerAddressUseCase {
  constructor(private customerRepo: ICustomerRepository) {}

  public async execute(
    userId: string,
    addressId: string,
    type: 'shipping' | 'billing' = 'shipping'
  ): Promise<Address[]> {
    return this.customerRepo.setDefaultAddress(userId, addressId, type);
  }
}
