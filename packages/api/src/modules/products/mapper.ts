import type { Product, ProductCategory, ProductVariant, ProductIngredient, ProductImage } from '@cinmax/types';
import type { ProductDTO } from './dto';
import { ProductEntity } from './entity';

export class ProductMapper {
  public static toEntity(dto: ProductDTO): ProductEntity {
    const category: ProductCategory | undefined = dto.category
      ? {
          id: dto.category.id,
          slug: dto.category.slug,
          name: dto.category.name,
          description: dto.category.description || undefined,
          imageUrl: dto.category.image_url || undefined,
          parentId: dto.category.parent_id,
          sortOrder: dto.category.sort_order,
          isActive: dto.category.is_active,
        }
      : undefined;

    const images: ProductImage[] = (dto.images || []).map((img, idx) => ({
      id: img.id || `img_${idx}`,
      url: img.url,
      alt: img.alt || '',
      sortOrder: img.sort_order || idx,
      isPrimary: Boolean(img.is_primary),
    }));

    const variants: ProductVariant[] = (dto.variants || []).map((v) => ({
      id: v.id,
      productId: v.product_id,
      sku: v.sku,
      title: v.title,
      weightGrams: v.weight_grams ?? undefined,
      volumeMl: v.volume_ml ?? undefined,
      price: Number(v.price),
      compareAtPrice: v.compare_at_price ? Number(v.compare_at_price) : null,
      inventoryQuantity: v.inventory_quantity,
      lowStockThreshold: v.low_stock_threshold,
      isAvailable: v.is_available,
      options: v.options || {},
    }));

    const ingredients: ProductIngredient[] = (dto.ingredients || []).map((ing) => ({
      id: ing.id,
      name: ing.name,
      inciName: ing.inci_name ?? undefined,
      purpose: ing.purpose ?? undefined,
      isOrganic: ing.is_organic,
      isKeyBotanical: ing.is_key_botanical,
      sortOrder: ing.sort_order,
    }));

    return new ProductEntity({
      id: dto.id,
      slug: dto.slug,
      title: dto.title,
      subtitle: dto.subtitle ?? undefined,
      description: dto.description,
      howToUse: dto.how_to_use ?? undefined,
      processType: (dto.process_type as any) || 'cold-process',
      categoryId: dto.category_id,
      category,
      basePrice: Number(dto.base_price),
      compareAtPrice: dto.compare_at_price ? Number(dto.compare_at_price) : null,
      currency: dto.currency || 'USD',
      images,
      variants,
      ingredients,
      skinTypes: (dto.skin_types || []) as any,
      fragranceFamily: (dto.fragrance_family as any) || 'unscented',
      certifications: dto.certifications || [],
      isFeatured: Boolean(dto.is_featured),
      isNew: Boolean(dto.is_new),
      isBestSeller: Boolean(dto.is_best_seller),
      minOrderQuantity: dto.min_order_quantity ? Math.max(1, Number(dto.min_order_quantity)) : 1,
      quantityPrice: dto.quantity_price !== undefined && dto.quantity_price !== null ? Number(dto.quantity_price) : null,
      averageRating: Number(dto.average_rating || 5.0),
      reviewCount: Number(dto.review_count || 0),
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
    });
  }

  public static toDTO(entity: Product | ProductEntity): ProductDTO {
    return {
      id: entity.id,
      slug: entity.slug,
      title: entity.title,
      subtitle: entity.subtitle ?? null,
      description: entity.description,
      how_to_use: entity.howToUse ?? null,
      process_type: entity.processType,
      category_id: entity.categoryId,
      category: entity.category
        ? {
            id: entity.category.id,
            slug: entity.category.slug,
            name: entity.category.name,
            description: entity.category.description ?? null,
            image_url: entity.category.imageUrl ?? null,
            parent_id: entity.category.parentId ?? null,
            sort_order: entity.category.sortOrder,
            is_active: entity.category.isActive,
          }
        : null,
      base_price: entity.basePrice,
      compare_at_price: entity.compareAtPrice ?? null,
      currency: entity.currency,
      images: entity.images.map((img) => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        sort_order: img.sortOrder,
        is_primary: img.isPrimary,
      })),
      variants: entity.variants.map((v) => ({
        id: v.id,
        product_id: v.productId,
        sku: v.sku,
        title: v.title,
        weight_grams: v.weightGrams ?? null,
        volume_ml: v.volumeMl ?? null,
        price: v.price,
        compare_at_price: v.compareAtPrice ?? null,
        inventory_quantity: v.inventoryQuantity,
        low_stock_threshold: v.lowStockThreshold,
        is_available: v.isAvailable,
        options: v.options,
      })),
      ingredients: entity.ingredients.map((ing) => ({
        id: ing.id,
        name: ing.name,
        inci_name: ing.inciName ?? null,
        purpose: ing.purpose ?? null,
        is_organic: ing.isOrganic,
        is_key_botanical: ing.isKeyBotanical,
        sort_order: ing.sortOrder,
      })),
      skin_types: entity.skinTypes,
      fragrance_family: entity.fragranceFamily,
      certifications: entity.certifications,
      is_featured: entity.isFeatured,
      is_new: entity.isNew,
      is_best_seller: entity.isBestSeller ?? false,
      min_order_quantity: entity.minOrderQuantity ?? 1,
      quantity_price: entity.quantityPrice ?? null,
      average_rating: entity.averageRating,
      review_count: entity.reviewCount,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    };
  }

  public static toEntityList(dtos: ProductDTO[]): ProductEntity[] {
    return dtos.map(this.toEntity);
  }
}
