import type { Coupon } from '@cinmax/types';

export interface CentralCouponConfig {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed_amount' | 'free_shipping';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  usageCount?: number;
  isActive: boolean;
}

/**
 * ====================================================================
 * CINMAX CENTRAL COUPON & DISCOUNT CODE CONFIGURATION
 * ====================================================================
 * To ADD, REMOVE, or MODIFY coupon codes and discount values:
 * Edit the CENTRAL_COUPON_CONFIGS array below.
 *
 * Supported discountType values:
 * - 'percentage': discountValue is percentage off (e.g. 10 = 10% off)
 * - 'fixed_amount': discountValue is flat amount off in INR (e.g. 15 = ₹15 off)
 * - 'free_shipping': discountValue is shipping fee waiver
 * ====================================================================
 */
export const CENTRAL_COUPON_CONFIGS: CentralCouponConfig[] = [
  {
    id: 'cpn_welcome10',
    code: 'WELCOME10',
    title: '10% Off Welcome Discount',
    description: 'Enjoy 10% off your entire cart of artisanal soaps.',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 0,
    isActive: true,
  },
  {
    id: 'cpn_botanical20',
    code: 'BOTANICAL20',
    title: 'VIP 20% Off Connoisseur Slabs',
    description: 'Exclusive 20% savings on purchases.',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 0,
    isActive: true,
  },
  {
    id: 'cpn_luxesummer',
    code: 'LUXESUMMER',
    title: '₹15 Off Summer Botanical Special',
    description: 'Flat ₹15 discount on luxury summer formulations.',
    discountType: 'fixed_amount',
    discountValue: 15,
    minOrderAmount: 0,
    isActive: true,
  },
  {
    id: 'cpn_azure10',
    code: 'AZURE10',
    title: '10% Off Azure Botanical Bar',
    description: 'Enjoy 10% off your order.',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 0,
    isActive: true,
  },
  {
    id: 'cpn_freeship50',
    code: 'FREESHIP50',
    title: 'Complimentary Atelier Shipping',
    description: 'Free standard shipping on all cured slab orders.',
    discountType: 'free_shipping',
    discountValue: 6.95,
    minOrderAmount: 0,
    isActive: true,
  },
  {
    id: 'cpn_welcome15',
    code: 'WELCOME15',
    title: 'New Collector 15% Welcome',
    description: 'First order 15% savings across all cold-process soaps.',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 0,
    isActive: true,
  },
];

/**
 * Finds a central coupon config by code (case-insensitive & trimmed).
 */
export function getCentralCouponByCode(code: string): CentralCouponConfig | null {
  if (!code) return null;
  const cleanCode = code.trim().toUpperCase();
  return CENTRAL_COUPON_CONFIGS.find((c) => c.code.toUpperCase() === cleanCode) || null;
}

/**
 * Returns all active central coupon configs.
 */
export function getActiveCentralCoupons(): CentralCouponConfig[] {
  return CENTRAL_COUPON_CONFIGS.filter((c) => c.isActive);
}
