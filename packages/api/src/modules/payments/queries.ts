import type { PaymentMethod } from '@cinmax/types';

export async function fetchAvailablePaymentMethods(): Promise<PaymentMethod[]> {
  return ['stripe', 'apple_pay', 'google_pay', 'paypal'];
}
