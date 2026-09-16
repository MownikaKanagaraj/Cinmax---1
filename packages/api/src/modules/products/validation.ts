import { z } from 'zod';

export const ProductFilterSchema = z.object({
  categorySlug: z.string().optional(),
  skinType: z.string().optional(),
  fragranceFamily: z.string().optional(),
  processType: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  inStockOnly: z.boolean().optional(),
  searchQuery: z.string().optional(),
  sortBy: z.enum(['featured', 'price-asc', 'price-desc', 'rating', 'newest']).optional(),
});

export const ProductImageSchema = z.object({
  id: z.string().optional(),
  url: z.string().url('Image must be a valid URL'),
  alt: z.string().optional(),
  isPrimary: z.boolean().default(false),
  sortOrder: z.number().default(0),
});

export const ProductVariantSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Variant title is required'),
  sku: z.string().optional(),
  weightGrams: z.number().nullable().optional(),
  volumeMl: z.number().nullable().optional(),
  price: z.number().min(0, 'Variant price must be non-negative'),
  compareAtPrice: z.number().min(0).nullable().optional(),
  inventoryQuantity: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().min(0).default(10),
  isAvailable: z.boolean().default(true),
  options: z.record(z.any()).optional(),
});

export const ProductIngredientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Ingredient name is required'),
  inciName: z.string().optional(),
  purpose: z.string().optional(),
  isOrganic: z.boolean().default(true),
  isKeyBotanical: z.boolean().default(false),
  sortOrder: z.number().default(0),
});

export const CreateProductSchema = z.object({
  title: z.string().min(2, 'Product title must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  brand: z.string().default('CINMAX'),
  subtitle: z.string().optional(),
  description: z.string().min(5, 'Product description is required'),
  howToUse: z.string().optional(),
  processType: z.enum([
    'cold-process',
    'triple-milled',
    'melt-and-pour',
    'liquid-botanical',
    'whipped-butter',
  ]).default('cold-process'),
  categoryId: z.string().min(1, 'Category is required'),
  basePrice: z.number().min(0, 'Selling price must be non-negative'),
  compareAtPrice: z.number().min(0).nullable().optional(),
  currency: z.string().default('INR'),
  stock: z.number().int().min(0).default(25),
  weightGrams: z.number().min(0).default(125),
  skinTypes: z.array(z.string()).default([]),
  fragranceFamily: z.enum([
    'unscented',
    'citrus',
    'woody',
    'floral',
    'herbal',
    'earthy',
    'aquatic',
    'spicy',
  ]).default('herbal'),
  certifications: z.array(z.string()).default([]),
  trustBadges: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(true),
  isActive: z.boolean().default(true),
  images: z.array(ProductImageSchema).default([]),
  variants: z.array(ProductVariantSchema).default([]),
  ingredients: z.array(ProductIngredientSchema).default([]),
});

export const UpdateProductSchema = CreateProductSchema.partial().extend({
  id: z.string(),
});
