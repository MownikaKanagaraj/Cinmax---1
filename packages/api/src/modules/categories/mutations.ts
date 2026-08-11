import type { SupabaseClient } from '@supabase/supabase-js';
import type { CreateCategoryPayload, UpdateCategoryPayload } from './types';

export async function createCategory(
  supabase: SupabaseClient,
  payload: CreateCategoryPayload
) {
  const { data, error } = await supabase
    .from('categories')
    .insert({
      slug: payload.slug,
      name: payload.name,
      description: payload.description,
      image_url: payload.imageUrl,
      parent_id: payload.parentId,
      sort_order: payload.sortOrder ?? 0,
      is_active: payload.isActive ?? true,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCategory(
  supabase: SupabaseClient,
  payload: UpdateCategoryPayload
) {
  const { id, ...updates } = payload;
  const { data, error } = await supabase
    .from('categories')
    .update(updates as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
