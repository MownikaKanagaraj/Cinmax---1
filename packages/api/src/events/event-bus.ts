export type DomainEventType =
  | 'OrderCreated'
  | 'PaymentSucceeded'
  | 'PaymentFailed'
  | 'OrderCancelled'
  | 'OrderShipped'
  | 'InventoryUpdated'
  | 'CouponRedeemed'
  | 'CustomerRegistered';

export interface DomainEvent<T = any> {
  id: string;
  type: DomainEventType;
  timestamp: string;
  payload: T;
}

export type EventHandler<T = any> = (event: DomainEvent<T>) => Promise<void> | void;

export class EventBus {
  private static instance: EventBus;
  private handlers: Map<DomainEventType, Set<EventHandler>> = new Map();

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public subscribe<T = any>(type: DomainEventType, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);

    return () => {
      this.handlers.get(type)?.delete(handler);
    };
  }

  public async publish<T = any>(type: DomainEventType, payload: T): Promise<DomainEvent<T>> {
    const event: DomainEvent<T> = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      timestamp: new Date().toISOString(),
      payload,
    };

    const subscribers = this.handlers.get(type);
    if (subscribers && subscribers.size > 0) {
      const promises = Array.from(subscribers).map((handler) =>
        Promise.resolve().then(() => handler(event)).catch((err) => {
          console.error(`[EventBus] Error in event handler for ${type}:`, err);
        })
      );
      await Promise.all(promises);
    }

    return event;
  }
}
