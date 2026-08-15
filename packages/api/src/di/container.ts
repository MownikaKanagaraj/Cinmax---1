import { createClient } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '../client/browser';
import {
  MockProductRepository,
  SupabaseProductRepository,
  MockCategoryRepository,
  SupabaseCategoryRepository,
  MockOrderRepository,
  SupabaseOrderRepository,
  MockCartRepository,
  SupabaseCartRepository,
  MockWishlistRepository,
  SupabaseWishlistRepository,
  MockCustomerRepository,
  SupabaseCustomerRepository,
  MockPaymentRepository,
  SupabasePaymentRepository,
  MockCouponRepository,
  SupabaseCouponRepository,
  MockReviewRepository,
  SupabaseReviewRepository,
  MockNotificationRepository,
  SupabaseNotificationRepository,
  MockBannerRepository,
  SupabaseBannerRepository,
  MockBlogRepository,
  SupabaseBlogRepository,
  MockSettingsRepository,
  SupabaseSettingsRepository,
  MockAuthRepository,
  SupabaseAuthRepository,
  type IProductRepository,
  type ICategoryRepository,
  type IOrderRepository,
  type ICartRepository,
  type IWishlistRepository,
  type ICustomerRepository,
  type IPaymentRepository,
  type ICouponRepository,
  type IReviewRepository,
  type INotificationRepository,
  type IBannerRepository,
  type IBlogRepository,
  type ISettingsRepository,
  type IAuthRepository,
} from '../modules';
import {
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
} from '../services';
import type { ContainerConfig, IContainer } from './types';

export class Container implements IContainer {
  public readonly useMockData: boolean;

  // Repositories
  public readonly productRepo: IProductRepository;
  public readonly categoryRepo: ICategoryRepository;
  public readonly orderRepo: IOrderRepository;
  public readonly cartRepo: ICartRepository;
  public readonly wishlistRepo: IWishlistRepository;
  public readonly customerRepo: ICustomerRepository;
  public readonly paymentRepo: IPaymentRepository;
  public readonly couponRepo: ICouponRepository;
  public readonly reviewRepo: IReviewRepository;
  public readonly notificationRepo: INotificationRepository;
  public readonly bannerRepo: IBannerRepository;
  public readonly blogRepo: IBlogRepository;
  public readonly settingsRepo: ISettingsRepository;
  public readonly authRepo: IAuthRepository;

  // Services
  public readonly products: ProductService;
  public readonly orders: OrderService;
  public readonly cart: CartService;
  public readonly wishlist: WishlistService;
  public readonly customer: CustomerService;
  public readonly payments: PaymentService;
  public readonly coupons: CouponService;
  public readonly reviews: ReviewService;
  public readonly notifications: NotificationService;
  public readonly content: ContentService;
  public readonly auth: AuthService;
  public readonly admin: AdminService;
  public readonly operations: OperationsService;

  constructor(config: ContainerConfig = {}) {
    // Determine whether to use mock data
    const envUseMock =
      typeof process !== 'undefined' &&
      (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' ||
        process.env.EXPO_PUBLIC_USE_MOCK_DATA === 'true' ||
        process.env.USE_MOCK_DATA === 'true')
        ? true
        : false;

    this.useMockData = config.useMockData ?? envUseMock;

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.EXPO_PUBLIC_SUPABASE_URL ||
      'https://nthyavlzdgucrldtgjeo.supabase.co';
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
      '';

    const supabase =
      config.supabaseClient ||
      (typeof window !== 'undefined'
        ? (getSupabaseBrowserClient() as any)
        : (createClient(supabaseUrl, supabaseKey) as any));

    if (this.useMockData || !supabase) {
      this.productRepo = new MockProductRepository();
      this.categoryRepo = new MockCategoryRepository();
      this.orderRepo = new MockOrderRepository();
      this.cartRepo = new MockCartRepository();
      this.wishlistRepo = new MockWishlistRepository();
      this.customerRepo = new MockCustomerRepository();
      this.paymentRepo = new MockPaymentRepository();
      this.couponRepo = new MockCouponRepository();
      this.reviewRepo = new MockReviewRepository();
      this.notificationRepo = new MockNotificationRepository();
      this.bannerRepo = new MockBannerRepository();
      this.blogRepo = new MockBlogRepository();
      this.settingsRepo = new MockSettingsRepository();
      this.authRepo = new MockAuthRepository();
    } else {
      this.productRepo = new SupabaseProductRepository(supabase);
      this.categoryRepo = new SupabaseCategoryRepository(supabase);
      this.orderRepo = new SupabaseOrderRepository(supabase);
      this.cartRepo = new SupabaseCartRepository(supabase);
      this.wishlistRepo = new SupabaseWishlistRepository(supabase);
      this.customerRepo = new SupabaseCustomerRepository(supabase);
      this.paymentRepo = new SupabasePaymentRepository(supabase);
      this.couponRepo = new SupabaseCouponRepository(supabase);
      this.reviewRepo = new SupabaseReviewRepository(supabase);
      this.notificationRepo = new SupabaseNotificationRepository(supabase);
      this.bannerRepo = new SupabaseBannerRepository(supabase);
      this.blogRepo = new SupabaseBlogRepository(supabase);
      this.settingsRepo = new SupabaseSettingsRepository(supabase);
      this.authRepo = new SupabaseAuthRepository(supabase);
    }

    // Initialize Services
    this.products = new ProductService(this.productRepo, this.categoryRepo);
    this.orders = new OrderService(this.orderRepo);
    this.cart = new CartService(this.cartRepo);
    this.wishlist = new WishlistService(this.wishlistRepo);
    this.customer = new CustomerService(this.customerRepo);
    this.payments = new PaymentService(this.paymentRepo);
    this.coupons = new CouponService(this.couponRepo);
    this.reviews = new ReviewService(this.reviewRepo);
    this.notifications = new NotificationService(this.notificationRepo);
    this.content = new ContentService(this.bannerRepo, this.blogRepo, this.settingsRepo);
    this.auth = new AuthService(this.authRepo);
    this.admin = new AdminService(this.orderRepo, this.productRepo, this.customerRepo, this.reviewRepo);
    this.operations = new OperationsService();
    const homeMarketingRepo = this.useMockData || !supabase
      ? new (require('../modules/marketing').MockHomeMarketingRepository)()
      : new (require('../modules/marketing').SupabaseHomeMarketingRepository)(supabase);
    this.homeMarketing = new (require('../services/marketing.service').HomeMarketingService)(homeMarketingRepo);
  }
}

// Global default container instance
let defaultContainer: Container | null = null;

export function getContainer(config?: ContainerConfig): Container {
  if (!defaultContainer || config) {
    defaultContainer = new Container(config);
  }
  return defaultContainer;
}
