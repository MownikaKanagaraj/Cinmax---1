import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useProductService,
  queryKeys,
  type ProductEntity,
  type PaginatedResult,
  type PaginationParams,
  type CreateProductPayload,
  type UpdateProductPayload,
} from '@cinmax/api';
import type { ProductFilter } from '@cinmax/types';

export function useProductsQuery(
  filter?: ProductFilter,
  pagination?: PaginationParams,
  options?: { enabled?: boolean }
) {
  const productService = useProductService();

  return useQuery<PaginatedResult<ProductEntity>>({
    queryKey: queryKeys.products.list(filter),
    queryFn: () => productService.getProducts(filter, pagination),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useInfiniteProductsQuery(
  filter?: ProductFilter,
  pageSize = 12
) {
  const productService = useProductService();

  return useInfiniteQuery({
    queryKey: [...queryKeys.products.lists(), 'infinite', filter],
    queryFn: ({ pageParam = 1 }) =>
      productService.getProducts(filter, { page: pageParam, pageSize }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductBySlugQuery(slug: string, options?: { enabled?: boolean }) {
  const productService = useProductService();

  return useQuery<ProductEntity>({
    queryKey: queryKeys.products.detail(slug),
    queryFn: () => productService.getProductBySlug(slug),
    enabled: Boolean(slug) && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductByIdQuery(id: string, options?: { enabled?: boolean }) {
  const productService = useProductService();

  return useQuery<ProductEntity>({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: Boolean(id) && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 5,
  });
}

export function useFeaturedProductsQuery(limit?: number) {
  const productService = useProductService();

  return useQuery<ProductEntity[]>({
    queryKey: queryKeys.products.featured(),
    queryFn: () => productService.getFeaturedProducts(limit),
    staleTime: 1000 * 60 * 5,
  });
}

export function useNewArrivalsProductsQuery(limit?: number) {
  const productService = useProductService();

  return useQuery<ProductEntity[]>({
    queryKey: [...queryKeys.products.lists(), 'new-arrivals', limit],
    queryFn: () => productService.getNewArrivals(limit),
    staleTime: 1000 * 60 * 5,
  });
}

export function useBestSellersProductsQuery(limit?: number) {
  const productService = useProductService();

  return useQuery<ProductEntity[]>({
    queryKey: [...queryKeys.products.lists(), 'best-sellers', limit],
    queryFn: () => productService.getBestSellers(limit),
    staleTime: 1000 * 60 * 5,
  });
}

export function useRelatedProductsQuery(productIdOrSlug: string, limit?: number) {
  const productService = useProductService();

  return useQuery<ProductEntity[]>({
    queryKey: [...queryKeys.products.lists(), 'related', productIdOrSlug, limit],
    queryFn: () => productService.getRelatedProducts(productIdOrSlug, limit),
    enabled: Boolean(productIdOrSlug),
    staleTime: 1000 * 60 * 5,
  });
}

export function useRecommendedProductsQuery(productIdOrSlug: string, limit?: number) {
  const productService = useProductService();

  return useQuery<ProductEntity[]>({
    queryKey: [...queryKeys.products.lists(), 'recommended', productIdOrSlug, limit],
    queryFn: () => productService.getRecommendedProducts(productIdOrSlug, limit),
    enabled: Boolean(productIdOrSlug),
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductsByCategoryQuery(categorySlug: string, pagination?: PaginationParams, options?: { enabled?: boolean }) {
  const productService = useProductService();

  return useQuery<PaginatedResult<ProductEntity>>({
    queryKey: [...queryKeys.products.lists(), 'category', categorySlug],
    queryFn: () => productService.getProductsByCategory(categorySlug, pagination),
    enabled: Boolean(categorySlug) && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSearchProductsQuery(query: string, options?: { enabled?: boolean }) {
  const productService = useProductService();

  return useQuery<ProductEntity[]>({
    queryKey: [...queryKeys.products.lists(), 'search', query],
    queryFn: async () => {
      const res = await productService.searchProducts(query);
      return res.items;
    },
    enabled: Boolean(query.trim()) && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Mutation to create a new product formulation
 */
export function useCreateProductMutation() {
  const queryClient = useQueryClient();
  const productService = useProductService();

  return useMutation({
    mutationFn: async (payload: CreateProductPayload) => {
      // Try local API route if available, otherwise direct service
      try {
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          const data = await response.json();
          return data.product;
        }
      } catch {
        // Direct service fallback
      }
      return productService.createProduct(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

/**
 * Mutation to update an existing product formulation
 */
export function useUpdateProductMutation() {
  const queryClient = useQueryClient();
  const productService = useProductService();

  return useMutation({
    mutationFn: async (payload: UpdateProductPayload) => {
      try {
        const response = await fetch(`/api/products/${payload.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          const data = await response.json();
          return data.product;
        }
      } catch {
        // Direct service fallback
      }
      return productService.updateProduct(payload.id, payload);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(variables.id) });
    },
  });
}

/**
 * Mutation to delete a product
 */
export function useDeleteProductMutation() {
  const queryClient = useQueryClient();
  const productService = useProductService();

  return useMutation({
    mutationFn: async (productId: string) => {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          return true;
        }
      } catch {
        // Direct service fallback
      }
      await productService.deleteProduct(productId);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}
