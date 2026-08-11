import type { SupabaseClient } from '@supabase/supabase-js';
import type { CreateProductPayload, UpdateProductPayload } from './types';

export async function createProduct(
  supabase: SupabaseClient,
  payload: CreateProductPayload
) {
  const { data, error } = await supabase
    .from('products')
    .insert({
      title: payload.title,
      slug: payload.slug,
      subtitle: payload.subtitle,
      description: payload.description,
      how_to_use: payload.howToUse,
      process_type: payload.processType,
      category_id: payload.categoryId,
      base_price: payload.basePrice,
      compare_at_price: payload.compareAtPrice,
      skin_types: payload.skinTypes,
      fragrance_family: payload.fragranceFamily,
      certifications: payload.certifications,
      is_featured: payload.isFeatured ?? false,
      is_new: payload.isNew ?? true,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProduct(
  supabase: SupabaseClient,
  payload: UpdateProductPayload
) {
  const { id, ...updates } = payload;
  const { data, error } = await supabase
    .from('products')
    .update(updates as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(supabase: SupabaseClient, productId: string) {
  const { error } = await supabase.from('products').delete().eq('id', productId);
  if (error) throw error;
}
