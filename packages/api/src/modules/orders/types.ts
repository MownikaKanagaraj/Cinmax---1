import type { Address, CartItem, Order, OrderStatus, PaymentMethod } from '@cinmax/types';

export interface CreateOrderPayload {
  userId?: string | null;
  guestEmail?: string | null;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  shippingTotal: number;
  grandTotal: number;
}

export interface UpdateOrderStatusPayload {
  orderId: string;
  status: OrderStatus;
  trackingNumber?: string;
  carrier?: string;
}
