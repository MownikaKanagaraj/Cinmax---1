import type { Cart, CartItem, AppliedCoupon } from '@cinmax/types';

export class CartEntity implements Cart {
  public id: string;
  public userId?: string | null;
  public anonymousId?: string | null;
  public items: CartItem[];
  public appliedDiscount?: AppliedCoupon | null;
  public subtotal: number;
  public discountTotal: number;
  public taxTotal: number;
  public shippingTotal: number;
  public grandTotal: number;
  public currency: string;
  public createdAt: string;
  public updatedAt: string;

  constructor(props: Cart) {
    this.id = props.id;
    this.userId = props.userId;
    this.anonymousId = props.anonymousId;
    this.items = props.items || [];
    this.appliedDiscount = props.appliedDiscount;
    this.subtotal = props.subtotal || 0;
    this.discountTotal = props.discountTotal || 0;
    this.taxTotal = props.taxTotal || 0;
    this.shippingTotal = props.shippingTotal || 0;
    this.grandTotal = props.grandTotal || 0;
    this.currency = props.currency || 'USD';
    this.createdAt = props.createdAt || new Date().toISOString();
    this.updatedAt = props.updatedAt || new Date().toISOString();
  }

  public get totalItemsCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  public get isEmpty(): boolean {
    return this.items.length === 0;
  }
}
