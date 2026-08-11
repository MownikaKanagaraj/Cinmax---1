import type { SupabaseClient } from '@supabase/supabase-js';
import type { ProductCategory } from '@cinmax/types';

export async function fetchCategories(
  supabase: SupabaseClient
): Promise<ProductCategory[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error || !data) return [];
  return data.map((c: any) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    imageUrl: c.image_url,
    parentId: c.parent_id,
    sortOrder: c.sort_order,
    isActive: c.is_active,
  }));
}
