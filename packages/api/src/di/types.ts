import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@cinmax/types';
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
  IVideoRepository,
  IPlaylistRepository,
} from '../modules';
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

export interface ContainerConfig {
  useMockData?: boolean;
  supabaseClient?: SupabaseClient<Database>;
}

export interface IContainer {
  readonly useMockData: boolean;

  // Repositories
  readonly productRepo: IProductRepository;
  readonly categoryRepo: ICategoryRepository;
  readonly orderRepo: IOrderRepository;
  readonly cartRepo: ICartRepository;
  readonly wishlistRepo: IWishlistRepository;
  readonly customerRepo: ICustomerRepository;
  readonly paymentRepo: IPaymentRepository;
  readonly couponRepo: ICouponRepository;
  readonly reviewRepo: IReviewRepository;
  readonly notificationRepo: INotificationRepository;
  readonly bannerRepo: IBannerRepository;
  readonly blogRepo: IBlogRepository;
  readonly settingsRepo: ISettingsRepository;
  readonly authRepo: IAuthRepository;
  readonly videoRepo: IVideoRepository;
  readonly playlistRepo: IPlaylistRepository;

  // Services
  readonly products: ProductService;
  readonly orders: OrderService;
  readonly cart: CartService;
  readonly wishlist: WishlistService;
  readonly customer: CustomerService;
  readonly payments: PaymentService;
  readonly coupons: CouponService;
  readonly reviews: ReviewService;
  readonly notifications: NotificationService;
  readonly content: ContentService;
  readonly auth: AuthService;
  readonly admin: AdminService;
  readonly operations: OperationsService;
  readonly homeMarketing: HomeMarketingService;
}
