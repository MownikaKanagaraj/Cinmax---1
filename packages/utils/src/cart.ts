import type { CartItem } from '@cinmax/types';

export interface CartTotalsResult {
  subtotal: number;
  discountTotal: number;
  discount: number;
  taxTotal: number;
  tax: number;
  shippingTotal: number;
  shippingFee: number;
  grandTotal: number;
  total: number;
}

export function calculateCartTotals(
  items: CartItem[],
  discountAmountOrPercentage: number = 0,
  taxRate: number = 0.08,
  freeShippingThreshold: number = 50.0,
  flatShippingRate: number = 6.95
): CartTotalsResult {
  const subtotal = items.reduce(
    (sum, item) => sum + (item.totalPrice || item.unitPrice * item.quantity),
    0
  );

  let discountTotal = 0;
  if (discountAmountOrPercentage > 0) {
    if (discountAmountOrPercentage <= 100) {
      discountTotal = (subtotal * discountAmountOrPercentage) / 100;
    } else {
      discountTotal = discountAmountOrPercentage;
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discountTotal);
  const taxTotal = Math.round(discountedSubtotal * taxRate * 100) / 100;
  const shippingTotal =
    subtotal === 0 || discountedSubtotal >= freeShippingThreshold ? 0 : flatShippingRate;
  const grandTotal = Math.round((discountedSubtotal + taxTotal + shippingTotal) * 100) / 100;

  const roundedSubtotal = Math.round(subtotal * 100) / 100;
  const roundedDiscount = Math.round(discountTotal * 100) / 100;

  return {
    subtotal: roundedSubtotal,
    discountTotal: roundedDiscount,
    discount: roundedDiscount,
    taxTotal,
    tax: taxTotal,
    shippingTotal,
    shippingFee: shippingTotal,
    grandTotal,
    total: grandTotal,
  };
}
