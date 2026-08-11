import type { SavedPaymentMethod } from '@cinmax/types';
import { PaymentEntity } from './entity';
import type { IPaymentRepository } from './repository.interface';
import type { CreatePaymentIntentPayload, ConfirmPaymentPayload } from './types';

export class CreatePaymentIntentUseCase {
  constructor(private paymentRepo: IPaymentRepository) {}

  public async execute(payload: CreatePaymentIntentPayload): Promise<PaymentEntity> {
    return this.paymentRepo.createPaymentIntent(payload);
  }
}

export class ConfirmPaymentUseCase {
  constructor(private paymentRepo: IPaymentRepository) {}

  public async execute(payload: ConfirmPaymentPayload): Promise<PaymentEntity> {
    return this.paymentRepo.confirmPayment(payload);
  }
}

export class GetSavedPaymentMethodsUseCase {
  constructor(private paymentRepo: IPaymentRepository) {}

  public async execute(userId: string): Promise<SavedPaymentMethod[]> {
    return this.paymentRepo.getSavedPaymentMethods(userId);
  }
}

export class AddSavedPaymentMethodUseCase {
  constructor(private paymentRepo: IPaymentRepository) {}

  public async execute(
    userId: string,
    method: Omit<SavedPaymentMethod, 'id'>
  ): Promise<SavedPaymentMethod[]> {
    return this.paymentRepo.addSavedPaymentMethod(userId, method);
  }
}

export class DeleteSavedPaymentMethodUseCase {
  constructor(private paymentRepo: IPaymentRepository) {}

  public async execute(userId: string, methodId: string): Promise<SavedPaymentMethod[]> {
    return this.paymentRepo.deleteSavedPaymentMethod(userId, methodId);
  }
}
