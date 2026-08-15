import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, HomeMarketingSettings } from '@cinmax/types';
import type { IHomeMarketingRepository } from './repository.interface';
import { MockHomeMarketingRepository } from './mock.repository';

export class SupabaseHomeMarketingRepository implements IHomeMarketingRepository {
  private fallbackMock = new MockHomeMarketingRepository();

  constructor(private supabase: SupabaseClient<Database>) {}

  public async getSettings(): Promise<HomeMarketingSettings> {
    try {
      const { data, error } = await (this.supabase as any)
        .from('home_marketing_settings')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();

      if (error || !data) {
        return this.fallbackMock.getSettings();
      }

      return data.settings as HomeMarketingSettings;
    } catch (err) {
      console.warn('[SupabaseHomeMarketingRepository] Network error, falling back to mock data');
      return this.fallbackMock.getSettings();
    }
  }

  public async updateSettings(newSettings: Partial<HomeMarketingSettings>): Promise<HomeMarketingSettings> {
    try {
      const current = await this.getSettings();
      const updated: HomeMarketingSettings = {
        ...current,
        ...newSettings,
        updatedAt: new Date().toISOString(),
      };

      const { error } = await (this.supabase as any)
        .from('home_marketing_settings')
        .upsert({ id: 'default', settings: updated, updated_at: updated.updatedAt });

      if (error) {
        return this.fallbackMock.updateSettings(newSettings);
      }

      return updated;
    } catch (err) {
      console.warn('[SupabaseHomeMarketingRepository] Network error on update, falling back to mock');
      return this.fallbackMock.updateSettings(newSettings);
    }
  }
}
