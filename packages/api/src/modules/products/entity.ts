import type {
  Product,
  ProductCategory,
  ProductImage,
  ProductIngredient,
  ProductVariant,
  SkinType,
  FragranceFamily,
  SoapProcessType,
} from '@cinmax/types';

export class ProductEntity implements Product {
  public id: string;
  public slug: string;
  public title: string;
  public subtitle?: string;
  public description: string;
  public howToUse?: string;
  public processType: SoapProcessType;
  public categoryId: string;
  public category?: ProductCategory;
  public basePrice: number;
  public compareAtPrice?: number | null;
  public currency: string;
  public images: ProductImage[];
  public variants: ProductVariant[];
  public ingredients: ProductIngredient[];
  public skinTypes: SkinType[];
  public fragranceFamily: FragranceFamily;
  public certifications: string[];
  public isFeatured: boolean;
  public isNew: boolean;
  public isBestSeller?: boolean;
  public averageRating: number;
  public reviewCount: number;
  public createdAt: string;
  public updatedAt: string;

  constructor(props: Product) {
    this.id = props.id;
    this.slug = props.slug;
    this.title = props.title;
    this.subtitle = props.subtitle;
    this.description = props.description;
    this.howToUse = props.howToUse;
    this.processType = props.processType;
    this.categoryId = props.categoryId;
    this.category = props.category;
    this.basePrice = props.basePrice;
    this.compareAtPrice = props.compareAtPrice;
    this.currency = props.currency || 'USD';
    this.images = props.images || [];
    this.variants = props.variants || [];
    this.ingredients = props.ingredients || [];
    this.skinTypes = props.skinTypes || [];
    this.fragranceFamily = props.fragranceFamily || 'unscented';
    this.certifications = props.certifications || [];
    this.isFeatured = Boolean(props.isFeatured);
    this.isNew = Boolean(props.isNew);
    this.isBestSeller = Boolean(props.isBestSeller);
    this.averageRating = props.averageRating || 5.0;
    this.reviewCount = props.reviewCount || 0;
    this.createdAt = props.createdAt || new Date().toISOString();
    this.updatedAt = props.updatedAt || new Date().toISOString();
  }

  public get primaryImage(): ProductImage | undefined {
    return this.images.find((img) => img.isPrimary) || this.images[0];
  }

  public get defaultVariant(): ProductVariant | undefined {
    return this.variants[0];
  }

  public get hasDiscount(): boolean {
    return Boolean(this.compareAtPrice && this.compareAtPrice > this.basePrice);
  }

  public get discountPercentage(): number {
    if (!this.hasDiscount || !this.compareAtPrice) return 0;
    return Math.round(((this.compareAtPrice - this.basePrice) / this.compareAtPrice) * 100);
  }

  public get isInStock(): boolean {
    return this.variants.some((v) => v.isAvailable && v.inventoryQuantity > 0);
  }
}
