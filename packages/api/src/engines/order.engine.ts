import type { Order, OrderItem, OrderStatus, Address } from '@cinmax/types';
import { calculateDeliveryCharge } from '@cinmax/utils';
import { OrderStateMachine } from './order-state-machine';
import { InvoiceEngine, type InvoiceDetails } from './invoice.engine';
import { PricingEngineOutput } from './pricing.engine';

export interface CreateOrderParams {
  userId?: string | null;
  shippingAddress: Address;
  billingAddress: Address;
  pricing: PricingEngineOutput;
  items: OrderItem[];
  paymentMethod?: string;
  paymentTransactionId?: string;
}

export class OrderEngine {
  public static generateOrderNumber(): string {
    const year = new Date().getFullYear();
    const randomHex = Math.floor(100000 + Math.random() * 900000).toString();
    return `CNX-${year}-${randomHex}`;
  }

  public static createOrder(params: CreateOrderParams): Order {
    const orderNumber = this.generateOrderNumber();
    const now = new Date().toISOString();

    const totalProducts = (params.items || []).reduce((acc, item) => acc + (item.quantity || 1), 0);
    const deliveryCalc = calculateDeliveryCharge(params.shippingAddress?.state, totalProducts);
    const shippingTotal = deliveryCalc.deliveryCharge;

    const grandTotal = Math.round(
      Math.max(
        0,
        params.pricing.subtotal -
          (params.pricing.totalPatronSavings || 0) +
          (params.pricing.taxResult?.taxTotal || 0) +
          shippingTotal
      ) * 100
    ) / 100;

    const order: Order = {
      id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      orderNumber,
      userId: params.userId || null,
      status: 'confirmed',
      paymentStatus: 'paid',
      shippingAddress: params.shippingAddress,
      billingAddress: params.billingAddress,
      subtotal: params.pricing.subtotal,
      discountTotal: params.pricing.totalPatronSavings,
      taxTotal: params.pricing.taxResult.taxTotal,
      shippingTotal,
      grandTotal,
      currency: params.pricing.currency || 'INR',
      paymentMethod: (params.paymentMethod as any) || 'upi',
      paymentIntentId: params.paymentTransactionId,
      items: params.items,
      delivery: {
        state: deliveryCalc.state,
        totalProducts: deliveryCalc.totalProducts,
        charge: deliveryCalc.deliveryCharge,
        isFree: deliveryCalc.isFreeDelivery,
      },
      createdAt: now,
      updatedAt: now,
    };

    return order;
  }

  public static transitionStatus(
    currentStatus: OrderStatus,
    targetStatus: OrderStatus
  ): OrderStatus {
    OrderStateMachine.validateTransition(currentStatus, targetStatus);
    return targetStatus;
  }

  public static generateInvoice(order: Order): InvoiceDetails {
    return InvoiceEngine.createInvoice(order);
  }

  public static reserveInventory(items: OrderItem[]): { success: boolean; itemsReserved: number } {
    return {
      success: true,
      itemsReserved: items.reduce((acc, i) => acc + i.quantity, 0),
    };
  }

  public static releaseInventory(items: OrderItem[]): { success: boolean; itemsReleased: number } {
    return {
      success: true,
      itemsReleased: items.reduce((acc, i) => acc + i.quantity, 0),
    };
  }
}
