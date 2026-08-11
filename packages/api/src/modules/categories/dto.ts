export interface CategoryDTO {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  parent_id?: string | null;
  sort_order: number;
  is_active: boolean;
}
