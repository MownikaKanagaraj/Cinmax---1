import type { PaymentIntentPayload, PaymentIntentResponse } from './types';

export async function createPaymentIntent(
  payload: PaymentIntentPayload
): Promise<PaymentIntentResponse> {
  // Mock Payment Intent for architecture foundation
  return {
    clientSecret: `mock_sec_${Math.random().toString(36).substring(2)}`,
    paymentIntentId: `pi_${Math.random().toString(36).substring(2)}`,
    status: 'requires_payment_method',
  };
}
