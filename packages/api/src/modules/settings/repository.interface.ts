import { AppSettingsEntity } from './entity';

export interface ISettingsRepository {
  getSettings(): Promise<AppSettingsEntity>;
  updateSettings(settings: Partial<AppSettingsEntity>): Promise<AppSettingsEntity>;
}
