import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ProductCard } from '../../components/ProductCard';
import { useCartStore, useWishlistStore, useProductsQuery, useCategoriesQuery } from '@cinmax/hooks';
import type { Product, Category } from '@cinmax/types';
import {
  ArrowLeft,
  Search,
  ShoppingBag,
  Heart,
  X,
  Mic,
  ArrowUpDown,
  Filter as FilterIcon,
  Star,
  Sparkles,
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
  const { data: productsData, isLoading } = useProductsQuery();
  const { data: categoriesData = [] } = useCategoriesQuery();

  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, []);

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryPills = ['All', ...categoriesData.map((c: Category) => c.name)];

  const rawProducts: Product[] = productsData?.items || [];
  const liveProducts = rawProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    categoryName: p.categoryName || 'Botanical Soap',
    price: `₹${p.basePrice}`,
    originalPrice: p.compareAtPrice ? `₹${p.compareAtPrice}` : undefined,
    rating: `${p.averageRating || 4.9}`,
    reviewCount: `${p.reviewCount || 128}`,
    badge: p.isFeatured ? 'Hero Bar' : p.isNew ? 'New Batch' : 'Handcrafted',
    badgeBg: p.isFeatured ? '#002754' : '#C5A880',
    image: typeof p.images?.[0] === 'string' ? p.images[0] : p.images?.[0]?.url || 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&auto=format&fit=crop&q=80',
  }));

  const filteredProducts = liveProducts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === 'All' ||
      p.categoryName.toLowerCase().includes(activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FB' }}>
      {/* 1. TOP HEADER BAR */}
      <View style={{ zIndex: 100, paddingHorizontal: CONTAINER_PADDING, paddingTop: 14, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.95)', borderBottomWidth: 1, borderBottomColor: 'rgba(195, 198, 209, 0.3)' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <ArrowLeft size={22} color="#002754" />
        </TouchableOpacity>
        <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: '#002754', letterSpacing: -0.5 }}>
          Botanical Catalog
        </Text>
        <TouchableOpacity onPress={() => router.push('/cart' as any)} style={{ padding: 4 }}>
          <ShoppingBag size={22} color="#002754" />
        </TouchableOpacity>
      </View>

      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>

        {/* 2. Search Bar */}
        <View style={{ paddingHorizontal: CONTAINER_PADDING, marginTop: 16 }}>
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 46, shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.04, shadowRadius: 8, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.35)' }}>
            <Search size={18} color="#434750" style={{ marginRight: 10 }} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search botanical bars, balms & cleansers..."
              placeholderTextColor="#737781"
              style={{ fontFamily: FONT_SANS_REGULAR, flex: 1, fontSize: 13, color: '#191C1E' }}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
                <X size={18} color="#737781" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* 3. Categories Pill Bar */}
        <View style={{ marginTop: 14 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: CONTAINER_PADDING }}>
            {categoryPills.map((cat) => {
              const active = activeCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setActiveCategory(cat)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 7,
                    borderRadius: 20,
                    backgroundColor: active ? '#002754' : '#FFFFFF',
                    borderWidth: 1,
                    borderColor: active ? '#002754' : 'rgba(195, 198, 209, 0.4)',
                  }}
                >
                  <Text style={{ fontFamily: active ? FONT_SANS_BOLD : FONT_SANS_SEMIBOLD, fontSize: 12, color: active ? '#FFFFFF' : '#002754' }}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 4. Toolbar Count */}
        <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 13, color: '#434750' }}>
            Showing {filteredProducts.length} Artisanal Products
          </Text>
        </View>

        {/* 5. Product Grid */}
        <View style={{ paddingHorizontal: CONTAINER_PADDING, marginTop: 14 }}>
          {isLoading ? (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#64748B' }}>
                Loading live catalog from database...
              </Text>
            </View>
          ) : filteredProducts.length === 0 ? (
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.3)', marginTop: 10 }}>
              <Sparkles size={40} color="#94A3B8" style={{ marginBottom: 12 }} />
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, color: '#002754', marginBottom: 6 }}>
                No Formulations Found
              </Text>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 16 }}>
                Try adjusting your search terms or category selection.
              </Text>
              <TouchableOpacity onPress={() => { setActiveCategory('All'); setSearchQuery(''); }} style={{ backgroundColor: '#002754', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#FFFFFF' }}>
                  Reset Filters
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  id={prod.id}
                  title={prod.title}
                  slug={prod.slug}
                  price={prod.price}
                  originalPrice={prod.originalPrice}
                  image={prod.image}
                  rating={prod.rating}
                  reviewCount={prod.reviewCount}
                  badge={prod.badge}
                  badgeBg={prod.badgeBg}
                />
              ))}
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
