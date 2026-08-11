export interface BlogPostDTO {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  author_name: string;
  author_avatar_url?: string | null;
  category: string;
  reading_time_minutes: number;
  published_at: string;
  is_published: boolean;
  tags?: string[] | null;
}
