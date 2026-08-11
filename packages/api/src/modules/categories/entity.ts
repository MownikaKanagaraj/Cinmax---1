import type { ProductCategory } from '@cinmax/types';

export class CategoryEntity implements ProductCategory {
  public id: string;
  public slug: string;
  public name: string;
  public description?: string;
  public imageUrl?: string;
  public parentId?: string | null;
  public sortOrder: number;
  public isActive: boolean;

  constructor(props: ProductCategory) {
    this.id = props.id;
    this.slug = props.slug;
    this.name = props.name;
    this.description = props.description;
    this.imageUrl = props.imageUrl;
    this.parentId = props.parentId ?? null;
    this.sortOrder = props.sortOrder ?? 0;
    this.isActive = props.isActive !== false;
  }
}
