/**
 * Multi-Tier Caching Infrastructure & Cache Key Strategy for CINMAX Global Products
 */

export interface CacheEntry<T> {
  value: T;
  expiresAt: number | null;
  createdAt: number;
}

export interface ICacheStore {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T, ttlMs?: number): void;
  delete(key: string): boolean;
  clear(): void;
  has(key: string): boolean;
  keys(): string[];
}

export class MemoryCache implements ICacheStore {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL: number;
  private maxEntries: number;

  constructor(options: { defaultTTLMs?: number; maxEntries?: number } = {}) {
    this.defaultTTL = options.defaultTTLMs || 5 * 60 * 1000; // 5 minutes default
    this.maxEntries = options.maxEntries || 500;
  }

  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  public set<T>(key: string, value: T, ttlMs?: number): void {
    if (this.cache.size >= this.maxEntries) {
      // Evict oldest entry (first key in map iteration)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }

    const effectiveTTL = ttlMs !== undefined ? ttlMs : this.defaultTTL;
    const expiresAt = effectiveTTL > 0 ? Date.now() + effectiveTTL : null;

    this.cache.set(key, {
      value,
      expiresAt,
      createdAt: Date.now(),
    });
  }

  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }

  public has(key: string): boolean {
    return this.get(key) !== null;
  }

  public keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Invalidate all keys matching a prefix or regex pattern
   */
  public invalidatePattern(pattern: string | RegExp): number {
    let count = 0;
    const regex = typeof pattern === 'string' ? new RegExp(`^${pattern}`) : pattern;

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }
}

// Global Memory Cache Singleton
export const globalMemoryCache = new MemoryCache();

/**
 * Standardized Query and Cache Key Factory
 */
export const CacheKeys = {
  products: {
    all: ['products'] as const,
    lists: () => [...CacheKeys.products.all, 'list'] as const,
    list: (filters: Record<string, any> = {}) => [...CacheKeys.products.lists(), filters] as const,
    details: () => [...CacheKeys.products.all, 'detail'] as const,
    detail: (idOrSlug: string) => [...CacheKeys.products.details(), idOrSlug] as const,
    featured: () => [...CacheKeys.products.all, 'featured'] as const,
    search: (query: string, filters?: Record<string, any>) => [...CacheKeys.products.all, 'search', query, filters] as const,
  },
  categories: {
    all: ['categories'] as const,
    list: () => [...CacheKeys.categories.all, 'list'] as const,
    detail: (slug: string) => [...CacheKeys.categories.all, 'detail', slug] as const,
  },
  orders: {
    all: ['orders'] as const,
    lists: () => [...CacheKeys.orders.all, 'list'] as const,
    list: (filters: Record<string, any> = {}) => [...CacheKeys.orders.lists(), filters] as const,
    byUser: (userId: string) => [...CacheKeys.orders.all, 'user', userId] as const,
    detail: (id: string) => [...CacheKeys.orders.all, 'detail', id] as const,
  },
  cart: {
    all: ['cart'] as const,
    current: (userIdOrAnon?: string | null) => [...CacheKeys.cart.all, userIdOrAnon || 'anonymous'] as const,
  },
  wishlist: {
    all: ['wishlist'] as const,
    byUser: (userId?: string | null) => [...CacheKeys.wishlist.all, userId || 'guest'] as const,
  },
  customers: {
    all: ['customers'] as const,
    profile: (userId: string) => [...CacheKeys.customers.all, 'profile', userId] as const,
    list: (filters: Record<string, any> = {}) => [...CacheKeys.customers.all, 'list', filters] as const,
  },
  coupons: {
    all: ['coupons'] as const,
    list: () => [...CacheKeys.coupons.all, 'list'] as const,
    validate: (code: string) => [...CacheKeys.coupons.all, 'validate', code] as const,
  },
  reviews: {
    all: ['reviews'] as const,
    byProduct: (productId: string) => [...CacheKeys.reviews.all, 'product', productId] as const,
    recent: (limit: number = 10) => [...CacheKeys.reviews.all, 'recent', limit] as const,
    list: (filters: Record<string, any> = {}) => [...CacheKeys.reviews.all, 'list', filters] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    byUser: (userId?: string | null) => [...CacheKeys.notifications.all, userId || 'broadcast'] as const,
  },
  banners: {
    all: ['banners'] as const,
    active: () => [...CacheKeys.banners.all, 'active'] as const,
  },
  blogs: {
    all: ['blogs'] as const,
    list: (filters: Record<string, any> = {}) => [...CacheKeys.blogs.all, 'list', filters] as const,
    detail: (slug: string) => [...CacheKeys.blogs.all, 'detail', slug] as const,
  },
  settings: {
    all: ['settings'] as const,
    app: () => [...CacheKeys.settings.all, 'app'] as const,
  },
  auth: {
    session: ['auth', 'session'] as const,
    currentUser: ['auth', 'currentUser'] as const,
  },
} as const;
