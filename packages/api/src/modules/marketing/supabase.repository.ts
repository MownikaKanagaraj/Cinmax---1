import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, HomeMarketingSettings } from '@cinmax/types';
import type { IHomeMarketingRepository } from './repository.interface';
import { MockHomeMarketingRepository } from './mock.repository';

export class SupabaseHomeMarketingRepository implements IHomeMarketingRepository {
  private fallbackMock = new MockHomeMarketingRepository();
  private hasTableError = false;

  constructor(private supabase: SupabaseClient<Database>) {}

  public async getSettings(): Promise<HomeMarketingSettings> {
    // Check if we are running in browser context and API endpoint is available
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/home-marketing', { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          if (data && data.topOffers) {
            return data as HomeMarketingSettings;
          }
        }
      } catch (e) {
        // Fallthrough to Supabase client
      }
    }

    if (this.hasTableError) {
      return this.fallbackMock.getSettings();
    }

    try {
      const { data, error } = await (this.supabase as any)
        .from('home_marketing_settings')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();

      if (error) {
        this.hasTableError = true;
        return this.fallbackMock.getSettings();
      }

      if (!data) {
        return this.fallbackMock.getSettings();
      }

      return data.settings as HomeMarketingSettings;
    } catch (err) {
      this.hasTableError = true;
      return this.fallbackMock.getSettings();
    }
  }

  public async updateSettings(newSettings: Partial<HomeMarketingSettings>): Promise<HomeMarketingSettings> {
    const current = await this.getSettings();
    const updated: HomeMarketingSettings = {
      ...current,
      ...newSettings,
      updatedAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/home-marketing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
        if (res.ok) {
          const resData = await res.json();
          if (resData.success && resData.data) {
            return resData.data as HomeMarketingSettings;
          }
        }
      } catch (e) {
        // Fallthrough to Supabase
      }
    }

    if (this.hasTableError) {
      return this.fallbackMock.updateSettings(newSettings);
    }

    try {
      const { error } = await (this.supabase as any)
        .from('home_marketing_settings')
        .upsert({ id: 'default', settings: updated, updated_at: updated.updatedAt });

      if (error) {
        this.hasTableError = true;
        return this.fallbackMock.updateSettings(newSettings);
      }

      return updated;
    } catch (err) {
      this.hasTableError = true;
      return this.fallbackMock.updateSettings(newSettings);
    }
  }
}
