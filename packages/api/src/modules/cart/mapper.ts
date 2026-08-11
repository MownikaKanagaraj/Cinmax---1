import type { Cart, CartItem } from '@cinmax/types';
import type { CartDTO } from './dto';
import { CartEntity } from './entity';

export class CartMapper {
  public static toEntity(dto: CartDTO): CartEntity {
    const items: CartItem[] = (dto.items || []).map((item) => ({
      id: item.id,
      cartId: item.cart_id,
      productId: item.product_id,
      variantId: item.variant_id ?? undefined,
      product: {
        id: item.product.id,
        title: item.product.title,
        slug: item.product.slug,
        images: item.product.images.map((img, idx) => ({
          id: `img_${idx}`,
          url: img.url,
          alt: img.alt || '',
          sortOrder: idx,
          isPrimary: Boolean(img.is_primary),
        })),
        processType: item.product.process_type as any,
      },
      variant: item.variant
        ? {
            id: item.variant.id,
            sku: item.variant.sku,
            title: item.variant.title,
            price: Number(item.variant.price),
            weightGrams: item.variant.weight_grams ?? undefined,
            volumeMl: item.variant.volume_ml ?? undefined,
            options: item.variant.options || {},
          }
        : {
            id: item.variant_id || item.product_id,
            sku: 'DEFAULT',
            title: 'Default',
            price: Number(item.unit_price),
            weightGrams: undefined,
            volumeMl: undefined,
            options: {},
          },
      quantity: item.quantity,
      unitPrice: Number(item.unit_price),
      totalPrice: Number(item.total_price),
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));

    return new CartEntity({
      id: dto.id,
      userId: dto.user_id,
      anonymousId: dto.anonymous_id,
      items,
      appliedDiscount: dto.applied_discount
        ? {
            code: dto.applied_discount.code,
            discountType: dto.applied_discount.discount_type as any,
            discountValue: dto.applied_discount.discount_value,
            description: dto.applied_discount.description ?? undefined,
          }
        : undefined,
      subtotal: Number(dto.subtotal),
      discountTotal: Number(dto.discount_total || 0),
      taxTotal: Number(dto.tax_total || 0),
      shippingTotal: Number(dto.shipping_total || 0),
      grandTotal: Number(dto.grand_total),
      currency: dto.currency || 'USD',
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
    });
  }

  public static toDTO(entity: Cart | CartEntity): CartDTO {
    return {
      id: entity.id,
      user_id: entity.userId ?? null,
      anonymous_id: entity.anonymousId ?? null,
      items: entity.items.map((i) => ({
        id: i.id,
        cart_id: i.cartId,
        product_id: i.productId,
        variant_id: i.variantId ?? null,
        product: {
          id: i.product.id,
          title: i.product.title,
          slug: i.product.slug,
          images: i.product.images.map((img) => ({
            url: img.url,
            alt: img.alt,
            is_primary: img.isPrimary,
          })),
          process_type: i.product.processType,
        },
        variant: i.variant
          ? {
              id: i.variant.id,
              sku: i.variant.sku,
              title: i.variant.title,
              price: i.variant.price,
              weight_grams: i.variant.weightGrams ?? null,
              volume_ml: i.variant.volumeMl ?? null,
              options: i.variant.options ?? null,
            }
          : null,
        quantity: i.quantity,
        unit_price: i.unitPrice,
        total_price: i.totalPrice,
        created_at: i.createdAt,
        updated_at: i.updatedAt,
      })),
      applied_discount: entity.appliedDiscount
        ? {
            code: entity.appliedDiscount.code,
            discount_type: entity.appliedDiscount.discountType || 'percentage',
            discount_value: (entity.appliedDiscount as any).discountValue ?? (entity.appliedDiscount as any).amount ?? 0,
            description: entity.appliedDiscount.description ?? null,
          }
        : null,
      subtotal: entity.subtotal,
      discount_total: entity.discountTotal,
      tax_total: entity.taxTotal,
      shipping_total: entity.shippingTotal,
      grand_total: entity.grandTotal,
      currency: entity.currency,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    };
  }
}
