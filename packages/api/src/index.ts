export * from './client/browser';
export * from './client/server';
export * from './client/mobile';

// Domain Modules
export * from './modules';

// Domain Services
export * from './services';

// Business Rule Engines
export * from './engines';

// Payment Providers
export * from './payments';

// Shipping Providers
export * from './shipping';

// Multi-Channel Notifications
export * from './notifications';

// Domain Event Bus
export * from './events';

// Background Jobs
export * from './jobs';

// Monitoring & Logging
export * from './monitoring';

// DI Container, Context Provider & React Hooks
export * from './di';

// Infrastructure Utilities
export * from './errors';
export * from './pagination';
export * from './cache';
export * from './search';
export * from './mockData';

// React Query & Cache Architecture
export * from './queryKeys';
export * from './queryClient';
export * from './offline';

// Modular Domain API Namespaces (for namespace-based imports)
export * as AuthApi from './modules/auth';
export * as ProductsApi from './modules/products';
export * as CategoriesApi from './modules/categories';
export * as OrdersApi from './modules/orders';
export * as CustomersApi from './modules/customers';
export * as WishlistApi from './modules/wishlist';
export * as CartApi from './modules/cart';
export * as PaymentsApi from './modules/payments';
export * as CouponsApi from './modules/coupons';
export * as ReviewsApi from './modules/reviews';
export * as NotificationsApi from './modules/notifications';
export * as BannersApi from './modules/banners';
export * as BlogApi from './modules/blog';
export * as SettingsApi from './modules/settings';
export * as AnalyticsApi from './modules/analytics';
export * as StorageApi from './modules/storage';
