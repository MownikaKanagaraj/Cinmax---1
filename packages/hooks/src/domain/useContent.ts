import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  useContentService,
  queryKeys,
  type BannerEntity,
  type BlogPostEntity,
  type AppSettingsEntity,
  type BlogFilter,
  type PaginatedResult,
  type PaginationParams,
} from '@cinmax/api';

// Banners
export function useBannersQuery(activeOnly = true) {
  const contentService = useContentService();

  return useQuery<BannerEntity[]>({
    queryKey: queryKeys.banners.list(activeOnly),
    queryFn: () => contentService.getBanners(activeOnly),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateBannerMutation() {
  const contentService = useContentService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (banner: Partial<BannerEntity>) => contentService.createBanner(banner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.banners.all });
    },
  });
}

export function useUpdateBannerMutation() {
  const contentService = useContentService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<BannerEntity> }) =>
      contentService.updateBanner(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.banners.all });
    },
  });
}

export function useDeleteBannerMutation() {
  const contentService = useContentService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contentService.deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.banners.all });
    },
  });
}

// Blog
export function useBlogPostsQuery(
  filter?: BlogFilter,
  pagination?: PaginationParams,
  options?: { enabled?: boolean }
) {
  const contentService = useContentService();

  return useQuery<PaginatedResult<BlogPostEntity>>({
    queryKey: queryKeys.blog.list(filter),
    queryFn: () => contentService.getBlogPosts(filter, pagination),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 5,
  });
}

export function useBlogPostBySlugQuery(slug: string, options?: { enabled?: boolean }) {
  const contentService = useContentService();

  return useQuery<BlogPostEntity>({
    queryKey: queryKeys.blog.detail(slug),
    queryFn: () => contentService.getBlogPostBySlug(slug),
    enabled: Boolean(slug) && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 5,
  });
}

export function useFeaturedBlogPostsQuery() {
  const contentService = useContentService();

  return useQuery<BlogPostEntity[]>({
    queryKey: queryKeys.blog.featured(),
    queryFn: () => contentService.getFeaturedBlogPosts(),
    staleTime: 1000 * 60 * 5,
  });
}

// Settings
export function useSettingsQuery() {
  const contentService = useContentService();

  return useQuery<AppSettingsEntity>({
    queryKey: queryKeys.settings.current(),
    queryFn: () => contentService.getSettings(),
    staleTime: 1000 * 60 * 2,
  });
}

export function useDispatchTimeQuery() {
  const { data: settings, isLoading } = useSettingsQuery();
  const dispatchDays = settings?.dispatchTimeDays !== undefined ? Number(settings.dispatchTimeDays) : 20;
  return {
    dispatchTimeDays: dispatchDays,
    displayText: `Dispatch Time: ${dispatchDays} Days`,
    isLoading,
  };
}

export function useUpdateSettingsMutation() {
  const contentService = useContentService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: Partial<AppSettingsEntity>) => contentService.updateSettings(settings),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.settings.current(), updated);
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
      queryClient.invalidateQueries({ queryKey: ['home-marketing-settings'] });
    },
  });
}
