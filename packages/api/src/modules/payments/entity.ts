import type { PaymentTransactionProps } from './types';

export class PaymentEntity implements PaymentTransactionProps {
  public id: string;
  public clientSecret: string;
  public amount: number;
  public currency: string;
  public status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  public orderId?: string;
  public createdAt: string;

  constructor(props: PaymentTransactionProps) {
    this.id = props.id;
    this.clientSecret = props.clientSecret;
    this.amount = props.amount;
    this.currency = props.currency || 'USD';
    this.status = props.status;
    this.orderId = props.orderId;
    this.createdAt = props.createdAt || new Date().toISOString();
  }

  public get isSucceeded(): boolean {
    return this.status === 'succeeded';
  }
}

export { PaymentEntity as PaymentTransactionEntity };
