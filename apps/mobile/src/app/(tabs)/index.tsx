import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
  Modal,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { ProductCard } from '../../components/ProductCard';
import {
  getSoapImageSource,
  LOCAL_SOAP_ASSETS,
  LOCAL_CONCERN_IMAGES,
  LOCAL_WATCH_VIDEO_BGS,
} from '../../constants/soapAssets';
import {
  useCartStore,
  useWishlistStore,
  useProductsQuery,
  useCategoriesQuery,
  useHomeMarketingQuery,
  useUser,
  useUnreadNotificationsCountQuery,
} from '@cinmax/hooks';
import { parseYouTubeEmbedUrl, getProductFallbackImage } from '@cinmax/utils';
import type { Product, ComboOfferItem } from '@cinmax/types';
import {
  Menu,
  Heart,
  ShoppingBag,
  Search,
  PlayCircle,
  Star,
  GraduationCap,
  Leaf,
  ShieldCheck,
  Award,
  FlaskConical,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  User,
  Bell,
  X,
  ExternalLink,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTAINER_PADDING = 20;

const FONT_SERIF_BOLD = Platform.select({
  web: "'Noto Serif', Georgia, serif",
  default: 'NotoSerif_700Bold',
});

const FONT_SERIF_SEMIBOLD = Platform.select({
  web: "'Noto Serif', Georgia, serif",
  default: 'NotoSerif_600SemiBold',
});

const FONT_SANS_REGULAR = Platform.select({
  web: "'Plus Jakarta Sans', system-ui, sans-serif",
  default: 'PlusJakartaSans_400Regular',
});

const FONT_SANS_SEMIBOLD = Platform.select({
  web: "'Plus Jakarta Sans', system-ui, sans-serif",
  default: 'PlusJakartaSans_600SemiBold',
});

const FONT_SANS_BOLD = Platform.select({
  web: "'Plus Jakarta Sans', system-ui, sans-serif",
  default: 'PlusJakartaSans_700Bold',
});

export default function MobileHomeScreen() {
  const router = useRouter();
  const { addItem, items: cartItems } = useCartStore();
  const totalCartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const { toggleItem, isWishlisted, items: wishlistItems } = useWishlistStore();
  const { isAuthenticated, user } = useUser();
  const { data: unreadNotificationsCount = 0 } = useUnreadNotificationsCountQuery(user?.id);

  const { data: categories = [] } = useCategoriesQuery();
  const { data: productsData } = useProductsQuery();
  const { data: homeMarketingData, isLoading: isMarketingLoading } = useHomeMarketingQuery();
  const NEUTRAL_SOAP_IMAGE = 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/aroma-soap/1.jpg';

  const products: Product[] = React.useMemo(() => {
    const raw: Product[] = productsData?.items || [];
    const seen = new Set<string>();
    const list: Product[] = [];

    for (const p of raw) {
      if (!p || p.isActive === false) continue;
      const lowerTitle = (p.title || '').trim().toLowerCase();
      const lowerSlug = (p.slug || '').trim().toLowerCase();

      // Exclude test/demo products and audit duplicates
      if (
        lowerSlug.includes('test-product') ||
        lowerTitle.includes('test product') ||
        lowerSlug.includes('audited-herbal-bar') ||
        lowerTitle.includes('audited') ||
        lowerTitle.includes('audit-test') ||
        lowerSlug.includes('azure-marine') ||
        lowerSlug.includes('french-lavender') ||
        lowerSlug.includes('nordic-pine')
      ) {
        continue;
      }

      // Prevent duplicate products from appearing
      const dedupeKey = lowerSlug || lowerTitle || p.id;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      list.push(p);
    }
    return list;
  }, [productsData?.items]);

  const activeOffers = React.useMemo(() => {
    const rawOffers = homeMarketingData?.topOffers || [
      { id: 'def_1', text: 'Free Shipping above ₹499', linkUrl: '/shop', offerType: 'free_shipping', isActive: true },
    ];

    return rawOffers
      .map((item, idx) => {
        if (typeof item === 'string') {
          return {
            id: `off_${idx}`,
            text: item,
            linkUrl: '/shop',
            code: '',
            isActive: true,
          };
        }
        return item;
      })
      .filter((item) => item.isActive !== false && item.text && item.text.trim() !== '');
  }, [homeMarketingData?.topOffers]);

  interface HeroSlideItem {
    id: string;
    kicker?: string;
    badgeText?: string;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    imageUrl: string;
  }

  const activeBanners: HeroSlideItem[] = (homeMarketingData?.heroBanners || []).filter(b => b.isActive).map(b => ({
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    badgeText: b.badgeText || 'Featured',
    kicker: b.badgeText || 'Featured',
    ctaText: b.buttonText,
    ctaLink: b.linkUrl,
    imageUrl: b.imageUrl,
  }));

  const midBanner = homeMarketingData?.midBanner || {
    title: 'Monsoon Magic Sale',
    subtitle: 'On all Gift Hampers & Combo Packs',
    badgeText: 'LIMITED PERIOD OFFER',
    buttonText: 'Grab Now',
    linkUrl: '/shop',
    imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/rose-soap/1.jpg',
  };

  const realResults = (homeMarketingData?.realResults || []).map(r => ({
    id: r.id,
    before: r.beforeUrl,
    after: r.afterUrl,
    quote: r.quote,
    user: r.userName,
  }));

  const iconNameMap: Record<string, any> = {
    Leaf,
    ShieldCheck,
    Award,
    FlaskConical,
    CheckCircle,
    GraduationCap,
    Sparkles,
  };

  const trustBadges = (homeMarketingData?.trustBadges || []).filter(tb => tb.isActive !== false).map((tb, idx) => ({
    id: tb.id || `tb_${idx}`,
    label: tb.label,
    icon: iconNameMap[tb.iconName] || Leaf,
  }));

  const bottomBanner = homeMarketingData?.bottomBanner || {
    title: 'Crafted with Quality',
    subtitle: 'Our state-of-the-art facility ensures every bar meets global standards of purity.',
    buttonText: 'Learn More',
    linkUrl: '/about',
    imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/aloe-vera-soap/1.jpg',
    isActive: true,
  };

  const heroSlidesToDisplay: HeroSlideItem[] = React.useMemo(() => {
    if (activeBanners && activeBanners.length > 0) {
      return activeBanners;
    }

    const featuredProductsList = [
      {
        slug: 'aroma-soap',
        title: 'Aroma Soap',
        kicker: '100% PURE COCONUT OIL • GLYCERIN ENRICHED',
        subtitle: 'Handcrafted aroma soap for gentle cleansing & refreshing everyday bath.',
        ctaText: 'Shop Aroma Soap • ₹249',
        imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/aroma-soap/1.jpg',
      },
      {
        slug: 'aloe-vera-soap',
        title: 'Aloe Vera Soap',
        kicker: '100% PURE COCONUT OIL • ALOE EXTRACT',
        subtitle: 'Deeply hydrating, soothing and refreshing for silky-soft skin.',
        ctaText: 'Shop Aloe Vera Soap • ₹249',
        imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/aloe-vera-soap/1.jpg',
      },
      {
        slug: 'avarampoo-soap',
        title: 'Avarampoo Herbal Soap',
        kicker: 'GOLDEN RADIANCE • SENNA AURICULATA',
        subtitle: 'Tanner’s Cassia Golden Flower Blend for Natural Tan Removal & Glowing Skin.',
        ctaText: 'Shop Avarampoo • ₹289',
        imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/avarampoo-soap/1.jpg',
      },
      {
        slug: 'charcoal-soap',
        title: 'Activated Charcoal Detox Soap',
        kicker: 'PORE PURIFYING • POLLUTION SHIELD',
        subtitle: 'Bamboo Activated Charcoal & Tea Tree Oil for Deep Pore Cleansing.',
        ctaText: 'Shop Charcoal • ₹279',
        imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/charcoal-soap/1.jpg',
      },
      {
        slug: 'kasturi-manjal-soap',
        title: 'Kasturi Manjal Soap',
        kicker: 'WILD TURMERIC • TRADITIONAL GLOW',
        subtitle: 'Pure Wild Turmeric & Virgin Coconut Oil for Radiant, Blemish-Free Skin.',
        ctaText: 'Shop Kasturi Manjal • ₹299',
        imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/kasturi-manjal-soap/1.jpg',
      },
      {
        slug: 'manjistha-soap',
        title: 'Manjistha Soap',
        kicker: 'AYURVEDIC RADIANCE • EVEN TONE',
        subtitle: 'Rubia Cordifolia root extracts to reduce hyperpigmentation and restore natural glow.',
        ctaText: 'Shop Manjistha Soap • ₹299',
        imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/manjistha-soap/1.jpg',
      },
      {
        slug: 'neem-oil-soap',
        title: 'Neem Oil Soap',
        kicker: 'ANTIBACTERIAL • PURIFYING CARE',
        subtitle: 'Pure Cold-Pressed Neem Seed Oil for clear, healthy, blemish-free skin.',
        ctaText: 'Shop Neem Oil Soap • ₹249',
        imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/neem-oil-soap/1.jpg',
      },
      {
        slug: 'papaya-soap',
        title: 'Papaya Glow Soap',
        kicker: 'ENZYMATIC GLOW • COLD-PROCESSED',
        subtitle: 'Natural Skin Brightening & Gentle Exfoliation with Pure Papain Extract.',
        ctaText: 'Shop Papaya Soap • ₹279',
        imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/papaya-soap/1.jpg',
      },
      {
        slug: 'rose-soap',
        title: 'Damask Rose Petal Soap',
        kicker: 'DEEP MOISTURE • DAMASK ROSE',
        subtitle: 'Steam-Distilled Pure Rose Water with Nourishing Shea Butter.',
        ctaText: 'Shop Rose Soap • ₹299',
        imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/rose-soap/1.jpg',
      },
      {
        slug: 'veppalai-soap',
        title: 'Veppalai Ayurvedic Soap',
        kicker: 'HERBAL HEALING • THERAPEUTIC',
        subtitle: 'Wrightia Tinctoria Leaf Extract for Scalp Health & Sensitive Skin Care.',
        ctaText: 'Shop Veppalai • ₹299',
        imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/veppalai-soap/1.jpg',
      },
      {
        slug: 'vettiver-soap',
        title: 'Vettiver Root Clarifying Soap',
        kicker: 'COOLING AROMATHERAPY • KHUS ROOT',
        subtitle: 'Authentic Vetiver Root Infusion for All-Day Freshness & Body Cooling.',
        ctaText: 'Shop Vettiver • ₹289',
        imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/vettiver-soap/1.jpg',
      },
    ];

    return featuredProductsList.map((item) => {
      const match = products.find((p) => p.slug === item.slug);
      const img = match?.images?.[0]
        ? (typeof match.images[0] === 'string' ? match.images[0] : (match.images[0] as any).url)
        : item.imageUrl;
      const price = match?.basePrice ? ` • ₹${match.basePrice}` : '';

      return {
        id: `hero-${item.slug}`,
        kicker: item.kicker,
        badgeText: item.kicker,
        title: match?.title || item.title,
        subtitle: match?.subtitle || match?.description || item.subtitle,
        ctaText: match ? `Shop ${match.title}${price}` : item.ctaText,
        ctaLink: `/product/${item.slug}`,
        secondaryCtaText: 'View All Soaps',
        secondaryCtaLink: '/(tabs)/shop',
        imageUrl: img,
      };
    });
  }, [activeBanners, products]);

  const SLIDE_WIDTH = SCREEN_WIDTH - (CONTAINER_PADDING * 2);
  const carouselRef = React.useRef<ScrollView>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isUserSwiping, setIsUserSwiping] = useState(false);

  // Smooth, responsive auto-slide timer that pauses during user interaction
  React.useEffect(() => {
    if (heroSlidesToDisplay.length <= 1 || isUserSwiping) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => {
        const next = (prev + 1) % heroSlidesToDisplay.length;
        carouselRef.current?.scrollTo({ x: next * SLIDE_WIDTH, animated: true });
        return next;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [heroSlidesToDisplay.length, SLIDE_WIDTH, isUserSwiping]);

  const scrollToSlide = (index: number) => {
    const target = Math.max(0, Math.min(index, heroSlidesToDisplay.length - 1));
    setCurrentSlideIndex(target);
    carouselRef.current?.scrollTo({ x: target * SLIDE_WIDTH, animated: true });
  };

  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConcern, setSelectedConcern] = useState<string | null>(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [activeWatchVideo, setActiveWatchVideo] = useState<any | null>(null);

  const categoryDefaultImages: Record<string, string> = {
    'cold-process-soaps': 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/aroma-soap/1.jpg',
    'herbal-soaps': 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/neem-oil-soap/1.jpg',
    'glow-radiance': 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/kasturi-manjal-soap/1.jpg',
    'detox-purifying': 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/charcoal-soap/1.jpg',
    'healing-care': 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/veppalai-soap/1.jpg',
    'floral-essence': 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/rose-soap/1.jpg',
    'hydrating-gentle': 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/aloe-vera-soap/1.jpg',
    'earthy-cooling': 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/vettiver-soap/1.jpg',
    'bath-soap': 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/aroma-soap/1.jpg',
    'herbal-soap': 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/neem-oil-soap/1.jpg',
    'face-care': 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/kasturi-manjal-soap/1.jpg',
    'body-care': 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/charcoal-soap/1.jpg',
    'hair-care': 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/neem-oil-soap/1.jpg',
    'gift-sets': 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/rose-soap/1.jpg',
  };

  const concernCategories = React.useMemo(() => {
    const skinTypeMap = new Map<string, string>();
    products.forEach((p) => {
      p.skinTypes?.forEach((st) => {
        if (!skinTypeMap.has(st) && p.images?.[0]) {
           const imgUrl = typeof p.images[0] === 'string' ? p.images[0] : (p.images[0] as any).url;
           skinTypeMap.set(st, imgUrl);
        }
      });
    });

    const mapping = [
      { id: 'dry', title: 'Dry Skin', fallback: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/aloe-vera-soap/1.jpg' },
      { id: 'oily', title: 'Acne Prone', fallback: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/neem-oil-soap/1.jpg' },
      { id: 'sensitive', title: 'Sensitive Skin', fallback: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/avarampoo-soap/1.jpg' },
      { id: 'mature', title: 'Anti-Aging', fallback: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/manjistha-soap/1.jpg' },
      { id: 'combination', title: 'Glowing Skin', fallback: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/kasturi-manjal-soap/1.jpg' },
      { id: 'detox', title: 'Deep Detox', fallback: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/charcoal-soap/1.jpg' },
      { id: 'cooling', title: 'Cooling Relief', fallback: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/vettiver-soap/1.jpg' },
    ];

    return mapping.map(item => ({
      ...item,
      image: skinTypeMap.get(item.id) || item.fallback
    }));
  }, [products]);

  const watchShopVideos = [
    {
      id: 'v1',
      slug: 'charcoal-soap',
      title: 'Activated Charcoal Detox Ritual',
      price: '₹279',
      thumb: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/charcoal-soap/2.jpg',
      videoBg: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/charcoal-soap/1.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      kicker: 'Deep Pore Detox',
    },
    {
      id: 'v2',
      slug: 'rose-soap',
      title: 'Damask Rose Petal Infusion',
      price: '₹299',
      thumb: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/rose-soap/2.jpg',
      videoBg: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/rose-soap/1.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      kicker: 'Pure Floral Essence',
    },
    {
      id: 'v3',
      slug: 'kasturi-manjal-soap',
      title: 'Kasturi Manjal Golden Glow',
      price: '₹299',
      thumb: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/kasturi-manjal-soap/2.jpg',
      videoBg: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/kasturi-manjal-soap/1.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      kicker: 'Ayurvedic Radiance',
    },
    {
      id: 'v4',
      slug: 'papaya-soap',
      title: 'Papaya Pure Enzyme Brightening',
      price: '₹279',
      thumb: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/papaya-soap/2.jpg',
      videoBg: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/papaya-soap/1.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      kicker: 'Natural Glow',
    },
    {
      id: 'v5',
      slug: 'neem-oil-soap',
      title: 'Pure Neem Herbal Purification',
      price: '₹279',
      thumb: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/neem-oil-soap/2.jpg',
      videoBg: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/neem-oil-soap/1.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      kicker: 'Antibacterial Shield',
    },
    {
      id: 'v6',
      slug: 'aloe-vera-soap',
      title: 'Fresh Aloe Soothing Hydration',
      price: '₹279',
      thumb: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/aloe-vera-soap/2.jpg',
      videoBg: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/aloe-vera-soap/1.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      kicker: 'Gentle Calming',
    },
    {
      id: 'v7',
      slug: 'vettiver-soap',
      title: 'Earthy Vetiver Cooling Therapy',
      price: '₹299',
      thumb: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/vettiver-soap/2.jpg',
      videoBg: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/vettiver-soap/1.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      kicker: 'Cooling Aroma',
    },
    {
      id: 'v8',
      slug: 'veppalai-soap',
      title: 'Veppalai Traditional Healing Bar',
      price: '₹279',
      thumb: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/veppalai-soap/2.jpg',
      videoBg: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/veppalai-soap/1.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      kicker: 'Skin Recovery',
    },
  ];

  const categoryAvatars = [
    { title: 'Herbal Soaps', slug: 'neem-oil-soap', image: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/neem-oil-soap/1.jpg' },
    { title: 'Glow & Radiance', slug: 'kasturi-manjal-soap', image: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/kasturi-manjal-soap/1.jpg' },
    { title: 'Charcoal Detox', slug: 'charcoal-soap', image: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/charcoal-soap/1.jpg' },
    { title: 'Damask Rose', slug: 'rose-soap', image: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/rose-soap/1.jpg' },
    { title: 'Fresh Aloe', slug: 'aloe-vera-soap', image: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/aloe-vera-soap/1.jpg' },
    { title: 'Earthy Vetiver', slug: 'vettiver-soap', image: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/vettiver-soap/1.jpg' },
    { title: 'Pure Veppalai', slug: 'veppalai-soap', image: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/veppalai-soap/1.jpg' },
    { title: 'Papaya Glow', slug: 'papaya-soap', image: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/papaya-soap/1.jpg' },
    { title: 'Aroma Luxury', slug: 'aroma-soap', image: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/aroma-soap/1.jpg' },
    { title: 'Manjistha Care', slug: 'manjistha-soap', image: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/manjistha-soap/1.jpg' },
    { title: 'Avarampoo Bar', slug: 'avarampoo-soap', image: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/avarampoo-soap/1.jpg' },
  ];



  const dynamicComboOffers: ComboOfferItem[] = (homeMarketingData?.comboOffers && homeMarketingData.comboOffers.length > 0)
    ? (homeMarketingData.comboOffers as ComboOfferItem[]).filter((c: ComboOfferItem) => c.isActive !== false)
    : [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FB' }}>
      {/* 1. FIXED TOP HEADER BAR */}
      <View style={{ zIndex: 100, elevation: 10, paddingHorizontal: CONTAINER_PADDING, paddingTop: 14, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(247, 249, 251, 0.95)', borderBottomWidth: 1, borderBottomColor: 'rgba(195, 198, 209, 0.3)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Image
            source={require('../../../assets/logo.png')}
            style={{ width: 36, height: 26 }}
            resizeMode="contain"
          />
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: '#002754', letterSpacing: -0.5 }}>
            CINMAX
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => router.push('/notifications' as any)}
            hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
            activeOpacity={0.7}
            style={{ minWidth: 38, minHeight: 38, justifyContent: 'center', alignItems: 'center', position: 'relative' }}
          >
            <Bell size={22} color="#002754" />
            {unreadNotificationsCount > 0 && (
              <View pointerEvents="none" style={{ position: 'absolute', top: 0, right: -2, backgroundColor: '#C5A880', borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#FFFFFF' }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#002754', fontSize: 9, fontWeight: '800' }}>
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/wishlist' as any)}
            hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
            activeOpacity={0.7}
            style={{ minWidth: 38, minHeight: 38, justifyContent: 'center', alignItems: 'center', position: 'relative' }}
          >
            <Heart size={22} color={wishlistItems.length > 0 ? '#DC2626' : '#002754'} fill={wishlistItems.length > 0 ? '#DC2626' : 'none'} />
            {wishlistItems.length > 0 && (
              <View pointerEvents="none" style={{ position: 'absolute', top: 0, right: -4, backgroundColor: '#DC2626', borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 10, fontWeight: '700' }}>{wishlistItems.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/cart' as any)}
            hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
            activeOpacity={0.7}
            style={{ minWidth: 38, minHeight: 38, justifyContent: 'center', alignItems: 'center', position: 'relative' }}
          >
            <ShoppingBag size={22} color="#002754" />
            {totalCartCount > 0 && (
              <View pointerEvents="none" style={{ position: 'absolute', top: 0, right: -4, backgroundColor: '#BA1A1A', borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 10, fontWeight: '700' }}>{totalCartCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {!isAuthenticated ? (
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login' as any)}
              hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
              activeOpacity={0.7}
              style={{
                backgroundColor: '#002754',
                paddingHorizontal: 12,
                paddingVertical: 7,
                minHeight: 36,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <User size={15} color="#FFFFFF" />
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>
                Sign In
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/profile' as any)}
              hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
              activeOpacity={0.7}
              style={{ minWidth: 38, minHeight: 38, justifyContent: 'center', alignItems: 'center' }}
            >
              <User size={22} color="#002754" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">

        {/* INTEGRATED SOFT LUXURY COSMETICS HERO REGION */}
        <View style={{ backgroundColor: '#FAF7F2', paddingTop: 16, paddingBottom: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, borderWidth: 1, borderColor: 'rgba(197, 168, 128, 0.25)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.05, shadowRadius: 16 }}>

          {/* 1. Search Bar & Announcement Chips */}
          <View style={{ paddingHorizontal: CONTAINER_PADDING, gap: 14 }}>
            <View style={{ backgroundColor: 'white', borderRadius: 25, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.35)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6 }}>
              <Search size={18} color="#737781" style={{ marginRight: 10 }} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => {
                  if (searchQuery.trim()) {
                    router.push({ pathname: '/search', params: { query: searchQuery.trim() } } as any);
                  } else {
                    router.push('/search' as any);
                  }
                }}
                placeholder="Search soaps, skincare and body care..."
                placeholderTextColor="#737781"
                style={{ fontFamily: FONT_SANS_REGULAR, flex: 1, fontSize: 14, color: '#191C1E' }}
              />
            </View>

            {activeOffers.length > 0 && (
              <ScrollView horizontal nestedScrollEnabled={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                {activeOffers.map((offer: any, idx: number) => {
                  const bgStyles = [
                    { bg: 'rgba(0, 39, 84, 0.08)', border: 'rgba(0, 39, 84, 0.12)', text: '#002754' },
                    { bg: 'rgba(197, 168, 128, 0.2)', border: 'rgba(197, 168, 128, 0.3)', text: '#002754' },
                    { bg: '#DAE3F4', border: 'rgba(0, 39, 84, 0.1)', text: '#131C28' },
                  ];
                  const styleScheme = bgStyles[idx % bgStyles.length];

                  return (
                    <TouchableOpacity
                      key={offer.id || idx}
                      onPress={() => {
                        if (offer.linkUrl) {
                          router.push(offer.linkUrl as any);
                        }
                      }}
                      activeOpacity={0.7}
                      style={{
                        backgroundColor: styleScheme.bg,
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: styleScheme.border,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, color: styleScheme.text, fontSize: 12, fontWeight: '600' }}>
                        {offer.text}
                      </Text>
                      {offer.code ? (
                        <View style={{ backgroundColor: 'rgba(0, 39, 84, 0.12)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                          <Text style={{ fontFamily: FONT_SANS_BOLD, color: styleScheme.text, fontSize: 10 }}>{offer.code}</Text>
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>

          {/* 2. Visual Blended Hero Slideshow Carousel */}
          {heroSlidesToDisplay.length > 0 && (
            <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 18, borderRadius: 26, overflow: 'hidden', height: 380, position: 'relative', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.16, shadowRadius: 22, borderWidth: 1, borderColor: 'rgba(197, 168, 128, 0.4)' }}>
              <ScrollView
                ref={carouselRef}
                horizontal
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                decelerationRate="normal"
                nestedScrollEnabled={true}
                onScrollBeginDrag={() => setIsUserSwiping(true)}
                onScrollEndDrag={() => setIsUserSwiping(false)}
                onMomentumScrollEnd={(e) => {
                  setIsUserSwiping(false);
                  const offset = e.nativeEvent.contentOffset.x;
                  const newIndex = Math.round(offset / SLIDE_WIDTH);
                  if (newIndex >= 0 && newIndex < heroSlidesToDisplay.length) {
                    setCurrentSlideIndex(newIndex);
                  }
                }}
                style={{ width: SLIDE_WIDTH, height: 380 }}
              >
                {heroSlidesToDisplay.map((slide, idx) => (
                  <View key={slide.id || idx} style={{ width: SLIDE_WIDTH, height: 380, position: 'relative', backgroundColor: '#002754' }}>
                    <Image
                      source={getSoapImageSource(slide.imageUrl, slide.title || slide.id)}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                    {/* Soft Ambient Overlay */}
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 24, 52, 0.45)' }} />

                    {/* Card Content Overlay */}
                    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingBottom: 28, paddingTop: 16, alignItems: 'center', backgroundColor: 'rgba(0, 18, 42, 0.65)' }}>
                      {slide.kicker ? (
                        <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#C5A880', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6, textAlign: 'center' }}>
                          {slide.kicker}
                        </Text>
                      ) : null}

                      <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 21, fontWeight: '700', color: 'white', textAlign: 'center', marginBottom: 6, lineHeight: 26, textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}>
                        {slide.title}
                      </Text>
                      <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: 'rgba(255, 255, 255, 0.94)', textAlign: 'center', marginBottom: 14, lineHeight: 17 }} numberOfLines={2}>
                        {slide.subtitle}
                      </Text>

                      <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                        <TouchableOpacity
                          onPress={() => router.push((slide.ctaLink || '/shop') as any)}
                          style={{ backgroundColor: '#C5A880', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 22, flexDirection: 'row', alignItems: 'center', gap: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 8 }}
                        >
                          <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#002754', fontWeight: '700', fontSize: 12 }}>
                            {slide.ctaText || 'Explore collection'}
                          </Text>
                          <ArrowRight size={14} color="#002754" />
                        </TouchableOpacity>

                        {slide.secondaryCtaText ? (
                          <TouchableOpacity
                            onPress={() => router.push((slide.secondaryCtaLink || '/shop') as any)}
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.18)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.45)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 22, alignItems: 'center' }}
                          >
                            <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontWeight: '700', fontSize: 12 }}>
                              {slide.secondaryCtaText}
                            </Text>
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>

              {/* Prev Button */}
              <TouchableOpacity
                onPress={() => scrollToSlide(currentSlideIndex === 0 ? heroSlidesToDisplay.length - 1 : currentSlideIndex - 1)}
                style={{ position: 'absolute', left: 10, top: '40%', width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0, 39, 84, 0.75)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)', zIndex: 10 }}
              >
                <ChevronLeft size={20} color="#C5A880" />
              </TouchableOpacity>

              {/* Next Button */}
              <TouchableOpacity
                onPress={() => scrollToSlide((currentSlideIndex + 1) % heroSlidesToDisplay.length)}
                style={{ position: 'absolute', right: 10, top: '40%', width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0, 39, 84, 0.75)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)', zIndex: 10 }}
              >
                <ChevronRight size={20} color="#C5A880" />
              </TouchableOpacity>

              {/* Indicator Dots */}
              <View style={{ position: 'absolute', bottom: 8, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6, zIndex: 10 }}>
                {heroSlidesToDisplay.map((_, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => scrollToSlide(idx)}
                    style={{
                      width: currentSlideIndex === idx ? 22 : 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: currentSlideIndex === idx ? '#C5A880' : 'rgba(255, 255, 255, 0.45)',
                    }}
                  />
                ))}
              </View>
            </View>
          )}
        </View>

        {/* 4. Shop By Concern (Skin Types & Benefits) */}
        <View style={{ marginTop: 24, paddingHorizontal: CONTAINER_PADDING }}>
          <Text style={{ fontFamily: FONT_SERIF_SEMIBOLD, fontSize: 22, fontWeight: '500', color: '#002754', marginBottom: 14 }}>
            Shop By Concern
          </Text>
          <ScrollView
            horizontal
            nestedScrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={{ gap: 10 }}
          >
            {concernCategories.map((c) => {
              const isSelected = selectedConcern === c.id;
              return (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => {
                    setSelectedConcern(c.id);
                    router.push(`/(tabs)/shop?concern=${c.id}&title=${encodeURIComponent(c.title)}` as any);
                  }}
                  activeOpacity={0.8}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 22,
                    backgroundColor: isSelected ? '#002754' : '#FFFFFF',
                    borderWidth: 1.5,
                    borderColor: isSelected ? '#002754' : 'rgba(195, 198, 209, 0.4)',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    flexShrink: 0,
                    shadowColor: '#0A3D78',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isSelected ? 0.12 : 0.04,
                    shadowRadius: 5,
                  }}
                >
                  <View style={{ width: 28, height: 28, borderRadius: 14, overflow: 'hidden', backgroundColor: '#E6E8EA', flexShrink: 0 }}>
                    <Image source={LOCAL_CONCERN_IMAGES[c.id] || getSoapImageSource(c.title)} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                  </View>
                  <Text
                    style={{
                      fontFamily: FONT_SANS_SEMIBOLD,
                      fontSize: 13,
                      fontWeight: '600',
                      color: isSelected ? '#FFFFFF' : '#191C1E',
                      lineHeight: 18,
                      includeFontPadding: false,
                      flexShrink: 0,
                    }}
                  >
                    {c.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 5. Watch & Shop */}
        <View style={{ marginTop: 28, paddingHorizontal: CONTAINER_PADDING }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <View>
              <Text style={{ fontFamily: FONT_SERIF_SEMIBOLD, fontSize: 22, fontWeight: '600', color: '#002754' }}>
                Watch &amp; Shop
              </Text>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#737781', marginTop: 2 }}>
                Real handcrafted soaps in action
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/shop' as any)}>
              <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 13, fontWeight: '600', color: '#002754' }}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal nestedScrollEnabled={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14, paddingVertical: 4 }}>
            {watchShopVideos.map((vid) => (
              <TouchableOpacity
                key={vid.id}
                onPress={() => setActiveWatchVideo(vid)}
                activeOpacity={0.9}
                style={{ width: 175, height: 310, borderRadius: 20, overflow: 'hidden', backgroundColor: '#002754', position: 'relative', borderWidth: 1, borderColor: 'rgba(197, 168, 128, 0.35)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 12 }}
              >
                <Image
                  source={LOCAL_WATCH_VIDEO_BGS[vid.id] || getSoapImageSource(vid.slug || vid.title)}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
                
                {/* Soft Gradient Overlay */}
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 24, 52, 0.3)' }} />

                {/* Top Badge */}
                {vid.kicker ? (
                  <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0, 39, 84, 0.85)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(197, 168, 128, 0.5)' }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#C5A880', fontSize: 9, fontWeight: '700', textTransform: 'uppercase' }}>
                      {vid.kicker}
                    </Text>
                  </View>
                ) : null}

                {/* Center Play Icon */}
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0, 39, 84, 0.85)', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#C5A880', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8 }}>
                    <PlayCircle size={28} color="#C5A880" />
                  </View>
                </View>

                {/* Bottom Product Info Card */}
                <View style={{ position: 'absolute', bottom: 8, left: 8, right: 8, backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 14, padding: 8, flexDirection: 'row', alignItems: 'center', gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}>
                  <View style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: '#E0E3E5', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(197, 168, 128, 0.3)' }}>
                    <Image source={getSoapImageSource(vid.thumb, vid.slug)} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, fontWeight: '700', color: '#002754' }} numberOfLines={1}>{vid.title}</Text>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, fontWeight: '800', color: '#002754' }}>{vid.price}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      router.push(`/product/${vid.slug}` as any);
                    }}
                    style={{ backgroundColor: '#002754', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}
                  >
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 9, color: '#FFFFFF', fontWeight: '700' }}>Shop</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 5. Best Sellers */}
        <View style={{ marginTop: 28, paddingHorizontal: CONTAINER_PADDING }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ fontFamily: FONT_SERIF_SEMIBOLD, fontSize: 22, fontWeight: '500', color: '#002754' }}>Best Sellers</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/shop' as any)}>
              <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 13, fontWeight: '600', color: '#002754' }}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {products.map((prod) => {
              const specificFallback = getProductFallbackImage(prod.slug || prod.title, 1);
              const rawUrl = typeof prod.images?.[0] === 'string'
                ? prod.images[0]
                : prod.images?.[0]?.url;
              const prodImg = rawUrl && !rawUrl.includes('audit-test') ? rawUrl : specificFallback;

              return (
                <ProductCard
                  key={prod.id}
                  id={prod.id}
                  title={prod.title}
                  slug={prod.slug}
                  price={prod.basePrice}
                  originalPrice={prod.compareAtPrice ?? undefined}
                  image={prodImg}
                  rating={prod.averageRating?.toString() || '4.95'}
                  reviewCount={prod.reviewCount?.toString() || '128'}
                  minOrderQuantity={prod.minOrderQuantity}
                  quantityPrice={prod.quantityPrice}
                />
              );
            })}
          </View>
        </View>

        {/* 8. Promotional Banner */}
        <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 28, borderRadius: 20, overflow: 'hidden', height: 160, backgroundColor: '#002754', borderWidth: 1, borderColor: 'rgba(197, 168, 128, 0.4)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 12 }}>
          <Image
            source={LOCAL_SOAP_ASSETS['aroma-soap']}
            style={{ width: '100%', height: '100%', opacity: 0.45 }}
            resizeMode="cover"
          />
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', padding: 14, backgroundColor: 'rgba(0, 39, 84, 0.4)' }}>
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, fontWeight: '700', color: '#C5A880', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 }}>
              Cold-Process Purity
            </Text>
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: 'white', marginBottom: 4 }}>
              100% Herbal &amp; Natural
            </Text>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: 'rgba(255, 255, 255, 0.9)', marginBottom: 12 }}>
              Handcrafted in Small Batches for Glowing Skin
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/shop' as any)} style={{ backgroundColor: '#C5A880', paddingHorizontal: 22, paddingVertical: 8, borderRadius: 18 }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#002754', fontWeight: '700', fontSize: 12 }}>Explore All 11 Soaps</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 9. New Launch */}
        <View style={{ marginTop: 28, paddingHorizontal: CONTAINER_PADDING }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ fontFamily: FONT_SERIF_SEMIBOLD, fontSize: 22, fontWeight: '500', color: '#002754' }}>New Launches</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/shop' as any)}>
              <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 13, fontWeight: '600', color: '#002754' }}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal nestedScrollEnabled={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14, paddingBottom: 6 }}>
            {products.map((item) => {
              const rawUrl = typeof item.images?.[0] === 'string'
                ? item.images[0]
                : item.images?.[0]?.url;
              const soapImageSource = getSoapImageSource(rawUrl, item.slug || item.title);

              return (
                <TouchableOpacity key={item.id} onPress={() => router.push(`/product/${item.slug}` as any)} style={{ width: 140, gap: 6 }}>
                  <View style={{ width: 140, height: 140, borderRadius: 16, overflow: 'hidden', backgroundColor: '#F8F9FB', borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.4)', position: 'relative' }}>
                    {/* Layer 1: Ambient Blurred Background */}
                    <Image
                      source={soapImageSource}
                      style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.65 }}
                      resizeMode="cover"
                      blurRadius={Platform.OS === 'ios' ? 20 : 12}
                    />
                    {/* Layer 2: Soft Tint Overlay */}
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.25)' }} />
                    {/* Layer 3: Sharp Foreground Image */}
                    <Image
                      source={soapImageSource}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, fontWeight: '700', color: '#191C1E' }} numberOfLines={1}>{item.title}</Text>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, fontWeight: '700', color: '#002754' }}>₹{item.basePrice}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 10. Combo Offers (Dynamic Admin Marketing Settings) */}
        {isMarketingLoading ? (
          <View style={{ marginTop: 28, paddingHorizontal: CONTAINER_PADDING }}>
            <View style={{ height: 24, width: 140, backgroundColor: 'rgba(0,39,84,0.06)', borderRadius: 6, marginBottom: 14 }} />
            <View style={{ gap: 14 }}>
              {[1, 2].map((k) => (
                <View key={k} style={{ height: 100, backgroundColor: 'rgba(0,39,84,0.04)', borderRadius: 16 }} />
              ))}
            </View>
          </View>
        ) : dynamicComboOffers.length > 0 ? (
          <View style={{ marginTop: 28, paddingHorizontal: CONTAINER_PADDING }}>
            <Text style={{ fontFamily: FONT_SERIF_SEMIBOLD, fontSize: 22, fontWeight: '500', color: '#002754', marginBottom: 14 }}>
              Combo Offers
            </Text>
            <View style={{ gap: 14 }}>
              {dynamicComboOffers.map((combo) => (
                <TouchableOpacity
                  key={combo.id}
                  onPress={() => router.push((combo.linkUrl || `/product/${combo.slug}`) as any)}
                  style={{
                    backgroundColor: combo.bgColor || 'rgba(0, 39, 84, 0.08)',
                    borderRadius: 16,
                    padding: 14,
                    flexDirection: 'row',
                    gap: 14,
                    borderWidth: 1,
                    borderColor: combo.borderColor || 'rgba(0, 39, 84, 0.12)',
                  }}
                >
                  <Image
                    source={{ uri: combo.imageUrl || 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/rose-soap/2.jpg' }}
                    style={{ width: 84, height: 84, borderRadius: 12 }}
                  />
                  <View style={{ flex: 1, justifyContent: 'space-between', paddingVertical: 2 }}>
                    <View>
                      <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 15, fontWeight: '700', color: '#002754' }}>
                        {combo.title}
                      </Text>
                      <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#434750', marginTop: 2 }} numberOfLines={2}>
                        {combo.subtitle}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 }}>
                      <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 15, fontWeight: '700', color: '#002754' }}>
                        {combo.price}{' '}
                        {combo.originalPrice ? (
                          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#737781', textDecorationLine: 'line-through', fontWeight: '400' }}>
                            {combo.originalPrice}
                          </Text>
                        ) : null}
                      </Text>
                      {combo.badge ? (
                        <View style={{ backgroundColor: combo.badgeBg || '#002754', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 }}>
                          <Text style={{ fontFamily: FONT_SANS_BOLD, color: combo.badgeTextColor || 'white', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>
                            {combo.badge}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : null}

        {/* 11. Real Results */}
        <View style={{ marginTop: 28, paddingHorizontal: CONTAINER_PADDING }}>
          <Text style={{ fontFamily: FONT_SERIF_SEMIBOLD, fontSize: 22, fontWeight: '500', color: '#002754', marginBottom: 14 }}>
            Real Results
          </Text>
          <ScrollView horizontal nestedScrollEnabled={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14 }}>
            {realResults.map((item) => (
              <View key={item.id} style={{ width: 240, backgroundColor: 'white', borderRadius: 16, padding: 10, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.2)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 10 }}>
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
                  <View style={{ flex: 1, height: 88, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                    <Image source={{ uri: item.before }} style={{ width: '100%', height: '100%' }} />
                    <View style={{ position: 'absolute', bottom: 4, left: 4, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 }}>
                      <Text style={{ fontFamily: FONT_SANS_REGULAR, color: 'white', fontSize: 8 }}>Before</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, height: 88, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                    <Image source={{ uri: item.after }} style={{ width: '100%', height: '100%' }} />
                    <View style={{ position: 'absolute', bottom: 4, left: 4, backgroundColor: '#002754', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 }}>
                      <Text style={{ fontFamily: FONT_SANS_REGULAR, color: 'white', fontSize: 8 }}>After</Text>
                    </View>
                  </View>
                </View>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, fontWeight: '700', color: '#002754', fontStyle: 'italic', marginBottom: 2 }}>{item.quote}</Text>
                <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 10, color: '#737781' }}>{item.user}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 12. Why Choose CINMAX? */}
        {trustBadges.length > 0 && (
          <View style={{ marginTop: 28, paddingHorizontal: CONTAINER_PADDING, alignItems: 'center' }}>
            <Text style={{ fontFamily: FONT_SERIF_SEMIBOLD, fontSize: 22, fontWeight: '500', color: '#002754', textAlign: 'center', marginBottom: 20 }}>
              Why Choose CINMAX?
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16, width: '100%' }}>
              {trustBadges.map((badge) => {
                const IconComp = badge.icon || Leaf;
                return (
                  <View key={badge.id} style={{ width: '28%', alignItems: 'center', gap: 6 }}>
                    <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0, 39, 84, 0.08)', justifyContent: 'center', alignItems: 'center' }}>
                      <IconComp size={22} color="#002754" />
                    </View>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10.5, fontWeight: '700', color: '#191C1E', textAlign: 'center' }}>{badge.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* 13. Manufacturing Banner */}
        {bottomBanner.isActive !== false && (
          <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 28, borderRadius: 20, overflow: 'hidden', minHeight: 230, backgroundColor: '#002754', position: 'relative' }}>
            <Image
              source={getSoapImageSource(bottomBanner.imageUrl, 'neem-oil-soap')}
              style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              resizeMode="cover"
            />
            <View style={{ backgroundColor: 'rgba(0, 39, 84, 0.55)', justifyContent: 'center', alignItems: 'center', padding: 24, minHeight: 230 }}>
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 24, fontWeight: '600', color: 'white', textAlign: 'center', marginBottom: 8 }}>
                {bottomBanner.title || 'Crafted with Quality'}
              </Text>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: 'white', textAlign: 'center', maxWidth: 280, lineHeight: 20 }}>
                {bottomBanner.subtitle || 'Our state-of-the-art facility ensures every bar of soap meets global standards of purity and excellence.'}
              </Text>
              <TouchableOpacity
                onPress={() => router.push((bottomBanner.linkUrl || '/about') as any)}
                activeOpacity={0.85}
                style={{ marginTop: 16, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1.5, borderColor: 'white', paddingHorizontal: 24, paddingVertical: 9, borderRadius: 20 }}
              >
                <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontWeight: '700', fontSize: 13 }}>
                  {bottomBanner.buttonText || 'Learn More'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>

      {/* YOUTUBE VIDEO PLAYER MODAL */}
      {selectedVideoUrl && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={!!selectedVideoUrl}
          onRequestClose={() => setSelectedVideoUrl(null)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.88)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
            <TouchableOpacity
              onPress={() => setSelectedVideoUrl(null)}
              style={{ position: 'absolute', top: Platform.OS === 'ios' ? 56 : 36, right: 20, zIndex: 20, backgroundColor: '#002754', width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#C5A880' }}
            >
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={{ width: '100%', maxWidth: 540, aspectRatio: 16 / 9, borderRadius: 16, overflow: 'hidden', backgroundColor: 'black', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
              {Platform.OS === 'web' ? (
                <iframe
                  src={parseYouTubeEmbedUrl(selectedVideoUrl)}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <WebView
                  source={{ uri: parseYouTubeEmbedUrl(selectedVideoUrl) }}
                  style={{ flex: 1, backgroundColor: '#000000' }}
                  allowsInlineMediaPlayback={true}
                  mediaPlaybackRequiresUserAction={false}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                />
              )}
            </View>
          </View>
        </Modal>
      )}

      {/* WATCH & SHOP VIDEO PLAYER MODAL */}
      {activeWatchVideo && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!activeWatchVideo}
          onRequestClose={() => setActiveWatchVideo(null)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
            {/* Close button */}
            <TouchableOpacity
              onPress={() => setActiveWatchVideo(null)}
              style={{ position: 'absolute', top: Platform.OS === 'ios' ? 56 : 36, right: 20, zIndex: 20, backgroundColor: '#002754', width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#C5A880' }}
            >
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Video Container (Reels / 9:16 vertical view) */}
            <View style={{ width: '100%', maxWidth: 360, height: '70%', borderRadius: 20, overflow: 'hidden', backgroundColor: '#000', borderWidth: 1, borderColor: 'rgba(197, 168, 128, 0.4)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16 }}>
              {Platform.OS === 'web' ? (
                <iframe
                  src={parseYouTubeEmbedUrl(activeWatchVideo.videoUrl)}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <WebView
                  source={{ uri: parseYouTubeEmbedUrl(activeWatchVideo.videoUrl) }}
                  style={{ flex: 1, backgroundColor: '#000000' }}
                  allowsInlineMediaPlayback={true}
                  mediaPlaybackRequiresUserAction={false}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                />
              )}
            </View>

            {/* Product Card at bottom of modal */}
            <View style={{ width: '100%', maxWidth: 360, marginTop: 14, backgroundColor: 'white', borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 }}>
              <View style={{ width: 50, height: 50, borderRadius: 10, overflow: 'hidden', backgroundColor: '#F0F3F6', position: 'relative' }}>
                <Image
                  source={getSoapImageSource(activeWatchVideo.thumb, activeWatchVideo.slug)}
                  style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.5 }}
                  resizeMode="cover"
                  blurRadius={Platform.OS === 'ios' ? 14 : 8}
                />
                <Image
                  source={getSoapImageSource(activeWatchVideo.thumb, activeWatchVideo.slug)}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="contain"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, fontWeight: '700', color: '#002754' }} numberOfLines={1}>
                  {activeWatchVideo.title}
                </Text>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, fontWeight: '800', color: '#002754' }}>
                  {activeWatchVideo.price}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  const currentVid = activeWatchVideo;
                  setActiveWatchVideo(null);
                  router.push(`/product/${currentVid.slug}` as any);
                }}
                style={{ backgroundColor: '#002754', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 4 }}
              >
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#FFFFFF', fontWeight: '700' }}>View Details</Text>
                <ExternalLink size={12} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}
