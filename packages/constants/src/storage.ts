/**
 * LocalStorage & Supabase Storage Keys
 */

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'cinmax_auth_token',
  AUTH_USER: 'cinmax_auth_user',
  CART_ID: 'cinmax_cart_id',
  GUEST_CART: 'cinmax_guest_cart',
  WISHLIST: 'cinmax_wishlist',
  RECENTLY_VIEWED: 'cinmax_recently_viewed',
  THEME_MODE: 'cinmax_theme_mode',
  CURRENCY: 'cinmax_preferred_currency',
  COOKIE_CONSENT: 'cinmax_cookie_consent',
} as const;

export const SUPABASE_BUCKETS = {
  PRODUCT_IMAGES: 'product-images',
  BRAND_ASSETS: 'brand-assets',
  CATEGORY_COVERS: 'category-covers',
  USER_AVATARS: 'user-avatars',
  REVIEW_ATTACHMENTS: 'review-attachments',
} as const;
