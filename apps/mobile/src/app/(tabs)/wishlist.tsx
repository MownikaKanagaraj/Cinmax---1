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
import { useCartStore, useWishlistStore } from '@cinmax/hooks';
import {
  ArrowLeft,
  ShoppingBag,
  Search,
  Heart,
  Trash2,
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

export default function MobileWishlistScreen() {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { items: wishlistItems, toggleItem, clearWishlist } = useWishlistStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = wishlistItems.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FB' }}>
      {/* Header Bar */}
      <View style={{ paddingHorizontal: CONTAINER_PADDING, paddingTop: 14, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderBottomWidth: 1, borderBottomColor: 'rgba(195, 198, 209, 0.3)' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <ArrowLeft size={22} color="#002754" />
        </TouchableOpacity>
        <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: '#002754', letterSpacing: -0.5 }}>
          My Wishlist
        </Text>
        <TouchableOpacity onPress={() => router.push('/cart' as any)} style={{ padding: 4 }}>
          <ShoppingBag size={22} color="#002754" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={{ paddingHorizontal: CONTAINER_PADDING, paddingTop: 16 }}>
          {/* Top Banner / Actions */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 13, color: '#64748B' }}>
              {wishlistItems.length} Saved {wishlistItems.length === 1 ? 'Item' : 'Items'}
            </Text>
            {wishlistItems.length > 0 && (
              <TouchableOpacity onPress={clearWishlist}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#DC2626' }}>
                  Clear All
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Search Bar */}
          {wishlistItems.length > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 14, height: 46, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.4)', marginBottom: 20 }}>
              <Search size={18} color="#64748B" style={{ marginRight: 10 }} />
              <TextInput
                placeholder="Search saved favorites..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#94A3B8"
                style={{ flex: 1, fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#002754' }}
              />
            </View>
          )}

          {/* Empty State */}
          {wishlistItems.length === 0 ? (
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 36, alignItems: 'center', borderStyle: 'solid', borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.3)', marginTop: 20 }}>
              <Heart size={44} color="#94A3B8" style={{ marginBottom: 12 }} />
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, color: '#002754', marginBottom: 6 }}>
                Your Wishlist is Empty
              </Text>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 20, lineHeight: 18 }}>
                Save your favorite artisanal soap bars, organic balms, and luxury cleansers while exploring.
              </Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/shop' as any)} style={{ backgroundColor: '#002754', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, color: '#FFFFFF' }}>
                  Explore Shop
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ gap: 16 }}>
              {filteredProducts.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => router.push(`/product/${p.slug}` as any)}
                  style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 14, flexDirection: 'row', gap: 14, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.3)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6 }}
                >
                  <Image source={{ uri: p.images?.[0] || 'https://images.unsplash.com/photo-1607006482602-7650d2037422?w=400' }} style={{ width: 72, height: 72, borderRadius: 14 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: FONT_SERIF_SEMIBOLD, fontSize: 14, color: '#002754' }} numberOfLines={1}>
                      {p.title}
                    </Text>
                    <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#64748B', marginTop: 2 }} numberOfLines={1}>
                      {p.subtitle || p.categoryName || 'Artisanal Soap'}
                    </Text>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#002754', marginTop: 6 }}>
                      ₹{p.price}
                    </Text>
                  </View>
                  <View style={{ gap: 8, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => toggleItem(p)} style={{ padding: 6 }}>
                      <Trash2 size={18} color="#DC2626" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => addItem({ id: p.id, productId: p.id, variantId: p.variants?.[0]?.id || p.id, quantity: 1, unitPrice: p.price, productTitle: p.title, imageUrl: p.images?.[0] })}
                      style={{ backgroundColor: '#002754', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 }}
                    >
                      <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, color: '#FFFFFF', textTransform: 'uppercase' }}>
                        + Add
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
