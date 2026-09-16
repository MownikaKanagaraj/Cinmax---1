import type { LoyaltyTier } from '@cinmax/types';

export interface RewardCalculationResult {
  pointsEarned: number;
  pointsValueAmount: number;
  loyaltyMultiplier: number;
}

export class RewardPointEngine {
  public static getMultiplier(tier: LoyaltyTier = 'bronze'): number {
    switch (tier) {
      case 'platinum':
        return 2.0;
      case 'gold':
        return 1.5;
      case 'silver':
        return 1.25;
      case 'bronze':
      default:
        return 1.0;
    }
  }

  public static calculatePoints(eligibleAmount: number, tier: LoyaltyTier = 'bronze'): RewardCalculationResult {
    const basePoints = Math.max(0, Math.floor(eligibleAmount));
    const multiplier = this.getMultiplier(tier);
    const pointsEarned = Math.round(basePoints * multiplier);
    const pointsValueAmount = pointsEarned * 1.0; // ₹1 discount value per point

    return {
      pointsEarned,
      pointsValueAmount,
      loyaltyMultiplier: multiplier,
    };
  }
}
