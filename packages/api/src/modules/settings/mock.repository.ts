import { AppSettingsEntity } from './entity';
import type { ISettingsRepository } from './repository.interface';

export class MockSettingsRepository implements ISettingsRepository {
  private settings: AppSettingsEntity;

  constructor(initialData?: AppSettingsEntity) {
    this.settings =
      initialData ||
      new AppSettingsEntity({
        appName: 'Cinmax Global Products',
        currency: 'USD',
        taxRate: 0.08,
        freeShippingThreshold: 50,
        standardShippingFee: 6.95,
        contactEmail: 'support@cinmax.com',
        supportPhone: '+1 (800) 555-CINMAX',
      });
  }

  public async getSettings(): Promise<AppSettingsEntity> {
    return this.settings;
  }

  public async updateSettings(settings: Partial<AppSettingsEntity>): Promise<AppSettingsEntity> {
    this.settings = new AppSettingsEntity({
      ...this.settings,
      ...settings,
    });
    return this.settings;
  }
}
