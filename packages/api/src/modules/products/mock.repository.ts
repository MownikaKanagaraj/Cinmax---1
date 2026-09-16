import type { ProductFilter } from '@cinmax/types';
import { mockProductsData } from '../../mockData';
import { paginateArray, type PaginatedResult, type PaginationParams } from '../../pagination';
import { ProductEntity } from './entity';
import type { IProductRepository } from './repository.interface';

export class MockProductRepository implements IProductRepository {
  private products: ProductEntity[];

  constructor(initialData?: ProductEntity[]) {
    this.products = initialData || mockProductsData.map((p) => new ProductEntity(p));
  }

  public async getAll(
    filter?: ProductFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    let filtered = [...this.products];

    if (filter?.categorySlug && filter.categorySlug !== 'all') {
      filtered = filtered.filter((p) => p.category?.slug === filter.categorySlug);
    }

    if (filter?.skinType && filter.skinType !== 'all') {
      filtered = filtered.filter((p) => p.skinTypes.includes(filter.skinType as any));
    }

    if (filter?.fragranceFamily) {
      filtered = filtered.filter((p) => p.fragranceFamily === filter.fragranceFamily);
    }

    if (filter?.processType) {
      filtered = filtered.filter((p) => p.processType === filter.processType);
    }

    if (filter?.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.basePrice >= (filter.minPrice || 0));
    }

    if (filter?.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.basePrice <= (filter.maxPrice || Infinity));
    }

    if (filter?.inStockOnly) {
      filtered = filtered.filter((p) => p.isInStock);
    }

    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q)
      );
    }

    if (filter?.sortBy === 'price-asc') {
      filtered.sort((a, b) => a.basePrice - b.basePrice);
    } else if (filter?.sortBy === 'price-desc') {
      filtered.sort((a, b) => b.basePrice - a.basePrice);
    } else if (filter?.sortBy === 'rating') {
      filtered.sort((a, b) => b.averageRating - a.averageRating);
    } else if (filter?.sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      // Default: featured first
      filtered.sort((a, b) => (b.isFeatured === a.isFeatured ? 0 : b.isFeatured ? 1 : -1));
    }

    return paginateArray(filtered, pagination);
  }

  public async getProducts(
    filter?: ProductFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.getAll(filter, pagination);
  }

  public async getFeatured(limit = 4): Promise<ProductEntity[]> {
    return this.products.filter((p) => p.isFeatured).slice(0, limit);
  }

  public async getFeaturedProducts(limit = 4): Promise<ProductEntity[]> {
    return this.getFeatured(limit);
  }

  public async getNewArrivals(limit = 4): Promise<ProductEntity[]> {
    return [...this.products]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  public async getBestSellers(limit = 4): Promise<ProductEntity[]> {
    return [...this.products]
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, limit);
  }

  public async getBySlug(slug: string): Promise<ProductEntity | null> {
    const product = this.products.find((p) => p.slug === slug);
    return product || null;
  }

  public async getProductBySlug(slug: string): Promise<ProductEntity | null> {
    return this.getBySlug(slug);
  }

  public async getById(id: string): Promise<ProductEntity | null> {
    const product = this.products.find((p) => p.id === id);
    return product || null;
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
    return this.getByCategory(collectionSlug, pagination);
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
    const p = (await this.getById(productIdOrSlug)) || (await this.getBySlug(productIdOrSlug));
    if (!p) return this.getFeatured(limit);
    return this.products
      .filter((item) => item.categoryId === p.categoryId && item.id !== p.id)
      .slice(0, limit);
  }

  public async getRecommendedProducts(
    productIdOrSlug: string,
    limit = 4
  ): Promise<ProductEntity[]> {
    return this.getRelatedProducts(productIdOrSlug, limit);
  }

  public async createProduct(payload: import('./types').CreateProductPayload): Promise<ProductEntity> {
    const newId = `prod_${Date.now()}`;
    const newProduct = new ProductEntity({
      id: newId,
      slug: payload.slug,
      title: payload.title,
      subtitle: payload.subtitle,
      description: payload.description,
      howToUse: payload.howToUse,
      processType: payload.processType || 'cold-process',
      categoryId: payload.categoryId,
      basePrice: payload.basePrice,
      compareAtPrice: payload.compareAtPrice || null,
      currency: payload.currency || 'INR',
      skinTypes: payload.skinTypes || [],
      fragranceFamily: payload.fragranceFamily || 'herbal',
      certifications: payload.certifications || [],
      isFeatured: payload.isFeatured ?? false,
      isNew: payload.isNew ?? true,
      isActive: payload.isActive ?? true,
      images: (payload.images || []).map((img, idx) => ({
        id: img.id || `img_${newId}_${idx}`,
        url: img.url,
        alt: img.alt || payload.title,
        sortOrder: img.sortOrder ?? idx,
        isPrimary: img.isPrimary ?? idx === 0,
      })),
      variants: (payload.variants && payload.variants.length > 0
        ? payload.variants
        : [
            {
              title: 'Standard Single Bar (150g)',
              sku: `CNX-${payload.slug.toUpperCase()}-150`,
              weightGrams: payload.weightGrams || 150,
              volumeMl: undefined,
              price: payload.basePrice,
              compareAtPrice: payload.compareAtPrice || null,
              inventoryQuantity: payload.stock ?? 25,
              options: { Size: `${payload.weightGrams || 150}g` },
            },
          ]
      ).map((v, idx) => ({
        id: v.id || `var_${newId}_${idx}`,
        productId: newId,
        sku: v.sku || `CNX-${payload.slug.toUpperCase()}-${v.volumeMl ? `${v.volumeMl}ML` : v.weightGrams ? `${v.weightGrams}G` : (idx + 1) * 100}`,
        title: v.title,
        weightGrams: v.weightGrams,
        volumeMl: v.volumeMl,
        price: Number(v.price),
        compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
        inventoryQuantity: v.inventoryQuantity ?? 25,
        lowStockThreshold: v.lowStockThreshold ?? 10,
        isAvailable: v.isAvailable ?? true,
        options: v.options || {},
      })),
      ingredients: (payload.ingredients || []).map((ing, idx) => ({
        id: ing.id || `ing_${newId}_${idx}`,
        name: ing.name,
        inciName: ing.inciName,
        purpose: ing.purpose,
        isOrganic: ing.isOrganic ?? true,
        isKeyBotanical: ing.isKeyBotanical ?? false,
        sortOrder: ing.sortOrder ?? idx,
      })),
      averageRating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    this.products.unshift(newProduct);
    return newProduct;
  }

  public async updateProduct(id: string, payload: import('./types').UpdateProductPayload): Promise<ProductEntity> {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error(`Product not found: ${id}`);

    const existing = this.products[idx];
    const updatedImages = payload.images
      ? payload.images.map((img, i) => ({
          id: img.id || `img_${id}_${i}`,
          productId: id,
          url: img.url,
          alt: img.alt || existing.title,
          sortOrder: img.sortOrder ?? i,
          isPrimary: Boolean(img.isPrimary),
        }))
      : existing.images;

    const updatedVariants = payload.variants
      ? payload.variants.map((v, i) => ({
          id: v.id || `var_${id}_${i}`,
          productId: id,
          sku: v.sku || `CNX-${(payload.slug || existing.slug).toUpperCase()}-${v.volumeMl ? `${v.volumeMl}ML` : v.weightGrams ? `${v.weightGrams}G` : (i + 1) * 100}`,
          title: v.title,
          weightGrams: v.weightGrams,
          volumeMl: v.volumeMl,
          price: Number(v.price),
          compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
          inventoryQuantity: v.inventoryQuantity ?? 25,
          lowStockThreshold: v.lowStockThreshold ?? 10,
          isAvailable: v.isAvailable ?? true,
          options: v.options || {},
        }))
      : existing.variants;

    const updatedIngredients = payload.ingredients
      ? payload.ingredients.map((ing, i) => ({
          id: ing.id || `ing_${id}_${i}`,
          productId: id,
          name: ing.name,
          inciName: ing.inciName,
          purpose: ing.purpose,
          isOrganic: Boolean(ing.isOrganic),
          isKeyBotanical: Boolean(ing.isKeyBotanical),
          sortOrder: ing.sortOrder ?? i,
        }))
      : existing.ingredients;

    const updated = new ProductEntity({
      ...existing,
      ...payload,
      images: updatedImages,
      variants: updatedVariants,
      ingredients: updatedIngredients,
      updatedAt: new Date().toISOString(),
    });
    this.products[idx] = updated;
    return updated;
  }

  public async deleteProduct(id: string): Promise<void> {
    this.products = this.products.filter((p) => p.id !== id);
  }
}
