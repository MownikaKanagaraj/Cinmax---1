import type { SupabaseClient } from '@supabase/supabase-js';
import type { Product, ProductFilter } from '@cinmax/types';
import { ProductService } from '../../services/products';

export async function fetchProducts(
  supabase: SupabaseClient,
  filter?: ProductFilter
): Promise<Product[]> {
  const service = new ProductService(supabase as any);
  return service.getProducts(filter);
}

export async function fetchProductBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<Product | null> {
  const service = new ProductService(supabase as any);
  return service.getProductBySlug(slug);
}
