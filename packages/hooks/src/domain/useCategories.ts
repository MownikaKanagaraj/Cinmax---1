import { useQuery } from '@tanstack/react-query';
import { useProductService, queryKeys, type CategoryEntity } from '@cinmax/api';

export function useCategoriesQuery() {
  const productService = useProductService();

  return useQuery<CategoryEntity[]>({
    queryKey: queryKeys.categories.list(),
    queryFn: () => productService.getCategories(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useFeaturedCategoriesQuery(limit?: number) {
  const productService = useProductService();

  return useQuery<CategoryEntity[]>({
    queryKey: [...queryKeys.categories.list(), 'featured', limit],
    queryFn: () => productService.getFeaturedCategories(limit),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCategoryBySlugQuery(slug: string, options?: { enabled?: boolean }) {
  const productService = useProductService();

  return useQuery<CategoryEntity>({
    queryKey: queryKeys.categories.detail(slug),
    queryFn: () => productService.getCategoryBySlug(slug),
    enabled: Boolean(slug) && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 10,
  });
}
