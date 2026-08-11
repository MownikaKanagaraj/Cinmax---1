export interface TaxCalculationParams {
  subtotal: number;
  gstRate?: number; // e.g. 18 for 18%
  isIntraState?: boolean;
}

export interface TaxResult {
  taxTotal: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  taxRate: number;
}

export class TaxEngine {
  public static calculateTax(params: TaxCalculationParams): TaxResult {
    const { subtotal, gstRate = 18, isIntraState = true } = params;
    if (subtotal <= 0) {
      return {
        taxTotal: 0,
        cgstAmount: 0,
        sgstAmount: 0,
        igstAmount: 0,
        taxRate: gstRate,
      };
    }

    const taxTotal = Math.round((subtotal * (gstRate / 100)) * 100) / 100;

    if (isIntraState) {
      const halfTax = Math.round((taxTotal / 2) * 100) / 100;
      return {
        taxTotal,
        cgstAmount: halfTax,
        sgstAmount: halfTax,
        igstAmount: 0,
        taxRate: gstRate,
      };
    }

    return {
      taxTotal,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: taxTotal,
      taxRate: gstRate,
    };
  }
}
