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
  flatShippingRate: number = 6.95,
  discountType: 'percentage' | 'fixed_amount' | 'free_shipping' = 'percentage'
): CartTotalsResult {
  const subtotal = items.reduce(
    (sum, item) => sum + (item.totalPrice || item.unitPrice * item.quantity),
    0
  );

  let discountTotal = 0;
  let shippingTotal = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : flatShippingRate;

  if (discountAmountOrPercentage > 0) {
    if (discountType === 'percentage') {
      discountTotal = (subtotal * discountAmountOrPercentage) / 100;
    } else if (discountType === 'fixed_amount') {
      discountTotal = Math.min(subtotal, discountAmountOrPercentage);
    } else if (discountType === 'free_shipping') {
      shippingTotal = 0;
      discountTotal = flatShippingRate;
    } else {
      if (discountAmountOrPercentage <= 100) {
        discountTotal = (subtotal * discountAmountOrPercentage) / 100;
      } else {
        discountTotal = Math.min(subtotal, discountAmountOrPercentage);
      }
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discountTotal);
  const taxTotal = Math.round(discountedSubtotal * taxRate * 100) / 100;
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
