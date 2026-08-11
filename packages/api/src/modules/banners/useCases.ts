import { BannerEntity } from './entity';
import type { IBannerRepository } from './repository.interface';

export class GetBannersUseCase {
  constructor(private bannerRepo: IBannerRepository) {}

  public async execute(activeOnly = true): Promise<BannerEntity[]> {
    return activeOnly ? this.bannerRepo.getActive() : this.bannerRepo.getAll();
  }
}
