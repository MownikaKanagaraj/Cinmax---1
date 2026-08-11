import type { PaymentMethod, SavedPaymentMethod } from '@cinmax/types';

export interface CreatePaymentIntentPayload {
  amount: number;
  currency?: string;
  orderId?: string;
  paymentMethod?: PaymentMethod;
  customerId?: string;
}

export interface ConfirmPaymentPayload {
  paymentIntentId: string;
  paymentMethod?: PaymentMethod;
}

export type PaymentIntentPayload = CreatePaymentIntentPayload;

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
}

export interface PaymentTransactionProps {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  orderId?: string;
  createdAt: string;
}

export type { SavedPaymentMethod };
