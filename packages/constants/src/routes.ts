/**
 * Route Constants for Storefront Website, Admin Dashboard, and Expo Mobile App
 */

export const STOREFRONT_ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  COLLECTIONS: '/collections',
  CATEGORY: (slug: string) => `/category/${slug}`,
  PRODUCT: (slug: string) => `/product/${slug}`,
  ABOUT: '/about',
  INGREDIENTS: '/ingredients',
  CART: '/cart',
  CHECKOUT: '/checkout',
  CHECKOUT_SUCCESS: '/checkout/success',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  ACCOUNT: {
    DASHBOARD: '/account',
    ORDERS: '/account/orders',
    ORDER_DETAIL: (orderId: string) => `/account/orders/${orderId}`,
    SUBSCRIPTION: '/account/subscription',
    ADDRESSES: '/account/addresses',
    WISHLIST: '/account/wishlist',
    SKIN_PROFILE: '/account/skin-profile',
  },
  LEGAL: {
    PRIVACY: '/privacy',
    TERMS: '/terms',
    SHIPPING_RETURNS: '/shipping-and-returns',
  },
} as const;

export const ADMIN_ROUTES = {
  DASHBOARD: '/',
  PRODUCTS: {
    LIST: '/products',
    CREATE: '/products/new',
    EDIT: (id: string) => `/products/${id}`,
    INVENTORY: '/products/inventory',
  },
  CATEGORIES: {
    LIST: '/categories',
    CREATE: '/categories/new',
  },
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
  },
  CUSTOMERS: {
    LIST: '/customers',
    DETAIL: (id: string) => `/customers/${id}`,
  },
  SUBSCRIPTIONS: {
    LIST: '/subscriptions',
  },
  REVIEWS: {
    LIST: '/reviews',
  },
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
  AUTH: {
    LOGIN: '/login',
  },
} as const;

export const MOBILE_ROUTES = {
  TABS: {
    SHOP: '/(tabs)/',
    CATEGORIES: '/(tabs)/categories',
    BAG: '/(tabs)/bag',
    WISHLIST: '/(tabs)/wishlist',
    PROFILE: '/(tabs)/profile',
  },
  PRODUCT_DETAIL: (slug: string) => `/product/${slug}`,
  CHECKOUT: '/checkout',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  ACCOUNT: {
    ORDERS: '/profile/orders',
    ORDER_DETAIL: (id: string) => `/profile/orders/${id}`,
    SKIN_QUIZ: '/profile/skin-quiz',
    ADDRESSES: '/profile/addresses',
    SUBSCRIPTION: '/profile/subscription',
  },
} as const;
