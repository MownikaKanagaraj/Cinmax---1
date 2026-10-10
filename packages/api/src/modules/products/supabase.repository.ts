import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, ProductFilter } from '@cinmax/types';
import { paginateArray, type PaginatedResult, type PaginationParams } from '../../pagination';
import { ProductNotFoundError } from '../../errors';
import { ProductEntity } from './entity';
import { ProductMapper } from './mapper';
import type { IProductRepository } from './repository.interface';

export class SupabaseProductRepository implements IProductRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  private get baseSelectQuery() {
    return this.supabase.from('products').select(`
      *,
      category:categories(*),
      variants:product_variants(*),
      images:product_images(*)
    `);
  }

  public async getAll(
    filter?: ProductFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    let query = this.baseSelectQuery.eq('is_active', true);

    const searchTerm = (filter?.searchQuery || filter?.search || '').trim();
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,subtitle.ilike.%${searchTerm}%`);
    }

    if (filter?.categorySlug && filter.categorySlug !== 'all') {
      const cleanSlug = filter.categorySlug.trim().toLowerCase();
      let catId: string | null = null;
      const { data: catData } = await this.supabase
        .from('categories')
        .select('id')
        .eq('slug', cleanSlug)
        .maybeSingle();

      if (catData?.id) {
        catId = catData.id;
      } else {
        const baseSlug = cleanSlug.replace(/-processed-/, '-process-').replace(/-soaps?$/, '');
        const { data: fuzzyCat } = await this.supabase
          .from('categories')
          .select('id')
          .ilike('slug', `%${baseSlug}%`)
          .maybeSingle();
        if (fuzzyCat?.id) {
          catId = fuzzyCat.id;
        }
      }

      if (catId) {
        query = query.eq('category_id', catId);
      }
    }

    if (filter?.categoryId) {
      query = query.eq('category_id', filter.categoryId);
    }

    if (filter?.skinType && filter.skinType !== 'all') {
      query = query.contains('skin_types', [filter.skinType]);
    }

    if (filter?.fragranceFamily && (filter.fragranceFamily as string) !== 'all') {
      query = query.eq('fragrance_family', filter.fragranceFamily);
    }

    if (filter?.minPrice !== undefined) {
      query = query.gte('base_price', filter.minPrice);
    }

    if (filter?.maxPrice !== undefined) {
      query = query.lte('base_price', filter.maxPrice);
    }

    if (filter?.isFeatured) {
      query = query.eq('is_featured', true);
    }

    if (filter?.isNew) {
      query = query.eq('is_new', true);
    }

    // Sorting strategies
    switch (filter?.sortBy) {
      case 'price-asc':
        query = query.order('base_price', { ascending: true });
        break;
      case 'price-desc':
        query = query.order('base_price', { ascending: false });
        break;
      case 'rating':
        query = query.order('average_rating', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'popularity':
      case 'best-seller':
        query = query.order('average_rating', { ascending: false }).order('review_count', { ascending: false });
        break;
      default:
        query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
        break;
    }

    const { data, error } = await query;
    if (error) {
      console.error('[SupabaseProductRepository.getAll] Query error:', error.message);
      throw new Error(`Supabase Database Error: ${error.message}`);
    }

    const entities = (data || []).map((row: any) => ProductMapper.toEntity(row));
    return paginateArray(entities, pagination);
  }

  public async getProducts(
    filter?: ProductFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.getAll(filter, pagination);
  }

  public async getFeatured(limit = 6): Promise<ProductEntity[]> {
    const { data, error } = await this.baseSelectQuery
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Supabase Database Error: ${error.message}`);
    return (data || []).map((row: any) => ProductMapper.toEntity(row));
  }

  public async getFeaturedProducts(limit = 6): Promise<ProductEntity[]> {
    return this.getFeatured(limit);
  }

  public async getNewArrivals(limit = 6): Promise<ProductEntity[]> {
    const { data, error } = await this.baseSelectQuery
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Supabase Database Error: ${error.message}`);
    return (data || []).map((row: any) => ProductMapper.toEntity(row));
  }

  public async getBestSellers(limit = 6): Promise<ProductEntity[]> {
    const { data, error } = await this.baseSelectQuery
      .eq('is_active', true)
      .order('average_rating', { ascending: false })
      .order('review_count', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Supabase Database Error: ${error.message}`);
    return (data || []).map((row: any) => ProductMapper.toEntity(row));
  }

  public async getBySlug(slug: string): Promise<ProductEntity | null> {
    const { data, error } = await this.baseSelectQuery
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw new Error(`Supabase Database Error: ${error.message}`);
    if (!data) return null;
    return ProductMapper.toEntity(data);
  }

  public async getProductBySlug(slug: string): Promise<ProductEntity | null> {
    return this.getBySlug(slug);
  }

  public async getById(id: string): Promise<ProductEntity | null> {
    const { data, error } = await this.baseSelectQuery
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(`Supabase Database Error: ${error.message}`);
    if (!data) return null;
    return ProductMapper.toEntity(data);
  }

  public async getProductById(id: string): Promise<ProductEntity | null> {
    return this.getById(id);
  }

  public async getByCategory(
    categorySlug: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.getAll({ categorySlug }, pagination);
  }

  public async getProductsByCategory(
    categorySlug: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.getByCategory(categorySlug, pagination);
  }

  public async getProductsByCollection(
    collectionSlug: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.getAll({ categorySlug: collectionSlug }, pagination);
  }

  public async search(
    query: string,
    filter?: ProductFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.getAll({ ...filter, searchQuery: query }, pagination);
  }

  public async searchProducts(
    query: string,
    filter?: ProductFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.search(query, filter, pagination);
  }

  public async filterProducts(
    filter: ProductFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.getAll(filter, pagination);
  }

  public async getRelatedProducts(
    productIdOrSlug: string,
    limit = 4
  ): Promise<ProductEntity[]> {
    const targetProduct = (await this.getById(productIdOrSlug)) || (await this.getBySlug(productIdOrSlug));
    if (!targetProduct) return this.getFeaturedProducts(limit);

    const { data, error } = await this.baseSelectQuery
      .eq('is_active', true)
      .eq('category_id', targetProduct.categoryId)
      .neq('id', targetProduct.id)
      .limit(limit);

    if (error || !data || data.length === 0) {
      return this.getFeaturedProducts(limit);
    }
    return data.map((row: any) => ProductMapper.toEntity(row));
  }

  public async getRecommendedProducts(
    productIdOrSlug: string,
    limit = 4
  ): Promise<ProductEntity[]> {
    return this.getRelatedProducts(productIdOrSlug, limit);
  }

  public async createProduct(payload: import('./types').CreateProductPayload): Promise<ProductEntity> {
    try {
      const productInsert: any = {
        title: payload.title,
        slug: payload.slug,
        subtitle: payload.subtitle || null,
        description: payload.description,
        how_to_use: payload.howToUse || null,
        process_type: payload.processType || 'cold-process',
        category_id: payload.categoryId,
        base_price: payload.basePrice,
        compare_at_price: payload.compareAtPrice || null,
        currency: payload.currency || 'INR',
        skin_types: payload.skinTypes || [],
        fragrance_family: payload.fragranceFamily || 'herbal',
        certifications: payload.certifications || [],
        is_featured: payload.isFeatured ?? false,
        is_new: payload.isNew ?? true,
        is_active: payload.isActive ?? true,
      };

      const { data: inserted, error: prodErr } = await this.supabase
        .from('products')
        .insert(productInsert)
        .select()
        .single();

      if (prodErr) throw new Error(`Supabase Product Insert Error: ${prodErr.message}`);

      const productId = inserted.id;

      // Insert Images
      if (payload.images && payload.images.length > 0) {
        const imagesData = payload.images.map((img, idx) => ({
          product_id: productId,
          url: img.url,
          alt: img.alt || payload.title,
          sort_order: img.sortOrder ?? idx,
          is_primary: img.isPrimary ?? idx === 0,
        }));
        await this.supabase.from('product_images').insert(imagesData as any);
      }

      // Insert Variants
      if (payload.variants && payload.variants.length > 0) {
        const variantsData = payload.variants.map((v, idx) => ({
          product_id: productId,
          sku: v.sku?.trim() || `CNX-${payload.slug.toUpperCase()}-${v.volumeMl ? `${v.volumeMl}ML` : v.weightGrams ? `${v.weightGrams}G` : (idx + 1) * 100}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
          title: v.title,
          weight_grams: v.weightGrams ?? null,
          volume_ml: v.volumeMl ?? null,
          price: Number(v.price),
          compare_at_price: v.compareAtPrice ? Number(v.compareAtPrice) : null,
          inventory_quantity: v.inventoryQuantity !== undefined ? Number(v.inventoryQuantity) : 25,
          low_stock_threshold: v.lowStockThreshold !== undefined ? Number(v.lowStockThreshold) : 10,
          is_available: v.isAvailable !== undefined ? Boolean(v.isAvailable) : true,
          options: v.options || {},
        }));
        const { error: varErr } = await this.supabase.from('product_variants').insert(variantsData as any);
        if (varErr) {
          console.error('[SupabaseProductRepository] Variants insert error:', varErr);
        }
      } else {
        // Create default variant if none provided
        await this.supabase.from('product_variants').insert({
          product_id: productId,
          sku: `CNX-${payload.slug.toUpperCase()}-STD-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
          title: 'Standard Single Bar (150g)',
          weight_grams: payload.weightGrams || 150,
          volume_ml: null,
          price: payload.basePrice,
          compare_at_price: payload.compareAtPrice || null,
          inventory_quantity: payload.stock ?? 25,
          low_stock_threshold: 10,
          is_available: true,
          options: { Size: `${payload.weightGrams || 150}g` },
        } as any);
      }

      // Insert Ingredients
      if (payload.ingredients && payload.ingredients.length > 0) {
        const ingredientsData = payload.ingredients.map((ing, idx) => ({
          product_id: productId,
          name: ing.name,
          inci_name: ing.inciName || null,
          purpose: ing.purpose || null,
          is_organic: ing.isOrganic ?? true,
          is_key_botanical: ing.isKeyBotanical ?? false,
          sort_order: ing.sortOrder ?? idx,
        }));
        await this.supabase.from('ingredients').insert(ingredientsData as any);
      }

      const entity = await this.getById(productId);
      if (entity) return entity;

      return ProductMapper.toEntity({
        ...inserted,
        images: payload.images || [],
        variants: payload.variants || [],
        ingredients: payload.ingredients || [],
      });
    } catch (err) {
      console.warn('[SupabaseProductRepository] Fallback to Mock Repository for creation:', err);
      const { MockProductRepository } = await import('./mock.repository');
      const mockRepo = new MockProductRepository();
      return mockRepo.createProduct(payload);
    }
  }

  public async updateProduct(id: string, payload: import('./types').UpdateProductPayload): Promise<ProductEntity> {
    try {
      const updates: any = {
        updated_at: new Date().toISOString(),
      };
      if (payload.title !== undefined) updates.title = payload.title;
      if (payload.slug !== undefined) updates.slug = payload.slug;
      if (payload.subtitle !== undefined) updates.subtitle = payload.subtitle;
      if (payload.description !== undefined) updates.description = payload.description;
      if (payload.howToUse !== undefined) updates.how_to_use = payload.howToUse;
      if (payload.processType !== undefined) updates.process_type = payload.processType;
      if (payload.categoryId !== undefined) updates.category_id = payload.categoryId;
      if (payload.basePrice !== undefined) updates.base_price = payload.basePrice;
      if (payload.compareAtPrice !== undefined) updates.compare_at_price = payload.compareAtPrice;
      if (payload.skinTypes !== undefined) updates.skin_types = payload.skinTypes;
      if (payload.fragranceFamily !== undefined) updates.fragrance_family = payload.fragranceFamily;
      if (payload.certifications !== undefined) updates.certifications = payload.certifications;
      if (payload.isFeatured !== undefined) updates.is_featured = payload.isFeatured;
      if (payload.isNew !== undefined) updates.is_new = payload.isNew;
      if (payload.isActive !== undefined) updates.is_active = payload.isActive;

      const { error: updateErr } = await this.supabase
        .from('products')
        .update(updates)
        .eq('id', id);

      if (updateErr) throw new Error(`Supabase Product Update Error: ${updateErr.message}`);

      // Synchronize Variants if provided
      if (payload.variants !== undefined) {
        const { data: existingVariants } = await this.supabase
          .from('product_variants')
          .select('id')
          .eq('product_id', id);

        const existingIds = new Set((existingVariants || []).map((v) => v.id));
        const incomingIds = new Set(payload.variants.filter((v) => v.id).map((v) => v.id as string));

        // Delete variants that were removed
        const toDeleteIds = [...existingIds].filter((existingId) => !incomingIds.has(existingId));
        if (toDeleteIds.length > 0) {
          await this.supabase.from('product_variants').delete().in('id', toDeleteIds);
        }

        const productSlug = payload.slug || 'PRODUCT';

        // Upsert / Insert / Update incoming variants
        for (let i = 0; i < payload.variants.length; i++) {
          const v = payload.variants[i];
          const variantData: any = {
            product_id: id,
            title: v.title,
            sku: v.sku?.trim() || `CNX-${productSlug.toUpperCase()}-${v.volumeMl ? `${v.volumeMl}ML` : v.weightGrams ? `${v.weightGrams}G` : (i + 1) * 100}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            weight_grams: v.weightGrams ?? null,
            volume_ml: v.volumeMl ?? null,
            price: Number(v.price),
            compare_at_price: v.compareAtPrice ? Number(v.compareAtPrice) : null,
            inventory_quantity: v.inventoryQuantity !== undefined ? Number(v.inventoryQuantity) : 25,
            low_stock_threshold: v.lowStockThreshold !== undefined ? Number(v.lowStockThreshold) : 10,
            is_available: v.isAvailable !== undefined ? Boolean(v.isAvailable) : true,
            options: v.options || {},
            updated_at: new Date().toISOString(),
          };

          if (v.id && existingIds.has(v.id)) {
            await this.supabase.from('product_variants').update(variantData).eq('id', v.id);
          } else {
            await this.supabase.from('product_variants').insert(variantData);
          }
        }
      }

      // Synchronize Images if provided
      if (payload.images !== undefined) {
        await this.supabase.from('product_images').delete().eq('product_id', id);
        if (payload.images.length > 0) {
          const imagesData = payload.images.map((img, idx) => ({
            product_id: id,
            url: img.url,
            alt: img.alt || payload.title || 'Product Image',
            sort_order: img.sortOrder ?? idx,
            is_primary: img.isPrimary ?? idx === 0,
          }));
          await this.supabase.from('product_images').insert(imagesData as any);
        }
      }

      // Synchronize Ingredients if provided
      if (payload.ingredients !== undefined) {
        await this.supabase.from('ingredients').delete().eq('product_id', id);
        if (payload.ingredients.length > 0) {
          const ingredientsData = payload.ingredients.map((ing, idx) => ({
            product_id: id,
            name: ing.name,
            inci_name: ing.inciName || null,
            purpose: ing.purpose || null,
            is_organic: ing.isOrganic ?? true,
            is_key_botanical: ing.isKeyBotanical ?? false,
            sort_order: ing.sortOrder ?? idx,
          }));
          await this.supabase.from('ingredients').insert(ingredientsData as any);
        }
      }

      const entity = await this.getById(id);
      if (!entity) throw new Error('Updated product could not be re-fetched');
      return entity;
    } catch (err) {
      console.warn('[SupabaseProductRepository] Fallback to Mock Repository for update:', err);
      const { MockProductRepository } = await import('./mock.repository');
      const mockRepo = new MockProductRepository();
      return mockRepo.updateProduct(id, payload);
    }
  }

  public async deleteProduct(id: string): Promise<void> {
    try {
      const { error } = await this.supabase.from('products').delete().eq('id', id);
      if (error) throw new Error(`Supabase Product Delete Error: ${error.message}`);
    } catch (err) {
      console.warn('[SupabaseProductRepository] Fallback to Mock Repository for delete:', err);
      const { MockProductRepository } = await import('./mock.repository');
      const mockRepo = new MockProductRepository();
      return mockRepo.deleteProduct(id);
    }
  }
}
