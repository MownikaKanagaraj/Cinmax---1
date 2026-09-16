/**
 * Currency, Tax, and Price Utilities
 */

export function formatPrice(
  amount: number,
  currency: string = 'INR',
  locale: string = 'en-IN'
): string {
  const safeAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency || 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safeAmount);
  } catch {
    return `₹${safeAmount.toFixed(2)}`;
  }
}

export const formatCurrency = formatPrice;

export function calculateDiscount(
  subtotal: number,
  discountType: 'percentage' | 'fixed_amount' | 'free_shipping',
  discountValue: number
): number {
  if (discountType === 'percentage') {
    return Math.min(subtotal, (subtotal * discountValue) / 100);
  }
  if (discountType === 'fixed_amount') {
    return Math.min(subtotal, discountValue);
  }
  return 0;
}

export function calculateTax(taxableAmount: number, taxRate: number = 0.08): number {
  return Number((taxableAmount * taxRate).toFixed(2));
}

export function calculateFreeShippingProgress(
  subtotal: number,
  threshold: number = 499.0
): { progressPercentage: number; remainingAmount: number; isEligible: boolean } {
  if (subtotal >= threshold) {
    return { progressPercentage: 100, remainingAmount: 0, isEligible: true };
  }
  const remaining = Number((threshold - subtotal).toFixed(2));
  const percentage = Math.min(100, Math.max(0, Math.round((subtotal / threshold) * 100)));
  return { progressPercentage: percentage, remainingAmount: remaining, isEligible: false };
}
