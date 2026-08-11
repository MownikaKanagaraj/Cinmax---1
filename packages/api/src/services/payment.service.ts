import type { SavedPaymentMethod } from '@cinmax/types';
import type {
  IPaymentRepository,
  PaymentTransactionEntity,
  CreatePaymentIntentPayload,
  ConfirmPaymentPayload,
} from '../modules/payments';
import {
  CreatePaymentIntentUseCase,
  ConfirmPaymentUseCase,
  GetSavedPaymentMethodsUseCase,
  AddSavedPaymentMethodUseCase,
  DeleteSavedPaymentMethodUseCase,
} from '../modules/payments/useCases';

export class PaymentService {
  private createIntentUseCase: CreatePaymentIntentUseCase;
  private confirmPaymentUseCase: ConfirmPaymentUseCase;
  private getSavedMethodsUseCase: GetSavedPaymentMethodsUseCase;
  private addSavedMethodUseCase: AddSavedPaymentMethodUseCase;
  private deleteSavedMethodUseCase: DeleteSavedPaymentMethodUseCase;

  constructor(private paymentRepo: IPaymentRepository) {
    this.createIntentUseCase = new CreatePaymentIntentUseCase(paymentRepo);
    this.confirmPaymentUseCase = new ConfirmPaymentUseCase(paymentRepo);
    this.getSavedMethodsUseCase = new GetSavedPaymentMethodsUseCase(paymentRepo);
    this.addSavedMethodUseCase = new AddSavedPaymentMethodUseCase(paymentRepo);
    this.deleteSavedMethodUseCase = new DeleteSavedPaymentMethodUseCase(paymentRepo);
  }

  public async createPaymentIntent(
    payload: CreatePaymentIntentPayload
  ): Promise<PaymentTransactionEntity> {
    return this.createIntentUseCase.execute(payload);
  }

  public async confirmPayment(
    payload: ConfirmPaymentPayload
  ): Promise<PaymentTransactionEntity> {
    return this.confirmPaymentUseCase.execute(payload);
  }

  public async getSavedPaymentMethods(userId: string): Promise<SavedPaymentMethod[]> {
    return this.getSavedMethodsUseCase.execute(userId);
  }

  public async addSavedPaymentMethod(
    userId: string,
    method: Omit<SavedPaymentMethod, 'id'>
  ): Promise<SavedPaymentMethod[]> {
    return this.addSavedMethodUseCase.execute(userId, method);
  }

  public async deleteSavedPaymentMethod(
    userId: string,
    methodId: string
  ): Promise<SavedPaymentMethod[]> {
    return this.deleteSavedMethodUseCase.execute(userId, methodId);
  }
}
