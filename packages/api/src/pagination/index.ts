/**
 * Generic Pagination & Sorting Models for CINMAX Global Products
 */

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface CursorPaginationParams {
  cursor?: string;
  limit?: number;
  direction?: 'forward' | 'backward';
}

export interface CursorPaginationMeta {
  nextCursor?: string | null;
  prevCursor?: string | null;
  hasMore: boolean;
  limit: number;
}

export interface CursorPaginatedResult<T> {
  items: T[];
  meta: CursorPaginationMeta;
}

export type SortDirection = 'asc' | 'desc';

export interface SortOption<T = string> {
  field: T;
  direction: SortDirection;
}

export interface FilterOperator<T = any> {
  eq?: T;
  neq?: T;
  gt?: T;
  gte?: T;
  lt?: T;
  lte?: T;
  in?: T[];
  contains?: string;
  between?: [T, T];
}

/**
 * Utility to slice an in-memory array into a PaginatedResult
 */
export function paginateArray<T>(
  items: T[],
  params?: PaginationParams
): PaginatedResult<T> {
  const page = Math.max(1, params?.page || 1);
  const pageSize = params?.pageSize !== undefined
    ? Math.max(1, Math.min(100, params.pageSize))
    : (params?.page ? 12 : Math.max(100, items.length));
  const totalCount = items.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIndex = (page - 1) * pageSize;
  const paginatedItems = items.slice(startIndex, startIndex + pageSize);

  return {
    items: paginatedItems,
    meta: {
      page,
      pageSize,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

/**
 * Utility to create CursorPaginatedResult from an array
 */
export function paginateWithCursor<T extends { id: string }>(
  items: T[],
  params?: CursorPaginationParams
): CursorPaginatedResult<T> {
  const limit = Math.max(1, Math.min(100, params?.limit || 12));
  const cursor = params?.cursor;

  let startIndex = 0;
  if (cursor) {
    const foundIndex = items.findIndex((item) => item.id === cursor);
    if (foundIndex !== -1) {
      startIndex = foundIndex + 1;
    }
  }

  const sliced = items.slice(startIndex, startIndex + limit + 1);
  const hasMore = sliced.length > limit;
  const resultItems = hasMore ? sliced.slice(0, limit) : sliced;
  const nextCursor = hasMore && resultItems.length > 0 ? resultItems[resultItems.length - 1]?.id : null;

  return {
    items: resultItems,
    meta: {
      nextCursor,
      prevCursor: cursor || null,
      hasMore,
      limit,
    },
  };
}
