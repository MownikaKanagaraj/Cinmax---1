import { AppSettingsEntity } from './entity';
import type { ISettingsRepository } from './repository.interface';

export class GetSettingsUseCase {
  constructor(private settingsRepo: ISettingsRepository) {}

  public async execute(): Promise<AppSettingsEntity> {
    return this.settingsRepo.getSettings();
  }
}

export class UpdateSettingsUseCase {
  constructor(private settingsRepo: ISettingsRepository) {}

  public async execute(settings: Partial<AppSettingsEntity>): Promise<AppSettingsEntity> {
    return this.settingsRepo.updateSettings(settings);
  }
}
