export type SkinType =
  | 'all'
  | 'normal'
  | 'dry'
  | 'sensitive'
  | 'oily'
  | 'combination'
  | 'mature';

export type FragranceFamily =
  | 'unscented'
  | 'citrus'
  | 'woody'
  | 'floral'
  | 'herbal'
  | 'earthy'
  | 'aquatic'
  | 'spicy';

export type SoapProcessType =
  | 'cold-process'
  | 'triple-milled'
  | 'melt-and-pour'
  | 'liquid-botanical'
  | 'whipped-butter';

export type ProductCertification =
  | '100-vegan'
  | 'cruelty-free'
  | 'usda-organic'
  | 'sulfate-free'
  | 'paraben-free'
  | 'palm-oil-free'
  | 'fair-trade'
  | 'biodegradable';

export interface Ingredient {
  id: string;
  inciName: string;
  commonName: string;
  botanicalSource?: string;
  function: string;
  isOrganic: boolean;
  isHeroIngredient: boolean;
  description?: string;
}

export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl?: string;
  parentId?: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  title: string;
  weightGrams?: number;
  volumeMl?: number;
  price: number;
  compareAtPrice?: number | null;
  inventoryQuantity: number;
  lowStockThreshold: number;
  isAvailable: boolean;
  options: {
    scent?: string;
    size?: string;
    packSize?: number;
  };
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  howToUse?: string;
  processType: SoapProcessType;
  categoryId: string;
  category?: ProductCategory;
  basePrice: number;
  compareAtPrice?: number | null;
  currency: string;
  images: ProductImage[];
  variants: ProductVariant[];
  ingredients: Ingredient[];
  skinTypes: SkinType[];
  fragranceFamily: FragranceFamily;
  fragranceNotes?: {
    top?: string[];
    heart?: string[];
    base?: string[];
  };
  certifications: ProductCertification[];
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilter {
  categorySlug?: string;
  categoryId?: string;
  skinType?: SkinType | string;
  fragranceFamily?: FragranceFamily;
  certifications?: ProductCertification[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  sortBy?: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popularity' | 'best-seller';
  searchQuery?: string;
  search?: string;
}
