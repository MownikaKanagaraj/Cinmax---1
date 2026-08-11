import type { BlogPost } from '@cinmax/types';

export class BlogPostEntity implements BlogPost {
  public id: string;
  public slug: string;
  public title: string;
  public excerpt: string;
  public content: string;
  public coverImageUrl: string;
  public authorName: string;
  public authorAvatarUrl?: string;
  public category: string;
  public readingTimeMinutes: number;
  public publishedAt: string;
  public isPublished: boolean;
  public tags: string[];

  constructor(props: BlogPost) {
    this.id = props.id;
    this.slug = props.slug;
    this.title = props.title;
    this.excerpt = props.excerpt;
    this.content = props.content;
    this.coverImageUrl = props.coverImageUrl;
    this.authorName = props.authorName;
    this.authorAvatarUrl = props.authorAvatarUrl;
    this.category = props.category;
    this.readingTimeMinutes = props.readingTimeMinutes || 5;
    this.publishedAt = props.publishedAt;
    this.isPublished = props.isPublished !== false;
    this.tags = props.tags || [];
  }

  public get isRecent(): boolean {
    const diffDays =
      (new Date().getTime() - new Date(this.publishedAt).getTime()) / (1000 * 3600 * 24);
    return diffDays <= 14;
  }
}
