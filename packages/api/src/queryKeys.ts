import type { ProductFilter } from '@cinmax/types';

export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
    profile: (userId?: string) => [...queryKeys.auth.all, 'profile', userId] as const,
  },
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filter?: ProductFilter) => [...queryKeys.products.lists(), { filter }] as const,
    detail: (slugOrId: string) => [...queryKeys.products.all, 'detail', slugOrId] as const,
    featured: () => [...queryKeys.products.all, 'featured'] as const,
  },
  categories: {
    all: ['categories'] as const,
    list: () => [...queryKeys.categories.all, 'list'] as const,
    detail: (slug: string) => [...queryKeys.categories.all, 'detail', slug] as const,
  },
  orders: {
    all: ['orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    userOrders: (userId?: string) => [...queryKeys.orders.all, 'user', userId] as const,
    detail: (orderId: string) => [...queryKeys.orders.all, 'detail', orderId] as const,
    tracking: (trackingId: string) => [...queryKeys.orders.all, 'tracking', trackingId] as const,
  },
  customers: {
    all: ['customers'] as const,
    list: () => [...queryKeys.customers.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.customers.all, 'detail', id] as const,
  },
  wishlist: {
    all: ['wishlist'] as const,
    user: (userId?: string) => [...queryKeys.wishlist.all, 'user', userId] as const,
  },
  cart: {
    all: ['cart'] as const,
    active: (cartIdOrUserId?: string) => [...queryKeys.cart.all, 'active', cartIdOrUserId] as const,
  },
  payments: {
    all: ['payments'] as const,
    methods: () => [...queryKeys.payments.all, 'methods'] as const,
  },
  coupons: {
    all: ['coupons'] as const,
    list: () => [...queryKeys.coupons.all, 'list'] as const,
    validate: (code: string) => [...queryKeys.coupons.all, 'validate', code] as const,
  },
  reviews: {
    all: ['reviews'] as const,
    byProduct: (productId: string) => [...queryKeys.reviews.all, 'product', productId] as const,
    moderationQueue: () => [...queryKeys.reviews.all, 'moderation'] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    list: (userId?: string) => [...queryKeys.notifications.all, 'user', userId] as const,
    unreadCount: (userId?: string) => [...queryKeys.notifications.all, 'unread', userId] as const,
  },
  banners: {
    all: ['banners'] as const,
    list: (activeOnly?: boolean) => [...queryKeys.banners.all, 'list', { activeOnly }] as const,
  },
  blog: {
    all: ['blog'] as const,
    list: (filter?: any) => [...queryKeys.blog.all, 'list', { filter }] as const,
    detail: (slug: string) => [...queryKeys.blog.all, 'detail', slug] as const,
    featured: () => [...queryKeys.blog.all, 'featured'] as const,
  },
  settings: {
    all: ['settings'] as const,
    current: () => [...queryKeys.settings.all, 'current'] as const,
  },
  analytics: {
    all: ['analytics'] as const,
    summary: () => [...queryKeys.analytics.all, 'summary'] as const,
    salesChart: (timeframe?: string) => [...queryKeys.analytics.all, 'salesChart', timeframe] as const,
    topProducts: () => [...queryKeys.analytics.all, 'topProducts'] as const,
  },
  storage: {
    all: ['storage'] as const,
    bucket: (bucketName: string) => [...queryKeys.storage.all, 'bucket', bucketName] as const,
  },
  videos: {
    all: ['videos'] as const,
    list: (publishedOnly?: boolean) => [...queryKeys.videos.all, 'list', { publishedOnly }] as const,
    detail: (id: string) => [...queryKeys.videos.all, 'detail', id] as const,
    userPurchases: (userId?: string) => [...queryKeys.videos.all, 'purchases', userId] as const,
  },
  playlists: {
    all: ['playlists'] as const,
    list: (publishedOnly?: boolean) => [...queryKeys.playlists.all, 'list', { publishedOnly }] as const,
    byProduct: (productId: string) => [...queryKeys.playlists.all, 'product', productId] as const,
    detail: (id: string) => [...queryKeys.playlists.all, 'detail', id] as const,
    userPurchases: (userId?: string) => [...queryKeys.playlists.all, 'purchases', userId] as const,
    access: (userId?: string, playlistId?: string) => [...queryKeys.playlists.all, 'access', userId, playlistId] as const,
  },
};

