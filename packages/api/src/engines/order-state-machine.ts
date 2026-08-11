import type { OrderStatus } from '@cinmax/types';

export interface StateTransitionResult {
  allowed: boolean;
  message?: string;
}

export class OrderStateMachine {
  private static readonly VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    pending: ['payment_pending', 'cancelled'],
    payment_pending: ['paid', 'pending', 'cancelled'],
    paid: ['confirmed', 'cancelled', 'refunded'],
    confirmed: ['processing', 'cancelled', 'refunded'],
    processing: ['packed', 'cancelled'],
    packed: ['shipped', 'cancelled'],
    shipped: ['out_for_delivery', 'delivered', 'returned'],
    out_for_delivery: ['delivered', 'returned'],
    delivered: ['returned'],
    cancelled: [],
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
