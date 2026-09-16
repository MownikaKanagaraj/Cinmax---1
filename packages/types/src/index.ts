// ==============================================================================
// CINMAX Global Products - Domain Models, Types & API Contracts
// ==============================================================================

export * from './database.types';
export * from './domain';


// ------------------------------------------------------------------------------
// 1. RBAC Roles & Permissions
// ------------------------------------------------------------------------------
export type UserRole =
  | 'customer'
  | 'admin'
  | 'super_admin'
  | 'manager'
  | 'support'
  | 'content_editor'
  | 'inventory_manager'
  | 'support_executive';

export type Permission =
  | 'products:read'
  | 'products:create'
  | 'products:update'
  | 'products:delete'
  | 'categories:manage'
  | 'orders:read'
  | 'orders:update'
  | 'orders:cancel'
  | 'orders:refund'
  | 'inventory:read'
  | 'inventory:update'
  | 'customers:read'
  | 'customers:manage'
  | 'reviews:read'
  | 'reviews:moderate'
  | 'coupons:manage'
  | 'banners:manage'
  | 'cms:manage'
  | 'analytics:view'
  | 'notifications:send'
  | 'settings:manage'
  | 'roles:manage';

export interface RoleDefinition {
  role: UserRole;
  label: string;
  description: string;
  permissions: Permission[];
}

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';

// ------------------------------------------------------------------------------
// 2. Product Models
// ------------------------------------------------------------------------------
export type SoapProcessType =
  | 'cold-process'
  | 'triple-milled'
  | 'melt-and-pour'
  | 'liquid-botanical'
  | 'whipped-butter';

export type FragranceFamily =
  | 'unscented'
  | 'citrus'
  | 'woody'
  | 'floral'
  | 'herbal'
  | 'earthy'
  | 'aquatic'
  | 'spicy';

export type SkinType =
  | 'all'
  | 'dry'
  | 'oily'
  | 'sensitive'
  | 'combination'
  | 'mature'
  | 'normal';

export interface ProductIngredient {
  id: string;
  name: string;
  inciName?: string;
  purpose?: string;
  isOrganic: boolean;
  isKeyBotanical: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  title: string;
  weightGrams?: number;
  volumeMl?: number;
  price: number;
  compareAtPrice?: number | null;
  inventoryQuantity: number;
  lowStockThreshold: number;
  isAvailable: boolean;
  options: Record<string, string>;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  imageUrl?: string;
  parentId?: string | null;
  sortOrder: number;
  isActive: boolean;
  productCount?: number;
}

export type Category = ProductCategory;

export interface Product {
  id: string;
  slug: string;
  title: string;
  brand?: string;
  subtitle?: string;
  description: string;
  howToUse?: string;
  processType: SoapProcessType;
  categoryId: string;
  category?: ProductCategory;
  basePrice: number;
  compareAtPrice?: number | null;
  currency: string;
  images: ProductImage[];
  variants: ProductVariant[];
  ingredients: ProductIngredient[];
  skinTypes: SkinType[];
  fragranceFamily: FragranceFamily;
  certifications: string[];
  trustBadges?: string[];
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller?: boolean;
  isActive?: boolean;
  averageRating: number;
  reviewCount: number;
  ratingAverage?: number;
  ratingCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilter {
  categorySlug?: string;
  categoryId?: string;
  processType?: SoapProcessType;
  fragranceFamily?: FragranceFamily;
  skinType?: SkinType | string;
  minPrice?: number;
  maxPrice?: number;
  certifications?: string[];
  inStockOnly?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  sortBy?: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popularity' | 'best-seller';
  searchQuery?: string;
  search?: string;
}

// ------------------------------------------------------------------------------
// 3. User & Customer Profile
// ------------------------------------------------------------------------------
export interface Address {
  id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email?: string;
  company?: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

export interface CustomerProfile {
  id: string;
  authId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  loyaltyTier: LoyaltyTier;
  loyaltyPoints: number;
  savedAddresses: Address[];
  wishlistProductIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ------------------------------------------------------------------------------
// 4. Cart & Checkout
// ------------------------------------------------------------------------------
export type DiscountType = 'percentage' | 'fixed_amount' | 'free_shipping';

export interface CartDiscount {
  code: string;
  amount: number;
  discountType?: DiscountType;
  description?: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId?: string;
  product: Pick<Product, 'id' | 'title' | 'slug' | 'images' | 'processType'>;
  variant: Pick<ProductVariant, 'id' | 'sku' | 'title' | 'price' | 'weightGrams' | 'volumeMl' | 'options'>;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface AppliedCoupon {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  description?: string;
}

export interface Cart {
  id: string;
  userId?: string | null;
  anonymousId?: string | null;
  items: CartItem[];
  appliedDiscount?: AppliedCoupon | null;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  shippingTotal: number;
  grandTotal: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

export interface Wishlist {
  id: string;
  userId?: string | null;
  productIds: string[];
  products?: Product[];
  items?: Product[];
  createdAt: string;
  updatedAt: string;
}

// ------------------------------------------------------------------------------
// 5. Orders & Fulfillment
// ------------------------------------------------------------------------------
export type OrderStatus =
  | 'pending'
  | 'payment_pending'
  | 'paid'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export type PaymentStatus =
  | 'unpaid'
  | 'authorized'
  | 'paid'
  | 'failed'
  | 'refunded';

export type PaymentMethod = 'razorpay' | 'stripe' | 'phonepe' | 'cod' | 'apple_pay' | 'google_pay' | 'paypal' | 'upi' | 'card';

export interface DeliveryDetails {
  state: string;
  totalProducts: number;
  charge: number;
  isFree: boolean;
}

export interface SavedPaymentMethod {
  id: string;
  customerId: string;
  type: PaymentMethod;
  isDefault: boolean;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  brand?: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  variantId?: string;
  productTitle: string;
  variantTitle: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  imageUrl?: string;
}

export interface OrderTimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: OrderStatus;
  location?: string;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  guestEmail?: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentIntentId?: string;
  paymentTransactionId?: string;
  subtotal: number;
  itemsSubtotal?: number;
  discountTotal: number;
  discountAmount?: number;
  taxTotal: number;
  taxAmount?: number;
  shippingTotal: number;
  shippingAmount?: number;
  grandTotal: number;
  currency: string;
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
  delivery?: DeliveryDetails;
  trackingNumber?: string;
  carrier?: string;
  courierName?: string;
  estimatedDeliveryDate?: string;
  timeline?: OrderTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

// ------------------------------------------------------------------------------
// 6. Reviews & Ratings
// ------------------------------------------------------------------------------
export interface ProductReview {
  id: string;
  productId: string;
  userId?: string;
  authorName: string;
  rating: number;
  title: string;
  content: string;
  scentRating?: number;
  latherRating?: number;
  moistureRating?: number;
  isVerifiedPurchaser: boolean;
  isApproved?: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

// ------------------------------------------------------------------------------
// 7. Subscriptions & Recurring Deliveries
// ------------------------------------------------------------------------------
export type SubscriptionInterval = '30_days' | '45_days' | '60_days' | '90_days';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'past_due';

export interface Subscription {
  id: string;
  userId: string;
  productId: string;
  productTitle: string;
  variantId: string;
  variantTitle: string;
  status: SubscriptionStatus;
  interval: SubscriptionInterval;
  quantity: number;
  unitPrice: number;
  nextBillingDate: string;
  createdAt: string;
  updatedAt: string;
}

// ------------------------------------------------------------------------------
// 8. Coupons, Banners & CMS
// ------------------------------------------------------------------------------
export interface Coupon {
  id: string;
  code: string;
  title: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  mobileImageUrl?: string;
  badgeText?: string;
  backgroundColor?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  authorName: string;
  authorAvatarUrl?: string;
  category: string;
  readingTimeMinutes: number;
  publishedAt: string;
  isPublished: boolean;
  tags: string[];
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

// ------------------------------------------------------------------------------
// 9. Notifications
// ------------------------------------------------------------------------------
export type NotificationType =
  | 'order_update'
  | 'promotion'
  | 'restock'
  | 'system'
  | 'review_request';

export interface AppNotification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

// ------------------------------------------------------------------------------
// 10. Analytics & Admin Metrics
// ------------------------------------------------------------------------------
export interface SalesMetricSummary {
  totalRevenue: number;
  revenueChangePercentage: number;
  totalOrders: number;
  ordersChangePercentage: number;
  averageOrderValue: number;
  aovChangePercentage: number;
  activeCustomers: number;
  customersChangePercentage: number;
}

export interface SalesChartDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProductMetric {
  productId: string;
  productTitle: string;
  unitsSold: number;
  revenue: number;
  stockRemaining: number;
}

// ------------------------------------------------------------------------------
// 11. Storage & Uploads
// ------------------------------------------------------------------------------
export type StorageBucket =
  | 'products'
  | 'categories'
  | 'banners'
  | 'blogs'
  | 'product-images'
  | 'category-images'
  | 'profile-avatars'
  | 'banner-assets'
  | 'review-attachments'
  | 'blog-media';

export interface UploadFilePayload {
  file: File | Blob;
  bucket: StorageBucket;
  path?: string;
  fileName?: string;
}

export interface UploadFileResult {
  url: string;
  path: string;
  bucket: StorageBucket;
}
