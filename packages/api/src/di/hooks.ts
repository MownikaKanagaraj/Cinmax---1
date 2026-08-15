import { useContainer } from './provider';
import type {
  ProductService,
  OrderService,
  CartService,
  WishlistService,
  CustomerService,
  PaymentService,
  CouponService,
  ReviewService,
  NotificationService,
  ContentService,
  AuthService,
  AdminService,
  OperationsService,
  HomeMarketingService,
} from '../services';
import type {
  IProductRepository,
  ICategoryRepository,
  IOrderRepository,
  ICartRepository,
  IWishlistRepository,
  ICustomerRepository,
  IPaymentRepository,
  ICouponRepository,
  IReviewRepository,
  INotificationRepository,
  IBannerRepository,
  IBlogRepository,
  ISettingsRepository,
  IAuthRepository,
} from '../modules';

// Service hooks
export function useProductService(): ProductService {
  return useContainer().products;
}

export function useOrderService(): OrderService {
  return useContainer().orders;
}

export function useCartService(): CartService {
  return useContainer().cart;
}

export function useWishlistService(): WishlistService {
  return useContainer().wishlist;
}

export function useCustomerService(): CustomerService {
  return useContainer().customer;
}

export function usePaymentService(): PaymentService {
  return useContainer().payments;
}

export function useCouponService(): CouponService {
  return useContainer().coupons;
}

export function useReviewService(): ReviewService {
  return useContainer().reviews;
}

export function useNotificationService(): NotificationService {
  return useContainer().notifications;
}

export function useContentService(): ContentService {
  return useContainer().content;
}

export function useAuthService(): AuthService {
  return useContainer().auth;
}

export function useAdminService(): AdminService {
  return useContainer().admin;
}

export function useOperationsService(): OperationsService {
  return useContainer().operations;
}

export function useHomeMarketingService(): HomeMarketingService {
  return useContainer().homeMarketing;
}

// Repository hooks (for direct low-level repository access)
export function useProductRepository(): IProductRepository {
  return useContainer().productRepo;
}

export function useCategoryRepository(): ICategoryRepository {
  return useContainer().categoryRepo;
}

export function useOrderRepository(): IOrderRepository {
  return useContainer().orderRepo;
}

export function useCartRepository(): ICartRepository {
  return useContainer().cartRepo;
}

export function useWishlistRepository(): IWishlistRepository {
  return useContainer().wishlistRepo;
}

export function useCustomerRepository(): ICustomerRepository {
  return useContainer().customerRepo;
}

export function usePaymentRepository(): IPaymentRepository {
  return useContainer().paymentRepo;
}

export function useCouponRepository(): ICouponRepository {
  return useContainer().couponRepo;
}

export function useReviewRepository(): IReviewRepository {
  return useContainer().reviewRepo;
}

export function useNotificationRepository(): INotificationRepository {
  return useContainer().notificationRepo;
}

export function useBannerRepository(): IBannerRepository {
  return useContainer().bannerRepo;
}

export function useBlogRepository(): IBlogRepository {
  return useContainer().blogRepo;
}

export function useSettingsRepository(): ISettingsRepository {
  return useContainer().settingsRepo;
}

export function useAuthRepository(): IAuthRepository {
  return useContainer().authRepo;
}
