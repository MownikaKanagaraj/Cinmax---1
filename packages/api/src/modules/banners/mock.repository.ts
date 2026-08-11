import { mockBannersData } from '../../mockData';
import { BannerEntity } from './entity';
import type { IBannerRepository } from './repository.interface';

export class MockBannerRepository implements IBannerRepository {
  private banners: BannerEntity[];

  constructor(initialData?: BannerEntity[]) {
    this.banners = initialData || mockBannersData.map((b) => new BannerEntity(b));
  }

  public async getAll(): Promise<BannerEntity[]> {
    return [...this.banners].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public async getActive(): Promise<BannerEntity[]> {
    return this.banners
      .filter((b) => b.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public async create(bannerData: Partial<BannerEntity>): Promise<BannerEntity> {
    const newBanner = new BannerEntity({
      id: bannerData.id || `ban_${Date.now()}`,
      title: bannerData.title || 'New Botanical Banner',
      subtitle: bannerData.subtitle || 'Handcrafted Cured Blend',
      ctaText: bannerData.ctaText || 'Shop Collection',
      ctaLink: bannerData.ctaLink || '/shop',
      imageUrl: bannerData.imageUrl || 'https://images.unsplash.com/photo-1607006314147-759088fd21c2?w=1600&auto=format&fit=crop&q=80',
      badgeText: bannerData.badgeText || 'Special Release',
      backgroundColor: bannerData.backgroundColor || '#002754',
      isActive: bannerData.isActive ?? true,
      sortOrder: bannerData.sortOrder || this.banners.length + 1,
    });
    this.banners.push(newBanner);
    return newBanner;
  }

  public async update(id: string, updates: Partial<BannerEntity>): Promise<BannerEntity> {
    const index = this.banners.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new Error(`Banner with ID ${id} not found.`);
    }
    const existing = this.banners[index];
    const updatedBanner = new BannerEntity({
      id: existing.id,
      title: updates.title ?? existing.title,
      subtitle: updates.subtitle ?? existing.subtitle,
      ctaText: updates.ctaText ?? existing.ctaText,
      ctaLink: updates.ctaLink ?? existing.ctaLink,
      imageUrl: updates.imageUrl ?? existing.imageUrl,
      badgeText: updates.badgeText ?? existing.badgeText,
      backgroundColor: updates.backgroundColor ?? existing.backgroundColor,
      isActive: updates.isActive ?? existing.isActive,
      sortOrder: updates.sortOrder ?? existing.sortOrder,
    });
    this.banners[index] = updatedBanner;
    return updatedBanner;
  }

  public async delete(id: string): Promise<boolean> {
    const initialLength = this.banners.length;
    this.banners = this.banners.filter((b) => b.id !== id);
    return this.banners.length < initialLength;
  }
}
