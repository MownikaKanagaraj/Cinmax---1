import type { OrderStatus } from '@cinmax/types';

export interface StateTransitionResult {
  allowed: boolean;
  message?: string;
}

export class OrderStateMachine {
  private static readonly VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    pending: ['payment_pending', 'paid', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    payment_pending: ['paid', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    paid: ['confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded'],
    confirmed: ['processing', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded'],
    processing: ['packed', 'shipped', 'delivered', 'cancelled', 'refunded'],
    packed: ['shipped', 'delivered', 'cancelled', 'refunded'],
    shipped: ['out_for_delivery', 'delivered', 'returned', 'cancelled', 'refunded'],
    out_for_delivery: ['delivered', 'returned', 'cancelled'],
    delivered: ['returned', 'refunded', 'shipped', 'processing'],
    cancelled: ['confirmed', 'processing'],
    returned: ['refunded'],
    refunded: [],
  };

  public static canTransition(current: OrderStatus, next: OrderStatus): StateTransitionResult {
    if (current === next) {
      return { allowed: true };
    }

    const allowedNext = this.VALID_TRANSITIONS[current] || [];
    if (allowedNext.includes(next)) {
      return { allowed: true };
    }

    return {
      allowed: false,
      message: `Invalid order state transition from '${current}' to '${next}'.`,
    };
  }

  public static validateTransition(current: OrderStatus, next: OrderStatus): void {
    const result = this.canTransition(current, next);
    if (!result.allowed) {
      throw new Error(result.message);
    }
  }
}
