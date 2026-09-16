import type { Order, OrderItem, OrderTimelineEvent, PaymentMethod } from '@cinmax/types';
import type { OrderDTO } from './dto';
import { OrderEntity } from './entity';

export class OrderMapper {
  public static toEntity(dto: OrderDTO): OrderEntity {
    const items: OrderItem[] = (dto.items || []).map((item) => ({
      id: item.id,
      orderId: item.order_id,
      productId: item.product_id,
      variantId: item.variant_id ?? undefined,
      productTitle: item.product_title,
      variantTitle: item.variant_title ?? '',
      sku: item.sku,
      unitPrice: Number(item.unit_price),
      quantity: item.quantity,
      totalPrice: Number(item.total_price),
      imageUrl: item.image_url ?? undefined,
    }));

    const timeline: OrderTimelineEvent[] = (dto.timeline || []).map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description ?? '',
      timestamp: event.timestamp,
      status: event.status as any,
    }));

    return new OrderEntity({
      id: dto.id,
      orderNumber: dto.order_number,
      userId: dto.user_id,
      guestEmail: dto.guest_email,
      status: dto.status as any,
      paymentStatus: dto.payment_status as any,
      paymentMethod: (dto.payment_method as PaymentMethod) || 'razorpay',
      paymentIntentId: dto.payment_intent_id ?? undefined,
      subtotal: Number(dto.subtotal || (dto as any).items_subtotal || 0),
      discountTotal: Number(dto.discount_total || (dto as any).discount_amount || 0),
      taxTotal: Number(dto.tax_total || (dto as any).tax_amount || 0),
      shippingTotal: Number(dto.shipping_total || (dto as any).shipping_amount || 0),
      grandTotal: Number(dto.grand_total),
      currency: dto.currency || 'USD',
      shippingAddress: dto.shipping_address,
      billingAddress: dto.billing_address || dto.shipping_address,
      items,
      trackingNumber: dto.tracking_number ?? (dto.metadata as any)?.tracking_number ?? (dto.metadata as any)?.trackingNumber ?? undefined,
      carrier: dto.carrier ?? (dto.metadata as any)?.carrier ?? (dto.metadata as any)?.courierName ?? undefined,
      estimatedDeliveryDate: dto.estimated_delivery_date ?? (dto.metadata as any)?.estimated_delivery_date ?? (dto.metadata as any)?.estimatedDeliveryDate ?? undefined,
      timeline,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
    });
  }

  public static toDTO(entity: Order | OrderEntity): OrderDTO {
    return {
      id: entity.id,
      order_number: entity.orderNumber,
      user_id: entity.userId ?? null,
      guest_email: entity.guestEmail ?? null,
      status: entity.status,
      payment_status: entity.paymentStatus,
      payment_method: entity.paymentMethod ?? null,
      payment_intent_id: entity.paymentIntentId ?? null,
      subtotal: entity.subtotal,
      discount_total: entity.discountTotal,
      tax_total: entity.taxTotal,
      shipping_total: entity.shippingTotal,
      grand_total: entity.grandTotal,
      currency: entity.currency,
      shipping_address: entity.shippingAddress,
      billing_address: entity.billingAddress ?? null,
      items: entity.items.map((i) => ({
        id: i.id,
        order_id: i.orderId,
        product_id: i.productId || '',
        variant_id: i.variantId ?? null,
        product_title: i.productTitle,
        variant_title: i.variantTitle ?? '',
        sku: i.sku,
        unit_price: i.unitPrice,
        quantity: i.quantity,
        total_price: i.totalPrice,
        image_url: i.imageUrl ?? null,
      })),
      tracking_number: entity.trackingNumber ?? null,
      carrier: entity.carrier ?? null,
      estimated_delivery_date: entity.estimatedDeliveryDate ?? null,
      timeline: (entity.timeline || []).map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description ?? null,
        timestamp: t.timestamp,
        status: t.status,
      })),
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    };
  }

  public static toEntityList(dtos: OrderDTO[]): OrderEntity[] {
    return dtos.map(this.toEntity);
  }
}
