import type {
  IShippingProvider,
  CreateShipmentPayload,
  ShipmentDetails,
} from './shipping-provider.interface';

export class ShiprocketProvider implements IShippingProvider {
  private apiToken?: string;
  private baseUrl = 'https://apiv2.shiprocket.in/v1/external';

  constructor(apiToken?: string) {
    this.apiToken = apiToken || (typeof process !== 'undefined' ? process.env.SHIPROCKET_API_TOKEN : undefined);
  }

  public async createShipment(payload: CreateShipmentPayload): Promise<ShipmentDetails> {
    const awbCode = `SR-AWB-${Date.now().toString().slice(-6)}`;
    const shipmentId = `sr_shp_${Date.now()}`;

    return {
      shipmentId,
      orderId: payload.orderId,
      awbCode,
      courierName: 'Shiprocket Express',
      status: 'manifested',
      labelUrl: `https://shiprocket.co/labels/${shipmentId}`,
      manifestUrl: `https://shiprocket.co/manifests/${shipmentId}`,
      estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      trackingHistory: [
        {
          status: 'manifested',
          location: payload.recipientAddress.city || 'Hub Central',
          timestamp: new Date().toISOString(),
          activity: 'Shipment created and manifested via Shiprocket API',
        },
      ],
    };
  }

  public async generateAWB(shipmentId: string, courierId?: string): Promise<string> {
    return `SR-AWB-${Date.now().toString().slice(-6)}`;
  }

  public async schedulePickup(shipmentId: string, pickupDate: string): Promise<boolean> {
    return true;
  }

  public async generateShippingLabel(shipmentId: string): Promise<string> {
    return `https://shiprocket.co/labels/${shipmentId}`;
  }

  public async trackShipment(awbOrShipmentId: string): Promise<ShipmentDetails> {
    return {
      shipmentId: awbOrShipmentId,
      orderId: 'ord_sample',
      awbCode: awbOrShipmentId.startsWith('SR-') ? awbOrShipmentId : `SR-AWB-987654`,
      courierName: 'Shiprocket Express',
      status: 'in_transit',
      estimatedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      trackingHistory: [
        {
          status: 'manifested',
          location: 'Origin Facility',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          activity: 'Package processed at origin sorting center',
        },
        {
          status: 'in_transit',
          location: 'Regional Sorting Hub',
          timestamp: new Date().toISOString(),
          activity: 'In transit to destination city hub',
        },
      ],
    };
  }

  public async cancelShipment(shipmentId: string): Promise<boolean> {
    return true;
  }

  public async createReturn(shipmentId: string, reason: string): Promise<ShipmentDetails> {
    return {
      shipmentId: `ret_${shipmentId}`,
      orderId: 'ord_sample',
      awbCode: `RET-SR-${Date.now().toString().slice(-6)}`,
      courierName: 'Shiprocket Reverse Express',
      status: 'pickup_scheduled',
      trackingHistory: [
        {
          status: 'pickup_scheduled',
          location: 'Customer Address',
          timestamp: new Date().toISOString(),
          activity: `Return pickup scheduled. Reason: ${reason}`,
        },
      ],
    };
  }

  public async estimateDeliveryDate(pincode: string): Promise<string> {
    const daysToAdd = pincode.startsWith('11') || pincode.startsWith('40') ? 2 : 4;
    return new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();
  }
}
