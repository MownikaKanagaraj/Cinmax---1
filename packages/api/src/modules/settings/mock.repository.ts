import { AppSettingsEntity } from './entity';
import type { ISettingsRepository } from './repository.interface';

export class MockSettingsRepository implements ISettingsRepository {
  private settings: AppSettingsEntity;

  constructor(initialData?: AppSettingsEntity) {
    this.settings =
      initialData ||
      new AppSettingsEntity({
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
