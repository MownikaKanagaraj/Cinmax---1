export interface APIResponse<T = unknown> {
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: unknown;
  } | null;
  status: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export type SortOrder = 'asc' | 'desc';
