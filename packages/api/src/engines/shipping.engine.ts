export interface ShippingCalculationParams {
  subtotal: number;
  totalWeightGrams?: number;
  freeShippingThreshold?: number; // default $50.00
  flatRate?: number; // default $5.99
  weightRatePerKg?: number; // default $2.50 / kg
}

export interface ShippingResult {
  shippingTotal: number;
  isFreeShipping: boolean;
  amountNeededForFreeShipping: number;
}

export class ShippingEngine {
  public static calculateShipping(params: ShippingCalculationParams): ShippingResult {
    const {
      subtotal,
      totalWeightGrams = 0,
      freeShippingThreshold = 50.0,
      flatRate = 5.99,
      weightRatePerKg = 2.5,
    } = params;

    if (subtotal >= freeShippingThreshold && freeShippingThreshold > 0) {
      return {
        shippingTotal: 0,
        isFreeShipping: true,
        amountNeededForFreeShipping: 0,
      };
    }

    const weightKg = Math.max(0, totalWeightGrams / 1000);
    const weightSurplus = Math.max(0, weightKg - 1); // first 1 kg covered in flat rate
    const weightCost = Math.round(weightSurplus * weightRatePerKg * 100) / 100;
    const shippingTotal = Math.round((flatRate + weightCost) * 100) / 100;

    const amountNeeded = Math.max(0, Math.round((freeShippingThreshold - subtotal) * 100) / 100);

    return {
      shippingTotal,
      isFreeShipping: false,
      amountNeededForFreeShipping: amountNeeded,
    };
  }
}
