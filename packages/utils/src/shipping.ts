export const SPECIAL_STATES = [
  'Tamil Nadu',
  'Puducherry',
  'Kerala',
  'Karnataka',
  'Andhra Pradesh',
  'Telangana',
] as const;

export const ALL_INDIAN_STATES = [
  'Tamil Nadu',
  'Puducherry',
  'Kerala',
  'Karnataka',
  'Andhra Pradesh',
  'Telangana',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Other States',
] as const;

export interface DeliveryCalculationResult {
  state: string;
  totalProducts: number;
  deliveryCharge: number;
  isFreeDelivery: boolean;
}

/**
 * Single Centralized Delivery Charge Algorithm for CinMax E-Commerce.
 * 
 * Rules:
 * 1. Tamil Nadu / Puducherry:
 *    1-5 products => ₹60
 *    6+ products  => ₹0 (FREE)
 * 
 * 2. Kerala / Karnataka / Andhra Pradesh / Telangana:
 *    1-5 products => ₹80
 *    6-10 products => ₹0 (FREE)
 *    11+ products  => ₹10 * TOTAL PRODUCT QUANTITY
 * 
 * 3. All Other States:
 *    1-10 products => ₹140
 *    11+ products  => ₹10 * TOTAL PRODUCT QUANTITY
 */
export function calculateDeliveryCharge(
  state: string | null | undefined,
  totalProducts: number
): DeliveryCalculationResult {
  const normalizedState = (state || '').trim();
  const qty = Math.max(0, Math.floor(Number(totalProducts) || 0));

  if (!normalizedState) {
    return {
      state: 'Unselected',
      totalProducts: qty,
      deliveryCharge: 0,
      isFreeDelivery: false,
    };
  }

  if (qty === 0) {
    return {
      state: normalizedState,
      totalProducts: 0,
      deliveryCharge: 0,
      isFreeDelivery: true,
    };
  }

  let deliveryCharge = 0;
  const s = normalizedState.toLowerCase();

  if (s === 'tamil nadu' || s === 'puducherry' || s === 'pondicherry') {
    if (qty <= 5) {
      deliveryCharge = 60;
    } else {
      deliveryCharge = 0;
    }
  } else if (
    ['kerala', 'karnataka', 'andhra pradesh', 'telangana'].includes(s)
  ) {
    if (qty <= 5) {
      deliveryCharge = 80;
    } else if (qty <= 10) {
      deliveryCharge = 0;
    } else {
      deliveryCharge = qty * 10;
    }
  } else {
    // Other States
    if (qty <= 10) {
      deliveryCharge = 140;
    } else {
      deliveryCharge = qty * 10;
    }
  }

  return {
    state: normalizedState,
    totalProducts: qty,
    deliveryCharge,
    isFreeDelivery: deliveryCharge === 0,
  };
}

export type ShippingTier = 'standard' | 'express' | 'overnight';

export interface ShippingRateCalculation {
  tier: ShippingTier;
  label: string;
  cost: number;
  estimatedDays: string;
  isFree: boolean;
}

export function calculateShippingRates(
  subtotal: number,
  freeThreshold: number = 50.0
): ShippingRateCalculation[] {
  const isFreeStandard = subtotal >= freeThreshold;

  return [
    {
      tier: 'standard',
      label: 'Standard Delivery',
      cost: isFreeStandard ? 0 : 60,
      estimatedDays: '2-4 business days',
      isFree: isFreeStandard,
    },
  ];
}
