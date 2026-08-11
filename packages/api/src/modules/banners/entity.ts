import type { PromoBanner } from '@cinmax/types';

export class BannerEntity implements PromoBanner {
  public id: string;
  public title: string;
  public subtitle?: string;
  public ctaText: string;
  public ctaLink: string;
  public imageUrl: string;
  public mobileImageUrl?: string;
  public badgeText?: string;
  public backgroundColor?: string;
  public isActive: boolean;
  public sortOrder: number;

  constructor(props: PromoBanner) {
    this.id = props.id;
    this.title = props.title;
    this.subtitle = props.subtitle;
    this.ctaText = props.ctaText;
    this.ctaLink = props.ctaLink;
    this.imageUrl = props.imageUrl;
    this.mobileImageUrl = props.mobileImageUrl;
    this.badgeText = props.badgeText;
    this.backgroundColor = props.backgroundColor;
    this.isActive = props.isActive !== false;
    this.sortOrder = props.sortOrder || 0;
  }
}
