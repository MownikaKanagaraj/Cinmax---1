import type {
  IShippingProvider,
  CreateShipmentPayload,
  ShipmentDetails,
} from './shipping-provider.interface';

export class MockShippingProvider implements IShippingProvider {
  public async createShipment(payload: CreateShipmentPayload): Promise<ShipmentDetails> {
    const awbCode = `MOCK-AWB-${Date.now().toString().slice(-6)}`;
    const shipmentId = `mock_shp_${Date.now()}`;

    return {
      shipmentId,
      orderId: payload.orderId,
      awbCode,
      courierName: 'Cinmax Botanical Logistics',
      status: 'manifested',
      labelUrl: `https://cinmax.com/mock-labels/${shipmentId}`,
      estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      trackingHistory: [
        {
          status: 'manifested',
          location: 'Atelier Dispatch Hub',
          timestamp: new Date().toISOString(),
          activity: 'Shipment created and queued for courier pickup',
        },
      ],
    };
  }

  public async generateAWB(shipmentId: string): Promise<string> {
    return `MOCK-AWB-${Date.now().toString().slice(-6)}`;
  }

  public async schedulePickup(shipmentId: string, pickupDate: string): Promise<boolean> {
    return true;
  }

  public async generateShippingLabel(shipmentId: string): Promise<string> {
    return `https://cinmax.com/mock-labels/${shipmentId}`;
  }

  public async trackShipment(awbOrShipmentId: string): Promise<ShipmentDetails> {
    return {
      shipmentId: awbOrShipmentId,
      orderId: 'ord_mock',
      awbCode: awbOrShipmentId.startsWith('MOCK-') ? awbOrShipmentId : 'MOCK-AWB-123456',
      courierName: 'Cinmax Botanical Express',
      status: 'out_for_delivery',
      estimatedDeliveryDate: new Date().toISOString(),
      trackingHistory: [
        {
          status: 'manifested',
          location: 'Atelier Central',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          activity: 'Package dispatched',
        },
        {
          status: 'out_for_delivery',
          location: 'Destination Facility',
          timestamp: new Date().toISOString(),
          activity: 'Out for final delivery with courier rider',
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
      orderId: 'ord_mock',
      awbCode: `RET-MOCK-${Date.now().toString().slice(-6)}`,
      courierName: 'Cinmax Reverse Logistics',
      status: 'pickup_scheduled',
      trackingHistory: [
        {
          status: 'pickup_scheduled',
          location: 'Customer Address',
          timestamp: new Date().toISOString(),
          activity: `Return pickup arranged. Reason: ${reason}`,
        },
      ],
    };
  }

  public async estimateDeliveryDate(pincode: string): Promise<string> {
    return new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
  }
}
