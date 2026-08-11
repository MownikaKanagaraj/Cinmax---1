export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'curing_or_packing' // luxury handmade soap batch preparation
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'authorized'
  | 'paid'
  | 'failed'
  | 'refunded';

export type PaymentMethod =
  | 'stripe'
  | 'apple_pay'
  | 'google_pay'
  | 'razorpay'
  | 'upi'
  | 'cod'
  | 'card';

export interface Address {
  id?: string;
  firstName: string;
  lastName: string;
  company?: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  productTitle: string;
  variantTitle: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  imageUrl?: string;
}

export interface OrderTracking {
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
}

export interface DeliveryDetails {
  state: string;
  totalProducts: number;
  charge: number;
  isFree: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  guestEmail?: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentIntentId?: string;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  shippingTotal: number;
  grandTotal: number;
  currency: string;
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
  tracking?: OrderTracking;
  trackingNumber?: string;
  delivery?: DeliveryDetails;
  customerNotes?: string;
  giftMessage?: string;
  createdAt: string;
  updatedAt: string;
}
