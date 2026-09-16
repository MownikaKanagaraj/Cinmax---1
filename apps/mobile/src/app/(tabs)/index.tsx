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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ProductCard } from '../../components/ProductCard';
import { useCartStore, useWishlistStore, useProductsQuery, useCategoriesQuery, useHomeMarketingQuery, useUser } from '@cinmax/hooks';
import { parseYouTubeEmbedUrl } from '@cinmax/utils';
import type { Product } from '@cinmax/types';
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
  const { isAuthenticated } = useUser();

  const { data: categories = [] } = useCategoriesQuery();
  const { data: productsData } = useProductsQuery();
  const { data: homeMarketingData } = useHomeMarketingQuery();
  const products: Product[] = productsData?.items || [];

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
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1000&auto=format&fit=crop&q=80',
  };

  const realResults = (homeMarketingData?.realResults || []).map(r => ({
    id: r.id,
    before: r.beforeUrl,
    after: r.afterUrl,
    quote: r.quote,
    user: r.userName,
  }));

  const trustBadges = (homeMarketingData?.trustBadges || []).map(tb => ({
    label: tb.label,
    icon: Leaf,
  }));

  const bottomBanner = homeMarketingData?.bottomBanner || {
    title: 'Crafted with Quality',
    subtitle: 'Our state-of-the-art facility ensures every bar meets global standards of purity.',
    buttonText: 'Learn More',
    linkUrl: '/about',
    imageUrl: 'https://images.unsplash.com/photo-1607006482172-35891d9e1158?w=1000&auto=format&fit=crop&q=80',
  };

  const cosmeticsHeroSlides: HeroSlideItem[] = [
    {
      id: 'slide-1',
      kicker: 'DELIVERED PAN-INDIA • 100% ORGANIC BOTANICALS',
      title: 'Artisanal skincare & beauty hampers, handed over in person.',
      subtitle: 'Choose a handcrafted hamper or luxury botanical elixir, cured with pure organic alchemy.',
      ctaText: 'Explore the collection',
      ctaLink: '/shop',
      secondaryCtaText: 'Browse Master Classes',
      secondaryCtaLink: '/(tabs)/videos',
      imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'slide-2',
      kicker: 'CURED 45 DAYS IN SMALL BATCHES',
      title: 'Cold-process soap therapeutics, handed over with care.',
      subtitle: 'Enriched with virgin coconut oil, cocoa butter, and pure aromatherapy essential oil blends.',
      ctaText: 'Shop Handcrafted Soaps',
      ctaLink: '/shop',
      secondaryCtaText: 'View Ingredients',
      secondaryCtaLink: '/shop',
      imageUrl: 'https://images.unsplash.com/photo-1607006482172-35891d9e1158?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'slide-3',
      kicker: 'EXCLUSIVELY CURATED GIFTING',
      title: 'Send a little joy today with luxury beauty hampers.',
      subtitle: 'Thoughtfully curated gift sets, fresh botanical infusions, and custom greeting notes.',
      ctaText: 'Explore Gift Hampers',
      ctaLink: '/shop',
      secondaryCtaText: 'Special Offers',
      secondaryCtaLink: '/shop',
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'slide-4',
      kicker: 'BOTANICAL ACADEMY & WORKSHOPS',
      title: 'Master artisanal soapmaking & skincare formulation.',
      subtitle: 'Unlock paid video masterclasses taught by master formulation artisans with lifetime access.',
      ctaText: 'Browse Master Classes',
      ctaLink: '/(tabs)/videos',
      secondaryCtaText: 'View Curriculum',
      secondaryCtaLink: '/(tabs)/videos',
      imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200&auto=format&fit=crop&q=80',
    },
  ];

  const heroSlidesToDisplay = cosmeticsHeroSlides;

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  React.useEffect(() => {
    if (heroSlidesToDisplay.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % heroSlidesToDisplay.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroSlidesToDisplay.length]);

  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, []);

  const [activeConcern, setActiveConcern] = useState('Dry Skin');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);

  const watchShopVideos = [
    {
      id: 'v1',
      slug: 'charcoal-detox-soap',
      title: 'Charcoal Detox Soap Batch Curing',
      price: '₹299',
      thumb: 'https://images.unsplash.com/photo-1607006482172-35891d9e1158?w=400&auto=format&fit=crop&q=80',
      videoBg: 'https://images.unsplash.com/photo-1607006482172-35891d9e1158?w=600&auto=format&fit=crop&q=80',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    {
      id: 'v2',
      slug: 'rose-hip-glow-serum',
      title: 'Rosehip Botanical Glow Oil Formulation',
      price: '₹499',
      thumb: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&auto=format&fit=crop&q=80',
      videoBg: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&auto=format&fit=crop&q=80',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    {
      id: 'v3',
      slug: 'monsoon-hydration-butter',
      title: 'Shea Butter Saponification Workshop',
      price: '₹399',
      thumb: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80',
      videoBg: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
  ];

  const categoryAvatars = [
    { title: 'Bath Soap', slug: 'bath-soap', image: 'https://images.unsplash.com/photo-1607006482172-35891d9e1158?w=300&auto=format&fit=crop&q=80' },
    { title: 'Herbal Soap', slug: 'herbal-soap', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&auto=format&fit=crop&q=80' },
    { title: 'Face Care', slug: 'face-care', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&auto=format&fit=crop&q=80' },
    { title: 'Body Care', slug: 'body-care', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&auto=format&fit=crop&q=80' },
    { title: 'Hair Care', slug: 'hair-care', image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&auto=format&fit=crop&q=80' },
    { title: 'Gift Sets', slug: 'gift-sets', image: 'https://images.unsplash.com/photo-1512290900676-26c2a48f4134?w=300&auto=format&fit=crop&q=80' },
  ];

  const concerns = ['Dry Skin', 'Acne Prone', 'Sensitive Skin', 'Anti-Aging', 'Glowing Skin'];

  const comboOffers = [
    {
      id: 'c1',
      slug: 'ultimate-spa-gift-pack',
      title: 'Ultimate Spa Gift Pack',
      subtitle: 'Includes 4 Premium Soaps + Loofah',
      price: '₹899',
      originalPrice: '₹1200',
      badge: 'Save 25%',
      bgColor: 'rgba(0, 39, 84, 0.08)',
      borderColor: 'rgba(0, 39, 84, 0.12)',
      badgeBg: '#002754',
      badgeText: 'white',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'c2',
      slug: 'family-essentials-bundle',
      title: 'Family Essentials Bundle',
      subtitle: 'Set of 10 Daily Use Soaps',
      price: '₹1499',
      originalPrice: '₹2000',
      badge: 'Save 30%',
      bgColor: 'rgba(70, 95, 138, 0.08)',
      borderColor: 'rgba(70, 95, 138, 0.12)',
      badgeBg: '#465F8A',
      badgeText: 'white',
      image: 'https://images.unsplash.com/photo-1607006314147-759088fd21c2?w=500&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FB' }}>
      {/* 1. FIXED TOP HEADER BAR */}
      <View style={{ zIndex: 100, elevation: 10, paddingHorizontal: CONTAINER_PADDING, paddingTop: 14, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(247, 249, 251, 0.95)', borderBottomWidth: 1, borderBottomColor: 'rgba(195, 198, 209, 0.3)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6 }}>
        <View style={{ width: 22 }} />
        <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 24, fontWeight: '700', color: '#002754', letterSpacing: -0.5 }}>
          CINMAX
        </Text>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => router.push('/wishlist' as any)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
            style={{ minWidth: 40, minHeight: 40, justifyContent: 'center', alignItems: 'center', position: 'relative' }}
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
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
            style={{ minWidth: 40, minHeight: 40, justifyContent: 'center', alignItems: 'center', position: 'relative' }}
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
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              activeOpacity={0.7}
              style={{ minWidth: 40, minHeight: 40, justifyContent: 'center', alignItems: 'center' }}
            >
              <User size={22} color="#002754" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* INTEGRATED SOFT LUXURY COSMETICS HERO REGION */}
        <View style={{ backgroundColor: '#FAF7F2', paddingTop: 16, paddingBottom: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, borderWidth: 1, borderColor: 'rgba(197, 168, 128, 0.25)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.05, shadowRadius: 16 }}>

          {/* 1. Search Bar & Announcement Chips */}
          <View style={{ paddingHorizontal: CONTAINER_PADDING, gap: 14 }}>
            <View style={{ backgroundColor: 'white', borderRadius: 25, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.35)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6 }}>
              <Search size={18} color="#737781" style={{ marginRight: 10 }} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => router.push('/search' as any)}
                placeholder="Search soaps, skincare and body care..."
                placeholderTextColor="#737781"
                style={{ fontFamily: FONT_SANS_REGULAR, flex: 1, fontSize: 14, color: '#191C1E' }}
              />
            </View>

            {activeOffers.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
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

          {/* 2. Visual Blended Hero Slideshow Card */}
          {heroSlidesToDisplay.length > 0 && (() => {
            const currentSlide = heroSlidesToDisplay[activeSlideIndex % heroSlidesToDisplay.length];
            const handlePrevSlide = () => {
              setActiveSlideIndex((prev) => (prev === 0 ? heroSlidesToDisplay.length - 1 : prev - 1));
            };
            const handleNextSlide = () => {
              setActiveSlideIndex((prev) => (prev + 1) % heroSlidesToDisplay.length);
            };

            return (
              <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 18, borderRadius: 26, overflow: 'hidden', height: 370, backgroundColor: '#002754', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.16, shadowRadius: 22, position: 'relative', borderWidth: 1, borderColor: 'rgba(197, 168, 128, 0.4)' }}>
                <Image
                  key={currentSlide.id || activeSlideIndex}
                  source={{ uri: currentSlide.imageUrl }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
                {/* Soft Ambient Overlay */}
                <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 31, 68, 0.45)' }} />

                {/* Prev / Next Controls */}
                <TouchableOpacity
                  onPress={handlePrevSlide}
                  style={{ position: 'absolute', left: 12, top: '46%', width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0, 39, 84, 0.6)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)', zIndex: 10 }}
                >
                  <ChevronLeft size={20} color="#C5A880" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleNextSlide}
                  style={{ position: 'absolute', right: 12, top: '46%', width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0, 39, 84, 0.6)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)', zIndex: 10 }}
                >
                  <ChevronRight size={20} color="#C5A880" />
                </TouchableOpacity>

                {/* Card Content Overlay */}
                <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 22, alignItems: 'center', backgroundColor: 'rgba(0, 24, 52, 0.52)' }}>
                  {currentSlide.kicker || currentSlide.badgeText ? (
                    <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#C5A880', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6, textAlign: 'center' }}>
                      {currentSlide.kicker || currentSlide.badgeText}
                    </Text>
                  ) : null}

                  <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: 'white', textAlign: 'center', marginBottom: 8, lineHeight: 28, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}>
                    {currentSlide.title}
                  </Text>
                  <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: 'rgba(255, 255, 255, 0.94)', textAlign: 'center', marginBottom: 16, lineHeight: 18 }} numberOfLines={2}>
                    {currentSlide.subtitle}
                  </Text>

                  <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <TouchableOpacity
                      onPress={() => router.push((currentSlide.ctaLink || '/shop') as any)}
                      style={{ backgroundColor: '#C5A880', paddingHorizontal: 22, paddingVertical: 10, borderRadius: 22, flexDirection: 'row', alignItems: 'center', gap: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 8 }}
                    >
                      <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#002754', fontWeight: '700', fontSize: 12 }}>
                        {currentSlide.ctaText || 'Explore the collection'}
                      </Text>
                      <ArrowRight size={14} color="#002754" />
                    </TouchableOpacity>

                    {currentSlide.secondaryCtaText ? (
                      <TouchableOpacity
                        onPress={() => router.push((currentSlide.secondaryCtaLink || '/shop') as any)}
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.18)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.45)', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 22, alignItems: 'center' }}
                      >
                        <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontWeight: '700', fontSize: 12 }}>
                          {currentSlide.secondaryCtaText}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>

                  {/* Dynamic Indicator Dots */}
                  <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 14 }}>
                    {heroSlidesToDisplay.map((_, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => setActiveSlideIndex(idx)}
                        style={{
                          width: activeSlideIndex === idx ? 22 : 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: activeSlideIndex === idx ? '#C5A880' : 'rgba(255, 255, 255, 0.45)',
                        }}
                      />
                    ))}
                  </View>
                </View>
              </View>
            );
          })()}
        </View>

        {/* 3. Shop By Category */}
        <View style={{ marginTop: 24, paddingHorizontal: CONTAINER_PADDING }}>
          <Text style={{ fontFamily: FONT_SERIF_SEMIBOLD, fontSize: 22, fontWeight: '500', color: '#002754', marginBottom: 14 }}>
            Shop By Category
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 20, paddingVertical: 4 }}>
            {(categories.length > 0 ? categories : categoryAvatars).map((cat: any, idx: number) => (
              <TouchableOpacity key={cat.id || idx} onPress={() => router.push(`/category/${cat.slug}` as any)} style={{ alignItems: 'center', gap: 6 }}>
                <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: 'white', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.2)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10 }}>
                  <Image source={{ uri: cat.image || cat.icon || 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=200&auto=format&fit=crop&q=80' }} style={{ width: '100%', height: '100%' }} />
                </View>
                <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 11, fontWeight: '600', color: '#191C1E' }}>{cat.name || cat.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 5. Watch & Shop */}
        <View style={{ marginTop: 28, paddingHorizontal: CONTAINER_PADDING }}>
          <Text style={{ fontFamily: FONT_SERIF_SEMIBOLD, fontSize: 22, fontWeight: '500', color: '#002754', marginBottom: 14 }}>
            Watch &amp; Shop
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14 }}>
            {watchShopVideos.map((vid) => (
              <TouchableOpacity key={vid.id} onPress={() => setSelectedVideoUrl((vid as any).videoUrl || vid.videoBg)} style={{ width: 170, height: 300, borderRadius: 18, overflow: 'hidden', backgroundColor: '#ECEEF0', position: 'relative' }}>
                <Image source={{ uri: vid.videoBg }} style={{ width: '100%', height: '100%' }} />
                <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' }}>
                  <PlayCircle size={44} color="white" />
                </View>
                <View style={{ position: 'absolute', bottom: 8, left: 8, right: 8, backgroundColor: 'rgba(255, 255, 255, 0.92)', borderRadius: 10, padding: 6, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: '#E0E3E5', overflow: 'hidden' }}>
                    <Image source={{ uri: vid.thumb }} style={{ width: '100%', height: '100%' }} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, fontWeight: '700', color: '#191C1E' }} numberOfLines={1}>{vid.title}</Text>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, fontWeight: '700', color: '#002754' }}>{vid.price}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 6. Shop By Concern */}
        <View style={{ marginTop: 28, paddingHorizontal: CONTAINER_PADDING }}>
          <Text style={{ fontFamily: FONT_SERIF_SEMIBOLD, fontSize: 22, fontWeight: '500', color: '#002754', marginBottom: 14 }}>
            Shop By Concern
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {concerns.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setActiveConcern(c)}
                style={{
                  paddingHorizontal: 18,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: activeConcern === c ? '#002754' : '#E6E8EA',
                  borderWidth: activeConcern === c ? 0 : 1,
                  borderColor: 'rgba(195, 198, 209, 0.3)',
                }}
              >
                <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 13, fontWeight: '600', color: activeConcern === c ? 'white' : '#434750' }}>{c}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 7. Best Sellers */}
        <View style={{ marginTop: 28, paddingHorizontal: CONTAINER_PADDING }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ fontFamily: FONT_SERIF_SEMIBOLD, fontSize: 22, fontWeight: '500', color: '#002754' }}>Best Sellers</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/shop' as any)}>
              <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 13, fontWeight: '600', color: '#002754' }}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {products.map((prod) => (
              <ProductCard
                key={prod.id}
                id={prod.id}
                title={prod.title}
                slug={prod.slug}
                price={prod.basePrice}
                originalPrice={prod.compareAtPrice ?? undefined}
                image={typeof prod.images?.[0] === 'string' ? prod.images[0] : prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&auto=format&fit=crop&q=80'}
                rating={prod.averageRating?.toString() || '4.95'}
                reviewCount={prod.reviewCount?.toString() || '128'}
                badge={prod.isFeatured ? 'HERO BAR' : 'TOP RATED'}
                badgeBg={prod.isFeatured ? '#002754' : '#365E9B'}
              />
            ))}
          </View>
        </View>

        {/* 8. Promotional Banner */}
        <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 28, borderRadius: 18, overflow: 'hidden', height: 150, backgroundColor: '#002754', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 10 }}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1000&auto=format&fit=crop&q=80' }}
            style={{ width: '100%', height: '100%', opacity: 0.6 }}
          />
          <View style={{ position: 'absolute', inset: 0, justifyContent: 'center', alignItems: 'center', padding: 14 }}>
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, fontWeight: '700', color: 'white', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 }}>
              Monsoon Magic Sale
            </Text>
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: 'white', marginBottom: 2 }}>
              Flat 40% OFF
            </Text>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: 'rgba(255, 255, 255, 0.85)', marginBottom: 12 }}>
              On all Gift Hampers &amp; Combo Packs
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/shop' as any)} style={{ backgroundColor: 'white', paddingHorizontal: 22, paddingVertical: 7, borderRadius: 18 }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#002754', fontWeight: '600', fontSize: 13 }}>Grab Now</Text>
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

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14, paddingBottom: 6 }}>
            {products.map((item) => (
              <TouchableOpacity key={item.id} onPress={() => router.push(`/product/${item.slug}` as any)} style={{ width: 140, gap: 6 }}>
                <View style={{ width: 140, height: 140, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.3)' }}>
                  <Image source={{ uri: typeof item.images?.[0] === 'string' ? item.images[0] : item.images?.[0]?.url || 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&auto=format&fit=crop&q=80' }} style={{ width: '100%', height: '100%' }} />
                </View>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, fontWeight: '700', color: '#191C1E' }} numberOfLines={1}>{item.title}</Text>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, fontWeight: '700', color: '#002754' }}>₹{item.basePrice}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 10. Combo Offers */}
        <View style={{ marginTop: 28, paddingHorizontal: CONTAINER_PADDING }}>
          <Text style={{ fontFamily: FONT_SERIF_SEMIBOLD, fontSize: 22, fontWeight: '500', color: '#002754', marginBottom: 14 }}>
            Combo Offers
          </Text>
          <View style={{ gap: 14 }}>
            {comboOffers.map((combo) => (
              <TouchableOpacity key={combo.id} onPress={() => router.push(`/product/${combo.slug}` as any)} style={{ backgroundColor: combo.bgColor, borderRadius: 16, padding: 14, flexDirection: 'row', gap: 14, borderWidth: 1, borderColor: combo.borderColor }}>
                <Image source={{ uri: combo.image }} style={{ width: 84, height: 84, borderRadius: 12 }} />
                <View style={{ flex: 1, justifyContent: 'space-between', paddingVertical: 2 }}>
                  <View>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 15, fontWeight: '700', color: '#002754' }}>{combo.title}</Text>
                    <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#434750', marginTop: 2 }}>{combo.subtitle}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 15, fontWeight: '700', color: '#002754' }}>
                      {combo.price} <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#737781', textDecorationLine: 'line-through', fontWeight: '400' }}>{combo.originalPrice}</Text>
                    </Text>
                    <View style={{ backgroundColor: combo.badgeBg, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 }}>
                      <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>{combo.badge}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 11. Real Results */}
        <View style={{ marginTop: 28, paddingHorizontal: CONTAINER_PADDING }}>
          <Text style={{ fontFamily: FONT_SERIF_SEMIBOLD, fontSize: 22, fontWeight: '500', color: '#002754', marginBottom: 14 }}>
            Real Results
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14 }}>
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
        <View style={{ marginTop: 28, paddingHorizontal: CONTAINER_PADDING, alignItems: 'center' }}>
          <Text style={{ fontFamily: FONT_SERIF_SEMIBOLD, fontSize: 22, fontWeight: '500', color: '#002754', textAlign: 'center', marginBottom: 20 }}>
            Why Choose CINMAX?
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 20, width: '100%' }}>
            {trustBadges.map((badge, idx) => {
              const IconComp = badge.icon;
              return (
                <View key={idx} style={{ width: '28%', alignItems: 'center', gap: 6 }}>
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0, 39, 84, 0.08)', justifyContent: 'center', alignItems: 'center' }}>
                    <IconComp size={22} color="#002754" />
                  </View>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, fontWeight: '700', color: '#191C1E', textAlign: 'center' }}>{badge.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* 13. Manufacturing Banner */}
        <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 28, borderRadius: 18, overflow: 'hidden', height: 230, backgroundColor: '#002754', position: 'relative' }}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1607006482172-35891d9e1158?w=1000&auto=format&fit=crop&q=80' }}
            style={{ width: '100%', height: '100%' }}
          />
          <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 39, 84, 0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 24, fontWeight: '600', color: 'white', textAlign: 'center', marginBottom: 6 }}>
              Crafted with Quality
            </Text>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: 'white', textAlign: 'center', maxWidth: 260, lineHeight: 20 }}>
              Our state-of-the-art facility ensures every bar of soap meets global standards of purity and excellence.
            </Text>
            <TouchableOpacity style={{ marginTop: 14, borderWidth: 1, borderColor: 'white', paddingHorizontal: 22, paddingVertical: 7, borderRadius: 18 }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontWeight: '700', fontSize: 13 }}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      {/* YOUTUBE VIDEO PLAYER MODAL */}
      {selectedVideoUrl && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={!!selectedVideoUrl}
          onRequestClose={() => setSelectedVideoUrl(null)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
            <TouchableOpacity
              onPress={() => setSelectedVideoUrl(null)}
              style={{ position: 'absolute', top: 50, right: 24, zIndex: 10, backgroundColor: '#002754', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }}
            >
              <Text style={{ color: 'white', fontWeight: '700', fontSize: 13 }}>Close ✕</Text>
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
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                  <Text style={{ color: 'white', fontSize: 13, textAlign: 'center' }}>Playing YouTube Video: {selectedVideoUrl}</Text>
                </View>
              )}
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}
