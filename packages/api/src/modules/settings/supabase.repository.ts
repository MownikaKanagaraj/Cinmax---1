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
        appName: 'Cinmax Global Products',
        currency: 'USD',
        taxRate: 0.08,
        freeShippingThreshold: 50,
        standardShippingFee: 6.95,
        contactEmail: 'support@cinmax.com',
        supportPhone: '+1 (800) 555-CINMAX',
      });
    }

    return AppSettingsMapper.toEntity(data as any);
  }

  public async updateSettings(settings: Partial<AppSettingsEntity>): Promise<AppSettingsEntity> {
    const current = await this.getSettings();
    const updated = new AppSettingsEntity({ ...current, ...settings });
    const dto = AppSettingsMapper.toDTO(updated);

    const { error } = await this.supabase
      .from('app_settings' as any)
      .upsert(dto as any);

    if (error) throw error;
    return updated;
  }
}
