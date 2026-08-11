import type { BlogPost } from '@cinmax/types';
import type { BlogPostDTO } from './dto';
import { BlogPostEntity } from './entity';

export class BlogPostMapper {
  public static toEntity(dto: BlogPostDTO): BlogPostEntity {
    return new BlogPostEntity({
      id: dto.id,
      slug: dto.slug,
      title: dto.title,
      excerpt: dto.excerpt,
      content: dto.content,
      coverImageUrl: dto.cover_image_url,
      authorName: dto.author_name,
      authorAvatarUrl: dto.author_avatar_url ?? undefined,
      category: dto.category,
      readingTimeMinutes: dto.reading_time_minutes,
      publishedAt: dto.published_at,
      isPublished: dto.is_published,
      tags: dto.tags || [],
    });
  }

  public static toDTO(entity: BlogPost | BlogPostEntity): BlogPostDTO {
    return {
      id: entity.id,
      slug: entity.slug,
      title: entity.title,
      excerpt: entity.excerpt,
      content: entity.content,
      cover_image_url: entity.coverImageUrl,
      author_name: entity.authorName,
      author_avatar_url: entity.authorAvatarUrl ?? null,
      category: entity.category,
      reading_time_minutes: entity.readingTimeMinutes,
      published_at: entity.publishedAt,
      is_published: entity.isPublished,
      tags: entity.tags,
    };
  }

  public static toEntityList(dtos: BlogPostDTO[]): BlogPostEntity[] {
    return dtos.map(this.toEntity.bind(this));
  }
}
