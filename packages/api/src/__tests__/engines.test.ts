import {
  PricingEngine,
  CouponEngine,
  TaxEngine,
  ShippingEngine,
  OrderStateMachine,
  InvoiceEngine,
} from '../engines';
import { EventBus } from '../events';
import { OperationsService } from '../services';

function expect(actual: any) {
  return {
    toBe(expected: any) {
      if (actual !== expected) throw new Error(`Expected ${expected} but got ${actual}`);
    },
    toBeGreaterThan(expected: number) {
      if (actual <= expected) throw new Error(`Expected ${actual} to be greater than ${expected}`);
    },
    toContain(expected: string) {
      if (typeof actual === 'string' && !actual.includes(expected)) {
        throw new Error(`Expected string to contain ${expected}`);
      }
    },
  };
}

export function runEngineTests() {
  // Test 1: PricingEngine
  const pricing = PricingEngine.calculate({
    items: [
      {
        id: 'ci_1',
        cartId: 'c_1',
        productId: 'p_1',
        quantity: 2,
        unitPrice: 1500,
        totalPrice: 3000,
        product: { id: 'p_1', title: 'Azure Marine Bar', slug: 'azure-bar', images: [], processType: 'cold-process' },
        variant: { id: 'v_1', sku: 'SKU-AZURE', title: 'Default', price: 1500, weightGrams: 200, volumeMl: 250, options: {} },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    isIntraState: true,
  });

  expect(pricing.subtotal).toBe(3000);
  expect(pricing.grandTotal).toBeGreaterThan(0);

  // Test 2: CouponEngine
  const couponResult = CouponEngine.evaluate({
    coupon: {
      id: 'c1',
      code: 'WELCOME20',
      discountType: 'percentage',
      discountValue: 20,
      minPurchaseAmount: 1000,
      maxDiscountAmount: 500,
      isActive: true,
      usageCount: 0,
    },
    subtotal: 2000,
    items: [],
  });

  expect(couponResult.isValid).toBe(true);
  expect(couponResult.discountAmount).toBe(400);

  // Test 3: OrderStateMachine
  expect(OrderStateMachine.canTransition('pending', 'payment_pending')).toBe(true);
  expect(OrderStateMachine.canTransition('confirmed', 'delivered')).toBe(false);

  // Test 4: InvoiceEngine
  const mockOrder: any = {
    id: 'ord_123',
    orderNumber: 'CNX-2026-987654',
    grandTotal: 3540,
    currency: 'INR',
    shippingAddress: {
      firstName: 'Elena',
      lastName: 'Rostova',
      email: 'elena@atelier.com',
      streetLine1: '42 Promenade',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India',
      phone: '+919876543210',
    },
    billingAddress: {
      firstName: 'Elena',
      lastName: 'Rostova',
      streetLine1: '42 Promenade',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India',
      phone: '+919876543210',
    },
    items: [
      {
        productTitle: 'Azure Marine Bar',
        sku: 'SKU-AZURE',
        unitPrice: 1500,
        quantity: 2,
        totalPrice: 3000,
      },
    ],
    createdAt: new Date().toISOString(),
  };

  const invoice = InvoiceEngine.createInvoice(mockOrder);
  expect(invoice.invoiceNumber).toContain('INV-');
  expect(invoice.grandTotal).toBe(3540);
}
