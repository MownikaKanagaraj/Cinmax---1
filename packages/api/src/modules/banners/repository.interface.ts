import { BannerEntity } from './entity';

export interface IBannerRepository {
  getAll(): Promise<BannerEntity[]>;
  getActive(): Promise<BannerEntity[]>;
  create(banner: Partial<BannerEntity>): Promise<BannerEntity>;
  update(id: string, updates: Partial<BannerEntity>): Promise<BannerEntity>;
  delete(id: string): Promise<boolean>;
}
