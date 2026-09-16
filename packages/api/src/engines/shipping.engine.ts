import { calculateDeliveryCharge, type DeliveryCalculationResult } from '@cinmax/utils';

export interface ShippingCalculationParams {
  subtotal?: number;
  state?: string | null;
  totalProducts?: number;
}

export interface ShippingResult {
  shippingTotal: number;
  isFreeShipping: boolean;
  amountNeededForFreeShipping: number;
  deliveryDetails: DeliveryCalculationResult;
}

export class ShippingEngine {
  public static calculateShipping(params: ShippingCalculationParams): ShippingResult {
    const { state, totalProducts = 0 } = params;

    const deliveryDetails = calculateDeliveryCharge(state, totalProducts);

    return {
      shippingTotal: deliveryDetails.deliveryCharge,
      isFreeShipping: deliveryDetails.isFreeDelivery,
      amountNeededForFreeShipping: 0,
      deliveryDetails,
    };
  }
}
