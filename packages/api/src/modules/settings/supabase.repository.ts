import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@cinmax/types';
import { AppSettingsEntity } from './entity';
import { AppSettingsMapper } from './mapper';
import type { ISettingsRepository } from './repository.interface';

export class SupabaseSettingsRepository implements ISettingsRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  public async getSettings(): Promise<AppSettingsEntity> {
    const { data, error } = await this.supabase
      .from('app_settings' as any)
      .select('*')
      .limit(1)
      .single();

    if (error || !data) {
      return new AppSettingsEntity({
        appName: 'CINMAX Global Products',
        currency: 'INR',
        taxRate: 0,
        freeShippingThreshold: 499,
        standardShippingFee: 60,
        contactEmail: 'concierge@cinmaxglobal.com',
        supportPhone: '+91 98765 43210',
        dispatchTimeDays: 20,
      });
    }

    return AppSettingsMapper.toEntity(data as any);
  }

  public async updateSettings(settings: Partial<AppSettingsEntity>): Promise<AppSettingsEntity> {
    const current = await this.getSettings();
    const updated = new AppSettingsEntity({ ...current, ...settings });
    const dto = {
      id: 'default',
      ...AppSettingsMapper.toDTO(updated),
      updated_at: new Date().toISOString(),
    };

    const { error } = await this.supabase
      .from('app_settings' as any)
      .upsert(dto as any);

    if (error) throw error;

    // Synchronously ensure home_marketing_settings has the same dispatchTimeDays
    if (updated.dispatchTimeDays !== undefined) {
      try {
        const { data: homeRow } = await this.supabase
          .from('home_marketing_settings' as any)
          .select('settings')
          .eq('id', 'default')
          .maybeSingle();

        if (homeRow?.settings) {
          const nextSettings = {
            ...(homeRow.settings as any),
            dispatchTimeDays: updated.dispatchTimeDays,
            updatedAt: new Date().toISOString(),
          };
          await this.supabase
            .from('home_marketing_settings' as any)
            .update({ settings: nextSettings, updated_at: new Date().toISOString() })
            .eq('id', 'default');
        }
      } catch (syncErr) {
        console.warn('Optional home_marketing_settings sync note:', syncErr);
      }
    }

    return updated;
  }
}
