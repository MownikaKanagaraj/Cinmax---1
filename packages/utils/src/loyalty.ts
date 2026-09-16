export interface LoyaltyTierDetails {
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  tierLabel: string;
  multiplier: number;
  currentPoints: number;
  nextTierLabel: string | null;
  nextTierThreshold: number | null;
  pointsToNextTier: number;
  progressPercent: number;
  redeemableValueRupees: number;
}

export function calculateLoyaltyProgress(points: number = 0): LoyaltyTierDetails {
  const currentPoints = Math.max(0, Math.floor(Number(points) || 0));

  if (currentPoints < 500) {
    const nextTierThreshold = 500;
    const pointsToNextTier = nextTierThreshold - currentPoints;
    const progressPercent = Math.min(100, Math.round((currentPoints / nextTierThreshold) * 100));
    return {
      tier: 'BRONZE',
      tierLabel: 'BRONZE TIER',
      multiplier: 1.0,
      currentPoints,
      nextTierLabel: 'SILVER TIER',
      nextTierThreshold,
      pointsToNextTier,
      progressPercent,
      redeemableValueRupees: currentPoints,
    };
  } else if (currentPoints < 1500) {
    const nextTierThreshold = 1500;
    const pointsToNextTier = nextTierThreshold - currentPoints;
    const progressPercent = Math.min(100, Math.round(((currentPoints - 500) / (1500 - 500)) * 100));
    return {
      tier: 'SILVER',
      tierLabel: 'SILVER TIER',
      multiplier: 1.25,
      currentPoints,
      nextTierLabel: 'GOLD TIER',
      nextTierThreshold,
      pointsToNextTier,
      progressPercent,
      redeemableValueRupees: currentPoints,
    };
  } else if (currentPoints < 5000) {
    const nextTierThreshold = 5000;
    const pointsToNextTier = nextTierThreshold - currentPoints;
    const progressPercent = Math.min(100, Math.round(((currentPoints - 1500) / (5000 - 1500)) * 100));
    return {
      tier: 'GOLD',
      tierLabel: 'GOLD TIER',
      multiplier: 1.5,
      currentPoints,
      nextTierLabel: 'PLATINUM TIER',
      nextTierThreshold,
      pointsToNextTier,
      progressPercent,
      redeemableValueRupees: currentPoints,
    };
  } else {
    return {
      tier: 'PLATINUM',
      tierLabel: 'PLATINUM VIP',
      multiplier: 2.0,
      currentPoints,
      nextTierLabel: null,
      nextTierThreshold: null,
      pointsToNextTier: 0,
      progressPercent: 100,
      redeemableValueRupees: currentPoints,
    };
  }
}
