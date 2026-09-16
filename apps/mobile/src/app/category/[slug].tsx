import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCategoryBySlugQuery, useProductsByCategoryQuery } from '@cinmax/hooks';
import type { Product } from '@cinmax/types';

export default function MobileCategoryScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const categorySlug = slug || 'cold-process-soaps';

  const { data: category } = useCategoryBySlugQuery(categorySlug);
  const { data: productsData } = useProductsByCategoryQuery(categorySlug);
  const products: Product[] = productsData?.items || [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FB' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        <TouchableOpacity
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)' as any))}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={{ marginBottom: 12, minHeight: 40, justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#0A3D78' }}>
            ← Back
          </Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 10, fontWeight: '800', letterSpacing: 2, color: '#C5A880', textTransform: 'uppercase' }}>
          Collection
        </Text>
        <Text style={{ fontSize: 24, fontWeight: '900', color: '#002754', marginTop: 2 }}>
          {category?.name || 'Botanical Collection'}
        </Text>
        <Text style={{ fontSize: 12, color: '#64748B', marginTop: 4, marginBottom: 20 }}>
          {category?.description || 'Formulations crafted with artisanal precision.'}
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 14 }}>
          {products.map((prod: Product) => (
            <TouchableOpacity
              key={prod.id}
              onPress={() => router.push(`/product/${prod.slug}` as any)}
              style={{ width: '48%', backgroundColor: 'white', borderRadius: 20, padding: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 }}
            >
              <Image
                source={{ uri: prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&auto=format&fit=crop&q=80' }}
                style={{ width: '100%', height: 130, borderRadius: 14 }}
              />
              <View style={{ marginTop: 10, gap: 2 }}>
                <Text style={{ fontSize: 12, fontWeight: '800', color: '#002754' }} numberOfLines={2}>
                  {prod.title}
                </Text>
                <Text style={{ fontSize: 12, fontWeight: '800', color: '#0A3D78', marginTop: 4 }}>
                  ₹{prod.variants?.[0]?.price || prod.basePrice || 199}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
