import type { HomeMarketingSettings } from '@cinmax/types';
import type { IHomeMarketingRepository } from '../modules/marketing';

export class HomeMarketingService {
  constructor(private repo: IHomeMarketingRepository) {}

  public async getSettings(): Promise<HomeMarketingSettings> {
    return this.repo.getSettings();
  }

  public async updateSettings(settings: Partial<HomeMarketingSettings>): Promise<HomeMarketingSettings> {
    return this.repo.updateSettings(settings);
  }
}
