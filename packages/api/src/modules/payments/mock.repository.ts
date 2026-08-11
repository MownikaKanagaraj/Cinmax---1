import type { SavedPaymentMethod } from '@cinmax/types';
import { PaymentEntity } from './entity';
import type { IPaymentRepository } from './repository.interface';
import type { CreatePaymentIntentPayload, ConfirmPaymentPayload } from './types';

export class MockPaymentRepository implements IPaymentRepository {
  private transactions: Map<string, PaymentEntity> = new Map();
  private savedMethods: Map<string, SavedPaymentMethod[]> = new Map();

  constructor() {
    // Seed default mock saved payment method
    this.savedMethods.set('usr_mock_001', [
      {
        id: 'pm_mock_visa_4242',
        customerId: 'usr_mock_001',
        type: 'stripe',
        isDefault: true,
        last4: '4242',
        expiryMonth: 12,
        expiryYear: 2028,
        brand: 'Visa',
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  public async createPaymentIntent(payload: CreatePaymentIntentPayload): Promise<PaymentEntity> {
    const id = `pi_mock_${Date.now()}`;
    const entity = new PaymentEntity({
      id,
      clientSecret: `${id}_secret_${Math.random().toString(36).substring(7)}`,
      amount: payload.amount,
      currency: payload.currency || 'USD',
      status: 'requires_payment_method',
      orderId: payload.orderId,
      createdAt: new Date().toISOString(),
    });

    this.transactions.set(id, entity);
    return entity;
  }

  public async confirmPayment(payload: ConfirmPaymentPayload): Promise<PaymentEntity> {
    const existing = this.transactions.get(payload.paymentIntentId) || new PaymentEntity({
      id: payload.paymentIntentId,
      clientSecret: `${payload.paymentIntentId}_secret_mock`,
      amount: 100,
      currency: 'USD',
      status: 'requires_payment_method',
      createdAt: new Date().toISOString(),
    });

    const confirmed = new PaymentEntity({
      ...existing,
      status: 'succeeded',
    });

    this.transactions.set(payload.paymentIntentId, confirmed);
    return confirmed;
  }

  public async getPaymentIntent(paymentIntentId: string): Promise<PaymentEntity | null> {
    return this.transactions.get(paymentIntentId) || null;
  }

  public async getSavedPaymentMethods(userId: string): Promise<SavedPaymentMethod[]> {
    return this.savedMethods.get(userId) || [];
  }

  public async addSavedPaymentMethod(
    userId: string,
    method: Omit<SavedPaymentMethod, 'id'>
  ): Promise<SavedPaymentMethod[]> {
    const current = this.savedMethods.get(userId) || [];
    const newMethod: SavedPaymentMethod = {
      ...method,
      id: `pm_${Date.now()}`,
    };
    const updated = [...current, newMethod];
    this.savedMethods.set(userId, updated);
    return updated;
  }

  public async deleteSavedPaymentMethod(
    userId: string,
    methodId: string
  ): Promise<SavedPaymentMethod[]> {
    const current = this.savedMethods.get(userId) || [];
    const updated = current.filter((m) => m.id !== methodId);
    this.savedMethods.set(userId, updated);
    return updated;
  }
}
