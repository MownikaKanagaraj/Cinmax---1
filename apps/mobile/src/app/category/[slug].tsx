import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCategoryBySlugQuery, useProductsByCategoryQuery } from '@cinmax/hooks';
import { ProductCard } from '../../components/ProductCard';
import { ArrowLeft, Sparkles, Filter } from 'lucide-react-native';
import type { Product } from '@cinmax/types';

const FONT_SERIF_BOLD = Platform.select({
  web: "'Noto Serif', Georgia, serif",
  default: 'NotoSerif_700Bold',
});

const FONT_SANS_REGULAR = Platform.select({
  web: "'Plus Jakarta Sans', system-ui, sans-serif",
  default: 'PlusJakartaSans_400Regular',
});

const FONT_SANS_BOLD = Platform.select({
  web: "'Plus Jakarta Sans', system-ui, sans-serif",
  default: 'PlusJakartaSans_700Bold',
});

import { getProductFallbackImage } from '@cinmax/utils';

export default function MobileCategoryScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const categorySlug = slug || 'cold-process-soaps';

  const { data: category, isLoading: isCatLoading } = useCategoryBySlugQuery(categorySlug);
  const { data: productsData, isLoading: isProdsLoading } = useProductsByCategoryQuery(categorySlug);

  const products: Product[] = React.useMemo(() => {
    const rawProducts: Product[] = productsData?.items || [];
    const seen = new Set<string>();
    const list: Product[] = [];

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

      list.push(p);
    }
    return list;
  }, [productsData?.items]);

  const isLoading = isCatLoading || isProdsLoading;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FB' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <TouchableOpacity
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)' as any))}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={{ marginBottom: 12, minHeight: 40, flexDirection: 'row', alignItems: 'center', gap: 6 }}
        >
          <ArrowLeft size={20} color="#002754" />
          <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, fontWeight: '700', color: '#002754' }}>
            Back to Categories
          </Text>
        </TouchableOpacity>

        <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, fontWeight: '800', letterSpacing: 2, color: '#C5A880', textTransform: 'uppercase' }}>
          Botanical Collection
        </Text>
        <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 24, fontWeight: '700', color: '#002754', marginTop: 2 }}>
          {category?.name || 'Artisanal Collection'}
        </Text>
        <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#64748B', marginTop: 4, marginBottom: 20, lineHeight: 18 }}>
          {category?.description || 'Pure formulations crafted with botanical precision.'}
        </Text>

        {isLoading ? (
          <View style={{ paddingVertical: 60, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#002754" />
            <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#465F8A', marginTop: 12, fontSize: 13 }}>
              Loading collection products...
            </Text>
          </View>
        ) : products.length === 0 ? (
          <View style={{ paddingVertical: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.3)' }}>
            <Filter size={32} color="#002754" style={{ marginBottom: 12 }} />
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, fontWeight: '700', color: '#002754', textAlign: 'center', marginBottom: 6 }}>
              No products currently in this collection
            </Text>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 16 }}>
              Check back soon or explore our full artisanal catalog.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/shop' as any)}
              style={{ backgroundColor: '#002754', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 }}
            >
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 12, fontWeight: '700' }}>
                Browse All Products
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {products.map((prod: Product) => {
              const specificFallback = getProductFallbackImage(prod.slug || prod.title, 1);
              const rawImg = typeof prod.images?.[0] === 'string' ? prod.images[0] : prod.images?.[0]?.url;
              const validImg = rawImg && !rawImg.includes('audit-test') ? rawImg : specificFallback;

              return (
                <ProductCard
                  key={prod.id}
                  id={prod.id}
                  title={prod.title}
                  slug={prod.slug}
                  price={prod.basePrice}
                  originalPrice={prod.compareAtPrice ?? undefined}
                  image={validImg}
                  rating={prod.averageRating?.toString() || '4.9'}
                  reviewCount={prod.reviewCount?.toString() || '128'}
                  minOrderQuantity={prod.minOrderQuantity}
                  quantityPrice={prod.quantityPrice}
                />
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
