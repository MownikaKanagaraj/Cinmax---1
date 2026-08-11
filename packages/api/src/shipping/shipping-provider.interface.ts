import type { Address } from '@cinmax/types';

export interface CreateShipmentPayload {
  orderId: string;
  orderNumber: string;
  recipientAddress: Address;
  items: Array<{
    name: string;
    sku: string;
    units: number;
    sellingPrice: number;
  }>;
  totalWeightGrams: number;
  lengthCm?: number;
  breadthCm?: number;
  heightCm?: number;
}

export interface ShipmentDetails {
  shipmentId: string;
  orderId: string;
  awbCode: string;
  courierName: string;
  status: 'manifested' | 'pickup_scheduled' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
  labelUrl?: string;
  manifestUrl?: string;
  estimatedDeliveryDate?: string;
  trackingHistory: Array<{
    status: string;
    location: string;
    timestamp: string;
    activity: string;
  }>;
}

export interface IShippingProvider {
  createShipment(payload: CreateShipmentPayload): Promise<ShipmentDetails>;
  generateAWB(shipmentId: string, courierId?: string): Promise<string>;
  schedulePickup(shipmentId: string, pickupDate: string): Promise<boolean>;
  generateShippingLabel(shipmentId: string): Promise<string>;
  trackShipment(awbOrShipmentId: string): Promise<ShipmentDetails>;
  cancelShipment(shipmentId: string): Promise<boolean>;
  createReturn(shipmentId: string, reason: string): Promise<ShipmentDetails>;
  estimateDeliveryDate(pincode: string): Promise<string>;
}
