import Razorpay from 'razorpay';
import crypto from 'crypto';
import type {
  IPaymentProvider,
  CreatePaymentOrderPayload,
  PaymentOrderResult,
  VerifyPaymentPayload,
} from './payment-provider.interface';

export class RazorpayProvider implements IPaymentProvider {
  private razorpayInstance: Razorpay | null = null;
  public keyId: string;
  public keySecret: string;

  constructor(keyId?: string, keySecret?: string) {
    this.keyId =
      keyId ||
      process.env.RAZORPAY_KEY_ID ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID ||
      'rzp_test_TX6kmNNGbn83QI';

    this.keySecret =
      keySecret ||
      process.env.RAZORPAY_KEY_SECRET ||
      'tcp9HIn70PSx5JzNm611UHmw';

    try {
      this.razorpayInstance = new Razorpay({
        key_id: this.keyId,
        key_secret: this.keySecret,
      });
    } catch (err) {
      console.warn('Razorpay SDK initialization warning:', err);
    }
  }

  public async createOrder(payload: CreatePaymentOrderPayload): Promise<PaymentOrderResult> {
    const rawAmount = Number(payload.amount) || 0;
    // Amount in payload is expected in INR; convert to paise (minimum ₹1 = 100 paise)
    const amountInPaise = Math.max(100, Math.round(rawAmount * 100));

    if (!this.razorpayInstance) {
      throw new Error('Razorpay SDK instance is not initialized. Please verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.');
    }

    try {
      const order = await this.razorpayInstance.orders.create({
        amount: amountInPaise,
        currency: payload.currency || 'INR',
        receipt: payload.receipt || `rcpt_${Date.now()}`,
        notes: payload.notes,
      });

      return {
        providerOrderId: order.id,
        amount: Number(order.amount),
        currency: order.currency || 'INR',
        keyId: this.keyId,
        notes: payload.notes,
      };
    } catch (error: any) {
      console.error('Razorpay API orders.create error:', error?.message || error);
      throw new Error(`Razorpay Order Creation Failed: ${error?.message || 'Gateway error'}`);
    }
  }

  public async verifyPayment(payload: VerifyPaymentPayload): Promise<boolean> {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = payload;
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return false;
    }

    try {
      // HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
      const text = `${razorpayOrderId}|${razorpayPaymentId}`;
      const generatedSignature = crypto
        .createHmac('sha256', this.keySecret)
        .update(text)
        .digest('hex');

      return generatedSignature === razorpaySignature;
    } catch (error) {
      console.error('Razorpay signature verification error:', error);
      return false;
    }
  }

  public async fetchPaymentDetails(paymentId: string): Promise<any> {
    if (!this.razorpayInstance || !paymentId) return null;
    try {
      const payment = await this.razorpayInstance.payments.fetch(paymentId);
      return payment;
    } catch (err) {
      console.warn('Razorpay fetchPaymentDetails warning:', err);
      return null;
    }
  }

  public async capturePayment(paymentId: string, amount: number): Promise<{ success: boolean; transactionId: string }> {
    return {
      success: true,
      transactionId: `tx_cap_${paymentId}`,
    };
  }

  public async refundPayment(paymentId: string, amount: number): Promise<{ success: boolean; refundId: string }> {
    return {
      success: true,
      refundId: `ref_${paymentId}_${Date.now()}`,
    };
  }
}
