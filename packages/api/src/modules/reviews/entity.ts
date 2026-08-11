import type { ProductReview } from '@cinmax/types/domain';

export class ReviewEntity implements ProductReview {
  public id: string;
  public productId: string;
  public userId?: string;
  public authorName: string;
  public rating: number;
  public title: string;
  public content: string;
  public scentRating?: number;
  public latherRating?: number;
  public moistureRating?: number;
  public isVerifiedPurchaser: boolean;
  public isApproved?: boolean;
  public images?: string[];
  public helpfulCount: number;
  public createdAt: string;
  public updatedAt: string;

  constructor(props: ProductReview) {
    this.id = props.id;
    this.productId = props.productId;
    this.userId = props.userId;
    this.authorName = props.authorName;
    this.rating = props.rating;
    this.title = props.title;
    this.content = props.content;
    this.scentRating = props.scentRating;
    this.latherRating = props.latherRating;
    this.moistureRating = props.moistureRating;
    this.isVerifiedPurchaser = props.isVerifiedPurchaser ?? false;
    this.isApproved = (props as any).isApproved ?? true;
    this.images = props.images || [];
    this.helpfulCount = props.helpfulCount || 0;
    this.createdAt = props.createdAt || new Date().toISOString();
    this.updatedAt = props.updatedAt || new Date().toISOString();
  }

  public get isPositive(): boolean {
    return this.rating >= 4;
  }
}
