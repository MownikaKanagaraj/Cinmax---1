export interface PaymentDTO {
  id: string;
  client_secret: string;
  amount: number | string;
  currency: string;
  status: string;
  order_id?: string | null;
  created_at: string;
}

export type PaymentTransactionDTO = PaymentDTO;
export type { CreatePaymentIntentPayload, ConfirmPaymentPayload } from './types';
