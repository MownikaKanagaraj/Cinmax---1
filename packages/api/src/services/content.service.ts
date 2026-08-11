import type { IBannerRepository, BannerEntity } from '../modules/banners';
import type { IBlogRepository, BlogPostEntity, BlogFilter } from '../modules/blog';
import type { ISettingsRepository, AppSettingsEntity } from '../modules/settings';
import type { PaginatedResult, PaginationParams } from '../pagination';
import { GetBannersUseCase } from '../modules/banners/useCases';
import {
  GetBlogPostsUseCase,
  GetBlogPostBySlugUseCase,
  GetFeaturedBlogPostsUseCase,
} from '../modules/blog/useCases';
import { GetSettingsUseCase, UpdateSettingsUseCase } from '../modules/settings/useCases';

export class ContentService {
  private getBannersUseCase: GetBannersUseCase;
  private getBlogPostsUseCase: GetBlogPostsUseCase;
  private getBlogPostBySlugUseCase: GetBlogPostBySlugUseCase;
  private getFeaturedBlogPostsUseCase: GetFeaturedBlogPostsUseCase;
  private getSettingsUseCase: GetSettingsUseCase;
  private updateSettingsUseCase: UpdateSettingsUseCase;

  constructor(
    private bannerRepo: IBannerRepository,
    private blogRepo: IBlogRepository,
    private settingsRepo: ISettingsRepository
  ) {
    this.getBannersUseCase = new GetBannersUseCase(bannerRepo);
    this.getBlogPostsUseCase = new GetBlogPostsUseCase(blogRepo);
    this.getBlogPostBySlugUseCase = new GetBlogPostBySlugUseCase(blogRepo);
    this.getFeaturedBlogPostsUseCase = new GetFeaturedBlogPostsUseCase(blogRepo);
    this.getSettingsUseCase = new GetSettingsUseCase(settingsRepo);
    this.updateSettingsUseCase = new UpdateSettingsUseCase(settingsRepo);
  }

  // Banners
  public async getBanners(activeOnly = true): Promise<BannerEntity[]> {
    return this.getBannersUseCase.execute(activeOnly);
  }

  public async createBanner(banner: Partial<BannerEntity>): Promise<BannerEntity> {
    return this.bannerRepo.create(banner);
  }

  public async updateBanner(id: string, updates: Partial<BannerEntity>): Promise<BannerEntity> {
    return this.bannerRepo.update(id, updates);
  }

  public async deleteBanner(id: string): Promise<boolean> {
    return this.bannerRepo.delete(id);
  }

  // Blog
  public async getBlogPosts(
    filter?: BlogFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<BlogPostEntity>> {
    return this.getBlogPostsUseCase.execute(filter, pagination);
  }

  public async getBlogPostBySlug(slug: string): Promise<BlogPostEntity> {
    return this.getBlogPostBySlugUseCase.execute(slug);
  }

  public async getFeaturedBlogPosts(): Promise<BlogPostEntity[]> {
    return this.getFeaturedBlogPostsUseCase.execute();
  }

  // Settings
  public async getSettings(): Promise<AppSettingsEntity> {
    return this.getSettingsUseCase.execute();
  }

  public async updateSettings(settings: Partial<AppSettingsEntity>): Promise<AppSettingsEntity> {
    return this.updateSettingsUseCase.execute(settings);
  }
}
