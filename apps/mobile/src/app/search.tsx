import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ProductCard } from '../components/ProductCard';
import { useProductsQuery } from '@cinmax/hooks';
import type { Product } from '@cinmax/types';
import { ArrowLeft, Search as SearchIcon, X, Star } from 'lucide-react-native';

const CONTAINER_PADDING = 20;

const FONT_SERIF_BOLD = Platform.select({
  web: "'Noto Serif', Georgia, serif",
  default: 'NotoSerif_700Bold',
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

import { getProductFallbackImage } from '@cinmax/utils';

export default function MobileSearchScreen() {
  const router = useRouter();
  const { query: initialQuery } = useLocalSearchParams<{ query?: string }>();
  const [query, setQuery] = useState(initialQuery || '');

  const searchSuggestions = ['Saffron Soap', 'Sandalwood', 'Charcoal Detox', 'Lavender Oil', 'Face Serum'];

  const { data: productsData, isLoading } = useProductsQuery();

  const liveResults = React.useMemo(() => {
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
        price: `₹${p.basePrice}`,
        originalPrice: p.compareAtPrice ? `₹${p.compareAtPrice}` : undefined,
        rating: `${p.averageRating || 4.9}`,
        image: validImage,
        minOrderQuantity: p.minOrderQuantity,
        quantityPrice: p.quantityPrice,
      });
    }
    return list;
  }, [productsData?.items]);

  const filteredResults = liveResults.filter((p) =>
    !query.trim() || p.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FB' }}>
      {/* Header & Search Input */}
      <View style={{ paddingHorizontal: CONTAINER_PADDING, paddingTop: 14, paddingBottom: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: 'rgba(195, 198, 209, 0.3)', gap: 14, zIndex: 100, elevation: 10 }}>
        <TouchableOpacity
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)' as any))}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={{ width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
        >
          <ArrowLeft size={22} color="#002754" />
        </TouchableOpacity>

        <View style={{ backgroundColor: '#F2F4F6', borderRadius: 25, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.3)' }}>
          <SearchIcon size={18} color="#737781" style={{ marginRight: 10 }} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search soaps, serums, body care..."
            placeholderTextColor="#737781"
            style={{ fontFamily: FONT_SANS_REGULAR, flex: 1, fontSize: 14, color: '#191C1E' }}
          />
          {query ? (
            <TouchableOpacity onPress={() => setQuery('')} style={{ padding: 4 }}>
              <X size={18} color="#737781" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">

        {/* Popular Searches */}
        {!query && (
          <View style={{ paddingHorizontal: CONTAINER_PADDING, marginTop: 20 }}>
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, fontWeight: '700', color: '#002754', marginBottom: 12 }}>
              Popular Searches
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {searchSuggestions.map((sug) => (
                <TouchableOpacity
                  key={sug}
                  onPress={() => setQuery(sug)}
                  style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.3)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 }}
                >
                  <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 12, color: '#002754' }}>{sug}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Search Results */}
        <View style={{ paddingHorizontal: CONTAINER_PADDING, marginTop: 20 }}>
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, fontWeight: '700', color: '#002754', marginBottom: 14 }}>
            {query ? `Results for "${query}"` : 'Top Trending Products'}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 14 }}>
            {filteredResults.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                title={item.title}
                slug={item.slug}
                price={item.price}
                image={item.image}
                rating={item.rating}
                badge="TRENDING"
                badgeBg="#365E9B"
                minOrderQuantity={item.minOrderQuantity}
                quantityPrice={item.quantityPrice}
              />
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
