import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, SavedPaymentMethod } from '@cinmax/types';
import { PaymentEntity } from './entity';
import type { IPaymentRepository } from './repository.interface';
import type { CreatePaymentIntentPayload, ConfirmPaymentPayload } from './types';

export class SupabasePaymentRepository implements IPaymentRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  public async createPaymentIntent(payload: CreatePaymentIntentPayload): Promise<PaymentEntity> {
    const id = `pi_sb_${Date.now()}`;
    return new PaymentEntity({
      id,
      clientSecret: `${id}_secret`,
      amount: payload.amount,
      currency: payload.currency || 'USD',
      status: 'requires_payment_method',
      orderId: payload.orderId,
      createdAt: new Date().toISOString(),
    });
  }

  public async confirmPayment(payload: ConfirmPaymentPayload): Promise<PaymentEntity> {
    return new PaymentEntity({
      id: payload.paymentIntentId,
      clientSecret: `${payload.paymentIntentId}_secret`,
      amount: 0,
      currency: 'USD',
      status: 'succeeded',
      createdAt: new Date().toISOString(),
    });
  }

  public async getPaymentIntent(paymentIntentId: string): Promise<PaymentEntity | null> {
    return new PaymentEntity({
      id: paymentIntentId,
      clientSecret: `${paymentIntentId}_secret`,
      amount: 0,
      currency: 'USD',
      status: 'succeeded',
      createdAt: new Date().toISOString(),
    });
  }

  public async getSavedPaymentMethods(_userId: string): Promise<SavedPaymentMethod[]> {
    return [];
  }

  public async addSavedPaymentMethod(
    _userId: string,
    method: Omit<SavedPaymentMethod, 'id'>
  ): Promise<SavedPaymentMethod[]> {
    return [{ ...method, id: `pm_${Date.now()}` }];
  }

  public async deleteSavedPaymentMethod(
    _userId: string,
    _methodId: string
  ): Promise<SavedPaymentMethod[]> {
    return [];
  }
}
