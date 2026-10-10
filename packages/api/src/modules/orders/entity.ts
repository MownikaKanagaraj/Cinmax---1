import type {
  Order,
  OrderItem,
  Address,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  OrderTimelineEvent,
  DeliveryDetails,
} from '@cinmax/types';

export class OrderEntity implements Order {
  public id: string;
  public orderNumber: string;
  public userId?: string | null;
  public guestEmail?: string | null;
  public status: OrderStatus;
  public paymentStatus: PaymentStatus;
  public paymentMethod: PaymentMethod;
  public paymentIntentId?: string;
  public subtotal: number;
  public discountTotal: number;
  public taxTotal: number;
  public shippingTotal: number;
  public grandTotal: number;
  public currency: string;
  public shippingAddress: Address;
  public billingAddress: Address;
  public items: OrderItem[];
  public trackingNumber?: string;
  public trackingUrl?: string;
  public carrier?: string;
  public estimatedDeliveryDate?: string;
  public delivery?: DeliveryDetails;
  public timeline?: OrderTimelineEvent[];
  public createdAt: string;
  public updatedAt: string;

  constructor(props: Order) {
    this.id = props.id;
    this.orderNumber = props.orderNumber;
    this.userId = props.userId;
    this.guestEmail = props.guestEmail;
    this.status = props.status;
    this.paymentStatus = props.paymentStatus;
    this.paymentMethod = props.paymentMethod || 'stripe';
    this.paymentIntentId = props.paymentIntentId;
    this.subtotal = props.subtotal;
    this.discountTotal = props.discountTotal || 0;
    this.taxTotal = props.taxTotal || 0;
    this.shippingTotal = props.shippingTotal || 0;
    this.grandTotal = props.grandTotal;
    this.currency = props.currency || 'USD';
    this.shippingAddress = props.shippingAddress;
    this.billingAddress = props.billingAddress || props.shippingAddress;
    this.items = props.items || [];
    this.trackingNumber = props.trackingNumber;
    this.trackingUrl = props.trackingUrl;
    this.carrier = props.carrier;
    this.estimatedDeliveryDate = props.estimatedDeliveryDate;
    this.delivery = props.delivery;
    this.timeline = props.timeline || [];
    this.createdAt = props.createdAt || new Date().toISOString();
    this.updatedAt = props.updatedAt || new Date().toISOString();
  }

  public get itemCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  public get isDelivered(): boolean {
    return this.status === 'delivered';
  }

  public get isCancelled(): boolean {
    return this.status === 'cancelled';
  }
}
