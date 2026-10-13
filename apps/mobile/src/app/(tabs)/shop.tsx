import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ProductCard } from '../../components/ProductCard';
import { LOCAL_SOAP_ASSETS } from '../../constants/soapAssets';
import { getProductFallbackImage } from '@cinmax/utils';
import {
  useCartStore,
  useWishlistStore,
  useProductsQuery,
  useCategoriesQuery,
  useUser,
  useUnreadNotificationsCountQuery,
} from '@cinmax/hooks';
import type { Product, Category } from '@cinmax/types';
import {
  ArrowLeft,
  Search,
  ShoppingBag,
  Heart,
  X,
  ArrowUpDown,
  Filter as FilterIcon,
  Sparkles,
  SlidersHorizontal,
  RefreshCw,
  Bell,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTAINER_PADDING = 16;

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

export default function MobileShopScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { data: unreadNotificationsCount = 0 } = useUnreadNotificationsCountQuery(user?.id);
  const params = useLocalSearchParams<{ category?: string; concern?: string; title?: string }>();
  const { data: productsData, isLoading, refetch } = useProductsQuery();
  const { data: categoriesData = [] } = useCategoriesQuery();
  const { items: wishlistItems } = useWishlistStore();
  const { items: cartItems } = useCartStore();
  const totalCartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const scrollViewRef = React.useRef<ScrollView>(null);

  const [activeCategory, setActiveCategory] = useState<string>(params.category || 'All');
  const [activeConcern, setActiveConcern] = useState<string>(params.concern || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');

  useEffect(() => {
    if (params.category) {
      setActiveCategory(params.category);
    }
    if (params.concern) {
      setActiveConcern(params.concern);
    }
  }, [params.category, params.concern]);

  React.useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, []);

  const categoryPills = ['All', ...categoriesData.map((c: Category) => c.name)];

  const liveProducts = React.useMemo(() => {
    const rawProducts: Product[] = productsData?.items || [];
    const seen = new Set<string>();
    const list: any[] = [];

    for (const p of rawProducts) {
      if (!p || p.isActive === false) continue;
      const lowerTitle = (p.title || '').trim().toLowerCase();
      const lowerSlug = (p.slug || '').trim().toLowerCase();

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

      const dedupeKey = lowerSlug || lowerTitle || p.id;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      const specificSoapImage = getProductFallbackImage(p.slug || p.title, 1);
      const rawImg = typeof p.images?.[0] === 'string' ? p.images[0] : p.images?.[0]?.url;
      const validImage = rawImg && !rawImg.includes('audit-test') ? rawImg : specificSoapImage;

      list.push({
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description || '',
        categoryName: p.category?.name || 'Botanical Soap',
        categorySlug: p.category?.slug || '',
        skinTypes: (p.skinTypes || []) as string[],
        numericPrice: p.basePrice,
        price: `₹${p.basePrice}`,
        originalPrice: p.compareAtPrice ? `₹${p.compareAtPrice}` : undefined,
        rating: `${p.averageRating || 4.9}`,
        reviewCount: `${p.reviewCount || 128}`,
        image: validImage,
        minOrderQuantity: p.minOrderQuantity,
        quantityPrice: p.quantityPrice,
      });
    }
    return list;
  }, [productsData?.items]);

  const filteredProducts = liveProducts
    .filter((p) => {
      const matchesSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === 'All' ||
        p.categoryName.toLowerCase() === activeCategory.toLowerCase() ||
        p.categoryName.toLowerCase().includes(activeCategory.toLowerCase()) ||
        p.categorySlug.toLowerCase() === activeCategory.toLowerCase();

      const matchesConcern =
        !activeConcern ||
        activeConcern === 'all' ||
        p.skinTypes.some((st: string) => st.toLowerCase().includes(activeConcern.toLowerCase())) ||
        (activeConcern === 'dry' && (p.title.toLowerCase().includes('dry') || p.skinTypes.some((s: string) => s.toLowerCase().includes('dry')))) ||
        (activeConcern === 'oily' && (p.title.toLowerCase().includes('ash') || p.title.toLowerCase().includes('charcoal') || p.skinTypes.some((s: string) => s.toLowerCase().includes('oily')))) ||
        (activeConcern === 'sensitive' && (p.title.toLowerCase().includes('lavender') || p.title.toLowerCase().includes('sensitive') || p.skinTypes.some((s: string) => s.toLowerCase().includes('sensitive')))) ||
        (activeConcern === 'mature' && (p.title.toLowerCase().includes('rose') || p.title.toLowerCase().includes('anti') || p.skinTypes.some((s: string) => s.toLowerCase().includes('mature')))) ||
        (activeConcern === 'combination' && (p.skinTypes.some((s: string) => s.toLowerCase().includes('combination') || s.toLowerCase().includes('all'))));

      return matchesSearch && matchesCategory && matchesConcern;
    })
    .sort((a, b) => {
      if (sortBy === 'price_low') return a.numericPrice - b.numericPrice;
      if (sortBy === 'price_high') return b.numericPrice - a.numericPrice;
      if (sortBy === 'rating') return parseFloat(b.rating) - parseFloat(a.rating);
      return 0;
    });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF7F2' }}>
      {/* 1. TOP HEADER BAR */}
      <View style={{ zIndex: 100, elevation: 10, paddingHorizontal: CONTAINER_PADDING, paddingTop: 14, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: 'rgba(197, 168, 128, 0.25)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6 }}>
        <TouchableOpacity
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)' as any))}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
          style={{ minWidth: 40, minHeight: 40, justifyContent: 'center', alignItems: 'center' }}
        >
          <ArrowLeft size={22} color="#002754" />
        </TouchableOpacity>

        <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: '#002754', letterSpacing: -0.3 }}>
          Shop Cosmetics
        </Text>

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
        </View>
      </View>

      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">

        {/* 2. GRAND CATALOG HERO BANNER */}
        <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 16, borderRadius: 24, overflow: 'hidden', height: 180, backgroundColor: '#002754', position: 'relative', borderWidth: 1, borderColor: 'rgba(197, 168, 128, 0.35)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 14 }}>
          <Image
            source={LOCAL_SOAP_ASSETS['aroma-soap']}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 31, 68, 0.48)' }} />

          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'rgba(197, 168, 128, 0.25)', borderWidth: 1, borderColor: '#C5A880', paddingHorizontal: 12, paddingVertical: 3, borderRadius: 16, marginBottom: 6 }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#F3E5D8', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2 }}>
                CINMAX COSMETICS CATALOG
              </Text>
            </View>
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: 'white', textAlign: 'center', marginBottom: 4 }}>
              Artisanal Formulations
            </Text>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: 'rgba(255, 255, 255, 0.92)', textAlign: 'center', maxWidth: 360 }}>
              Pure botanical elixirs, cold-process soap therapeutics, and organic beauty hampers.
            </Text>
          </View>
        </View>

        {/* 3. SEARCH BAR */}
        <View style={{ paddingHorizontal: CONTAINER_PADDING, marginTop: 16 }}>
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48, shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.04, shadowRadius: 8, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.35)' }}>
            <Search size={18} color="#737781" style={{ marginRight: 10 }} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search soaps, skincare, oils & hampers..."
              placeholderTextColor="#737781"
              style={{ fontFamily: FONT_SANS_REGULAR, flex: 1, fontSize: 14, color: '#191C1E' }}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
                <X size={18} color="#737781" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* 4. CATEGORY FILTER PILLS */}
        <View style={{ marginTop: 14 }}>
          <ScrollView horizontal nestedScrollEnabled={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: CONTAINER_PADDING }}>
            {categoryPills.map((cat) => {
              const active = activeCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setActiveCategory(cat)}
                  style={{
                    paddingHorizontal: 18,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: active ? '#002754' : '#FFFFFF',
                    borderWidth: 1,
                    borderColor: active ? '#002754' : 'rgba(195, 198, 209, 0.4)',
                    shadowColor: '#0A3D78',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: active ? 0.1 : 0.02,
                    shadowRadius: 4,
                  }}
                >
                  <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 12, fontWeight: '600', color: active ? 'white' : '#434750' }}>{cat}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 4.5. CONCERN FILTER PILLS / ACTIVE CHIP */}
        <View style={{ marginTop: 10 }}>
          <ScrollView
            horizontal
            nestedScrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={{ gap: 8, paddingHorizontal: CONTAINER_PADDING }}
          >
            {[
              { id: 'all', title: 'All Concerns' },
              { id: 'dry', title: 'Dry Skin' },
              { id: 'oily', title: 'Acne Prone' },
              { id: 'sensitive', title: 'Sensitive Skin' },
              { id: 'mature', title: 'Anti-Aging' },
              { id: 'combination', title: 'Glowing Skin' },
            ].map((con) => {
              const active = activeConcern === con.id;
              return (
                <TouchableOpacity
                  key={con.id}
                  onPress={() => setActiveConcern(con.id)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                    borderRadius: 16,
                    backgroundColor: active ? '#C5A880' : '#FFFFFF',
                    borderWidth: 1,
                    borderColor: active ? '#C5A880' : 'rgba(195, 198, 209, 0.35)',
                    flexShrink: 0,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONT_SANS_SEMIBOLD,
                      fontSize: 12,
                      fontWeight: '600',
                      color: active ? '#002754' : '#737781',
                      includeFontPadding: false,
                      flexShrink: 0,
                    }}
                  >
                    {con.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 5. SORT BAR */}
        <View style={{ paddingHorizontal: CONTAINER_PADDING, marginTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#737781' }}>
            Showing <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#002754' }}>{filteredProducts.length}</Text> items
          </Text>

          <ScrollView horizontal nestedScrollEnabled={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
            {[
              { label: 'Featured', value: 'featured' },
              { label: 'Price: Low-High', value: 'price_low' },
              { label: 'Price: High-Low', value: 'price_high' },
              { label: 'Top Rated', value: 'rating' },
            ].map((opt) => {
              const selected = sortBy === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setSortBy(opt.value as any)}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12,
                    backgroundColor: selected ? 'rgba(0, 39, 84, 0.1)' : 'transparent',
                  }}
                >
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, fontWeight: '700', color: selected ? '#002754' : '#737781' }}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 6. PRODUCT GRID / LOADING / EMPTY STATE */}
        {isLoading ? (
          <View style={{ paddingVertical: 60, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#002754" />
            <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, marginTop: 14, fontSize: 13, color: '#465F8A' }}>
              Loading botanical catalog...
            </Text>
          </View>
        ) : filteredProducts.length === 0 ? (
          <View style={{ paddingVertical: 60, paddingHorizontal: 30, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(0, 39, 84, 0.08)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
              <FilterIcon size={28} color="#002754" />
            </View>
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, fontWeight: '700', color: '#002754', textAlign: 'center', marginBottom: 6 }}>
              No matching products found
            </Text>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#737781', textAlign: 'center', marginBottom: 20 }}>
              Try adjusting your category, concern, or search query to find artisanal items.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setActiveCategory('All');
                setActiveConcern('all');
                setSearchQuery('');
              }}
              style={{ backgroundColor: '#002754', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 }}
            >
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 13, fontWeight: '700' }}>
                Reset All Filters
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ paddingHorizontal: CONTAINER_PADDING, marginTop: 16, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                id={prod.id}
                title={prod.title}
                slug={prod.slug}
                price={prod.numericPrice}
                originalPrice={prod.originalPrice ? parseFloat(prod.originalPrice.replace('₹', '')) : undefined}
                image={prod.image}
                rating={prod.rating}
                reviewCount={prod.reviewCount}
                badge={prod.badge}
                badgeBg={prod.badgeBg}
                minOrderQuantity={prod.minOrderQuantity}
                quantityPrice={prod.quantityPrice}
              />
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
