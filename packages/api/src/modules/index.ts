// ===================================================================
// Domain Module Barrel Exports — CINMAX Global Products
// Each module exports its own types, entities, repos, and use cases.
// Errors and shared types come from ../../errors and ../../pagination.
// ===================================================================

// Auth Module
export type { LoginPayload, RegisterPayload, VerifyOTPPayload, OAuthLoginOptions, AuthSession } from './auth/types';
export { AuthSessionEntity, UserEntity } from './auth/entity';
export type { AuthSessionDTO } from './auth/dto';
export { AuthMapper } from './auth/mapper';
export type { IAuthRepository } from './auth/repository.interface';
export { MockAuthRepository } from './auth/mock.repository';
export { SupabaseAuthRepository } from './auth/supabase.repository';
export { LoginUseCase, RegisterUseCase, LogoutUseCase, GetCurrentSessionUseCase } from './auth/useCases';
export { LoginSchema, RegisterSchema } from './auth/validation';

// Product Module
export { ProductEntity } from './products/entity';
export type { ProductDTO } from './products/dto';
export { ProductMapper } from './products/mapper';
export type { IProductRepository, ProductFilter as ProductRepoFilter } from './products/repository.interface';
export { MockProductRepository } from './products/mock.repository';
export { SupabaseProductRepository } from './products/supabase.repository';
export {
  GetProductsUseCase,
  GetProductByIdUseCase,
  GetProductBySlugUseCase,
  GetFeaturedProductsUseCase,
  GetProductsByCategoryUseCase,
  SearchProductsUseCase,
} from './products/useCases';

// Category Module
export { CategoryEntity } from './categories/entity';
export type { CategoryDTO } from './categories/dto';
export { CategoryMapper } from './categories/mapper';
export type { ICategoryRepository } from './categories/repository.interface';
export { MockCategoryRepository } from './categories/mock.repository';
export { SupabaseCategoryRepository } from './categories/supabase.repository';
export { GetCategoriesUseCase, GetCategoryBySlugUseCase } from './categories/useCases';

// Order Module
export { OrderEntity } from './orders/entity';
export type { OrderDTO } from './orders/dto';
export { OrderMapper } from './orders/mapper';
export type { IOrderRepository, OrderFilter } from './orders/repository.interface';
export { MockOrderRepository } from './orders/mock.repository';
export { SupabaseOrderRepository } from './orders/supabase.repository';
export {
  GetOrdersUseCase,
  GetOrderByIdUseCase,
  CreateOrderUseCase,
  CancelOrderUseCase,
} from './orders/useCases';

// Cart Module
export { CartEntity } from './cart/entity';
export type { CartDTO } from './cart/dto';
export { CartMapper } from './cart/mapper';
export type { ICartRepository } from './cart/repository.interface';
export { MockCartRepository } from './cart/mock.repository';
export { SupabaseCartRepository } from './cart/supabase.repository';

export {
  GetCartUseCase,
  AddItemToCartUseCase,
  UpdateCartItemQuantityUseCase,
  RemoveCartItemUseCase,
  ApplyCouponToCartUseCase,
  RemoveCouponFromCartUseCase,
  ClearCartUseCase,
} from './cart/useCases';


// Wishlist Module
export { WishlistEntity } from './wishlist/entity';
export type { WishlistDTO } from './wishlist/dto';
export { WishlistMapper } from './wishlist/mapper';
export type { IWishlistRepository } from './wishlist/repository.interface';
export { MockWishlistRepository } from './wishlist/mock.repository';
export { SupabaseWishlistRepository } from './wishlist/supabase.repository';
export {
  GetWishlistUseCase,
  ToggleWishlistItemUseCase,
  IsInWishlistUseCase,
  ClearWishlistUseCase,
} from './wishlist/useCases';


// Customer Module
export { CustomerEntity } from './customers/entity';
export type { CustomerDTO } from './customers/dto';
export { CustomerMapper } from './customers/mapper';
export type { ICustomerRepository, NotificationSettingsData, CustomerPreferencesData } from './customers/repository.interface';
export { MockCustomerRepository } from './customers/mock.repository';
export { SupabaseCustomerRepository } from './customers/supabase.repository';
export {
  GetCustomerProfileUseCase,
  UpdateCustomerProfileUseCase,
  AddCustomerAddressUseCase,
  UpdateCustomerAddressUseCase,
  DeleteCustomerAddressUseCase,
  SetDefaultCustomerAddressUseCase,
} from './customers/useCases';

// Payment Module
export { PaymentTransactionEntity } from './payments/entity';
export type { PaymentTransactionDTO, CreatePaymentIntentPayload, ConfirmPaymentPayload } from './payments/dto';
export { PaymentTransactionMapper } from './payments/mapper';
export type { IPaymentRepository } from './payments/repository.interface';
export { MockPaymentRepository } from './payments/mock.repository';
export { SupabasePaymentRepository } from './payments/supabase.repository';
export {
  CreatePaymentIntentUseCase,
  ConfirmPaymentUseCase,
  GetSavedPaymentMethodsUseCase,
  AddSavedPaymentMethodUseCase,
  DeleteSavedPaymentMethodUseCase,
} from './payments/useCases';

// Coupon Module
export { CouponEntity } from './coupons/entity';
export type { CouponDTO } from './coupons/dto';
export { CouponMapper } from './coupons/mapper';
export type { ICouponRepository } from './coupons/repository.interface';
export { MockCouponRepository } from './coupons/mock.repository';
export { SupabaseCouponRepository } from './coupons/supabase.repository';
export { GetCouponsUseCase, ValidateCouponUseCase } from './coupons/useCases';


// Review Module
export { ReviewEntity } from './reviews/entity';
export type { ReviewDTO } from './reviews/dto';
export { ReviewMapper } from './reviews/mapper';
export type { IReviewRepository } from './reviews/repository.interface';
export { MockReviewRepository } from './reviews/mock.repository';
export { SupabaseReviewRepository } from './reviews/supabase.repository';
export { GetProductReviewsUseCase, SubmitReviewUseCase } from './reviews/useCases';

// Notification Module
export { NotificationEntity } from './notifications/entity';
export type { NotificationDTO } from './notifications/dto';
export { NotificationMapper } from './notifications/mapper';
export type { INotificationRepository } from './notifications/repository.interface';
export { MockNotificationRepository } from './notifications/mock.repository';
export { SupabaseNotificationRepository } from './notifications/supabase.repository';
export {
  GetNotificationsUseCase,
  GetUnreadNotificationsCountUseCase,
  MarkNotificationAsReadUseCase,
  MarkAllNotificationsAsReadUseCase,
} from './notifications/useCases';

// Banner Module
export { BannerEntity } from './banners/entity';
export type { BannerDTO } from './banners/dto';
export { BannerMapper } from './banners/mapper';
export type { IBannerRepository } from './banners/repository.interface';
export { MockBannerRepository } from './banners/mock.repository';
export { SupabaseBannerRepository } from './banners/supabase.repository';
export { GetBannersUseCase } from './banners/useCases';

// Blog Module
export { BlogPostEntity } from './blog/entity';
export type { BlogPostDTO } from './blog/dto';
export { BlogPostMapper } from './blog/mapper';
export type { IBlogRepository, BlogFilter } from './blog/repository.interface';
export { MockBlogRepository } from './blog/mock.repository';
export { SupabaseBlogRepository } from './blog/supabase.repository';
export {
  GetBlogPostsUseCase,
  GetBlogPostBySlugUseCase,
  GetFeaturedBlogPostsUseCase,
} from './blog/useCases';


// Settings Module
export { AppSettingsEntity } from './settings/entity';
export type { AppSettingsDTO } from './settings/dto';
export { AppSettingsMapper } from './settings/mapper';
export type { ISettingsRepository } from './settings/repository.interface';
export { MockSettingsRepository } from './settings/mock.repository';
export { SupabaseSettingsRepository } from './settings/supabase.repository';
export { GetSettingsUseCase, UpdateSettingsUseCase } from './settings/useCases';

export * from './marketing';
