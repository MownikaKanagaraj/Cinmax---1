import type {
  IPaymentProvider,
  CreatePaymentOrderPayload,
  PaymentOrderResult,
  VerifyPaymentPayload,
} from './payment-provider.interface';

export class MockPaymentProvider implements IPaymentProvider {
  public async createOrder(payload: CreatePaymentOrderPayload): Promise<PaymentOrderResult> {
    return {
      providerOrderId: `mock_rzp_ord_${Date.now()}`,
      amount: payload.amount,
      currency: payload.currency || 'USD',
      keyId: 'rzp_test_mock_key',
      notes: payload.notes,
    };
  }

  public async verifyPayment(_payload: VerifyPaymentPayload): Promise<boolean> {
    return true;
  }

  public async capturePayment(paymentId: string, _amount: number): Promise<{ success: boolean; transactionId: string }> {
    return {
      success: true,
      transactionId: `mock_tx_${paymentId}`,
    };
  }

  public async refundPayment(paymentId: string, _amount: number): Promise<{ success: boolean; refundId: string }> {
    return {
      success: true,
      refundId: `mock_refund_${paymentId}`,
    };
  }
}
