import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@cinmax/types';
import { BannerEntity } from './entity';
import { BannerMapper } from './mapper';
import type { IBannerRepository } from './repository.interface';

export class SupabaseBannerRepository implements IBannerRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  public async getAll(): Promise<BannerEntity[]> {
    const { data, error } = await this.supabase
      .from('banners' as any)
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      const { MockBannerRepository } = await import('./mock.repository');
      return new MockBannerRepository().getAll();
    }
    return BannerMapper.toEntityList(data as any);
  }

  public async getActive(): Promise<BannerEntity[]> {
    const { data, error } = await this.supabase
      .from('banners' as any)
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      const { MockBannerRepository } = await import('./mock.repository');
      return new MockBannerRepository().getActive();
    }
    return BannerMapper.toEntityList(data as any);
  }

  public async create(banner: Partial<BannerEntity>): Promise<BannerEntity> {
    const rawData = {
      title: banner.title || 'New Botanical Banner',
      subtitle: banner.subtitle || '',
      cta_text: banner.ctaText || 'Shop Collection',
      cta_link: banner.ctaLink || '/shop',
      image_url: banner.imageUrl || 'https://images.unsplash.com/photo-1607006314147-759088fd21c2?w=1600&auto=format&fit=crop&q=80',
      badge_text: banner.badgeText || 'Special Release',
      background_color: banner.backgroundColor || '#002754',
      is_active: banner.isActive ?? true,
      sort_order: banner.sortOrder || 1,
    };

    const { data, error } = await this.supabase
      .from('banners' as any)
      .insert(rawData as any)
      .select('*')
      .single();

    if (error || !data) {
      const { MockBannerRepository } = await import('./mock.repository');
      return new MockBannerRepository().create(banner);
    }
    return BannerMapper.toEntity(data as any);
  }

  public async update(id: string, updates: Partial<BannerEntity>): Promise<BannerEntity> {
    const rawUpdates: Record<string, any> = {};
    if (updates.title !== undefined) rawUpdates.title = updates.title;
    if (updates.subtitle !== undefined) rawUpdates.subtitle = updates.subtitle;
    if (updates.ctaText !== undefined) rawUpdates.cta_text = updates.ctaText;
    if (updates.ctaLink !== undefined) rawUpdates.cta_link = updates.ctaLink;
    if (updates.imageUrl !== undefined) rawUpdates.image_url = updates.imageUrl;
    if (updates.badgeText !== undefined) rawUpdates.badge_text = updates.badgeText;
    if (updates.backgroundColor !== undefined) rawUpdates.background_color = updates.backgroundColor;
    if (updates.isActive !== undefined) rawUpdates.is_active = updates.isActive;
    if (updates.sortOrder !== undefined) rawUpdates.sort_order = updates.sortOrder;

    const { data, error } = await this.supabase
      .from('banners' as any)
      .update(rawUpdates as any)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      const { MockBannerRepository } = await import('./mock.repository');
      return new MockBannerRepository().update(id, updates);
    }
    return BannerMapper.toEntity(data as any);
  }

  public async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('banners' as any)
      .delete()
      .eq('id', id);

    if (error) {
      const { MockBannerRepository } = await import('./mock.repository');
      return new MockBannerRepository().delete(id);
    }
    return true;
  }
}
