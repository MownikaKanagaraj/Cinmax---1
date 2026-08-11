export interface CreatePaymentOrderPayload {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface PaymentOrderResult {
  providerOrderId: string;
  amount: number;
  currency: string;
  keyId?: string;
  notes?: Record<string, string>;
}

export interface VerifyPaymentPayload {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface IPaymentProvider {
  createOrder(payload: CreatePaymentOrderPayload): Promise<PaymentOrderResult>;
  verifyPayment(payload: VerifyPaymentPayload): Promise<boolean>;
  capturePayment(paymentId: string, amount: number): Promise<{ success: boolean; transactionId: string }>;
  refundPayment(paymentId: string, amount: number): Promise<{ success: boolean; refundId: string }>;
}
