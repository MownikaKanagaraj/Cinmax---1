import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Product, ProductCategory, ProductFilter } from '@cinmax/types';

export class ProductService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getCategories(): Promise<ProductCategory[]> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return (data || []).map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      imageUrl: c.image_url || undefined,
      parentId: c.parent_id,
      sortOrder: c.sort_order,
      isActive: c.is_active,
    }));
  }

  async getProducts(filter?: ProductFilter): Promise<Product[]> {
    let query = this.supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        variants:product_variants(*),
        images:product_images(*),
        ingredients:ingredients(*)
      `)
      .eq('is_active', true);

    if (filter?.skinType && filter.skinType !== 'all') {
      query = query.contains('skin_types', [filter.skinType]);
    }

    if (filter?.fragranceFamily) {
      query = query.eq('fragrance_family', filter.fragranceFamily);
    }

    if (filter?.minPrice !== undefined) {
      query = query.gte('base_price', filter.minPrice);
    }

    if (filter?.maxPrice !== undefined) {
      query = query.lte('base_price', filter.maxPrice);
    }

    if (filter?.sortBy === 'price-asc') {
      query = query.order('base_price', { ascending: true });
    } else if (filter?.sortBy === 'price-desc') {
      query = query.order('base_price', { ascending: false });
    } else if (filter?.sortBy === 'rating') {
      query = query.order('average_rating', { ascending: false });
    } else {
      query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(this.mapDbProductToDomain);
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        variants:product_variants(*),
        images:product_images(*),
        ingredients:ingredients(*)
      `)
      .eq('slug', slug)
      .single();

    if (error || !data) return null;
    return this.mapDbProductToDomain(data);
  }

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        variants:product_variants(*),
        images:product_images(*),
        ingredients:ingredients(*)
      `)
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return this.mapDbProductToDomain(data);
  }

  async createProduct(payload: import('../modules/products/types').CreateProductPayload): Promise<Product> {
    const { SupabaseProductRepository } = await import('../modules/products/supabase.repository');
    const repo = new SupabaseProductRepository(this.supabase as any);
    const entity = await repo.createProduct(payload);
    return entity.toJSON();
  }

  async updateProduct(id: string, payload: import('../modules/products/types').UpdateProductPayload): Promise<Product> {
    const { SupabaseProductRepository } = await import('../modules/products/supabase.repository');
    const repo = new SupabaseProductRepository(this.supabase as any);
    const entity = await repo.updateProduct(id, payload);
    return entity.toJSON();
  }

  async deleteProduct(id: string): Promise<void> {
    const { SupabaseProductRepository } = await import('../modules/products/supabase.repository');
    const repo = new SupabaseProductRepository(this.supabase as any);
    await repo.deleteProduct(id);
  }

  private mapDbProductToDomain(row: any): Product {
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      subtitle: row.subtitle || undefined,
      description: row.description,
      howToUse: row.how_to_use || undefined,
      processType: row.process_type as any,
      categoryId: row.category_id,
      category: row.category
        ? {
            id: row.category.id,
            slug: row.category.slug,
            name: row.category.name,
            description: row.category.description,
            imageUrl: row.category.image_url || undefined,
            parentId: row.category.parent_id,
            sortOrder: row.category.sort_order,
            isActive: row.category.is_active,
          }
        : undefined,
      basePrice: Number(row.base_price),
      compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : null,
      currency: row.currency || 'INR',
      images: (row.images || []).map((img: any) => ({
        id: img.id,
        productId: img.product_id,
        url: img.url,
        alt: img.alt || row.title,
        sortOrder: img.sort_order || 0,
        isPrimary: Boolean(img.is_primary),
      })),
      variants: (row.variants || []).map((v: any) => ({
        id: v.id,
        productId: v.product_id,
        sku: v.sku,
        title: v.title,
        weightGrams: v.weight_grams,
        volumeMl: v.volume_ml,
        price: Number(v.price),
        compareAtPrice: v.compare_at_price ? Number(v.compare_at_price) : null,
        inventoryQuantity: v.inventory_quantity,
        lowStockThreshold: v.low_stock_threshold,
        isAvailable: v.is_available,
        options: v.options || {},
      })),
      ingredients: (row.ingredients || []).map((ing: any) => ({
        id: ing.id,
        productId: ing.product_id,
        name: ing.name,
        inciName: ing.inci_name,
        purpose: ing.purpose,
        isOrganic: Boolean(ing.is_organic),
        isKeyBotanical: Boolean(ing.is_key_botanical),
        sortOrder: ing.sort_order || 0,
      })),
      skinTypes: (row.skin_types || []) as any,
      fragranceFamily: row.fragrance_family as any,
      certifications: (row.certifications || []) as any,
      isFeatured: Boolean(row.is_featured),
      isNew: Boolean(row.is_new),
      isBestSeller: false,
      averageRating: Number(row.average_rating || 5.0),
      reviewCount: Number(row.review_count || 0),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
