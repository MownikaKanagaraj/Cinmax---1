import type { SavedPaymentMethod } from '@cinmax/types';
import type { CreatePaymentIntentPayload, ConfirmPaymentPayload } from './types';
import { PaymentEntity } from './entity';

export interface IPaymentRepository {
  createPaymentIntent(payload: CreatePaymentIntentPayload): Promise<PaymentEntity>;
  confirmPayment(payload: ConfirmPaymentPayload): Promise<PaymentEntity>;
  getPaymentIntent(paymentIntentId: string): Promise<PaymentEntity | null>;
  getSavedPaymentMethods(userId: string): Promise<SavedPaymentMethod[]>;
  addSavedPaymentMethod(userId: string, method: Omit<SavedPaymentMethod, 'id'>): Promise<SavedPaymentMethod[]>;
  deleteSavedPaymentMethod(userId: string, methodId: string): Promise<SavedPaymentMethod[]>;
}
