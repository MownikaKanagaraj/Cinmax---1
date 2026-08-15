import type { HomeMarketingSettings } from '@cinmax/types';

export interface IHomeMarketingRepository {
  getSettings(): Promise<HomeMarketingSettings>;
  updateSettings(settings: Partial<HomeMarketingSettings>): Promise<HomeMarketingSettings>;
}
