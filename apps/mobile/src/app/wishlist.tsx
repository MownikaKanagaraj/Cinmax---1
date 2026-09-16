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
  Sparkles,
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
  const { addItem, items: cartItems } = useCartStore();
  const { items: wishlistItems, toggleWishlist, clearWishlist } = useWishlistStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = wishlistItems.filter((p) =>
    (p.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF7F2' }}>
      {/* 1. Header Bar */}
      <View
        style={{
          paddingHorizontal: CONTAINER_PADDING,
          paddingTop: 14,
          paddingBottom: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(195, 198, 209, 0.3)',
          zIndex: 10,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <ArrowLeft size={22} color="#002754" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Heart size={20} color="#DC2626" fill="#DC2626" />
          <Text
            style={{
              fontFamily: FONT_SERIF_BOLD,
              fontSize: 22,
              fontWeight: '700',
              color: '#002754',
              letterSpacing: -0.5,
            }}
          >
            My Wishlist
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/cart' as any)} style={{ padding: 4, position: 'relative' }}>
          <ShoppingBag size={22} color="#002754" />
          {cartItems.length > 0 && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: '#002754',
                width: 16,
                height: 16,
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700' }}>
                {cartItems.length}
              </Text>
            </View>
          )}
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                paddingHorizontal: 14,
                height: 46,
                borderWidth: 1,
                borderColor: 'rgba(195, 198, 209, 0.4)',
                marginBottom: 20,
              }}
            >
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
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 24,
                padding: 36,
                alignItems: 'center',
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: 'rgba(195, 198, 209, 0.3)',
                marginTop: 20,
              }}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: 'rgba(220, 38, 38, 0.08)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <Heart size={32} color="#DC2626" fill="rgba(220, 38, 38, 0.2)" />
              </View>
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, color: '#002754', marginBottom: 6 }}>
                Your Wishlist is Empty
              </Text>
              <Text
                style={{
                  fontFamily: FONT_SANS_REGULAR,
                  fontSize: 13,
                  color: '#64748B',
                  textAlign: 'center',
                  marginBottom: 20,
                  lineHeight: 19,
                }}
              >
                Save your favorite artisanal soap bars, organic balms, and luxury cleansers while exploring.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/shop' as any)}
                style={{
                  backgroundColor: '#002754',
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 24,
                }}
              >
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, color: '#FFFFFF' }}>
                  Explore Shop
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ gap: 16 }}>
              {filteredProducts.map((p) => {
                const imgUri = typeof p.images?.[0] === 'string'
                  ? p.images[0]
                  : p.images?.[0]?.url || 'https://images.unsplash.com/photo-1607006482602-7650d2037422?w=400';
                const itemPrice = p.basePrice || (p as any).price || 299;
                return (
                  <TouchableOpacity
                    key={p.id}
                    onPress={() => router.push(`/product/${p.slug}` as any)}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 20,
                      padding: 14,
                      flexDirection: 'row',
                      gap: 14,
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: 'rgba(195, 198, 209, 0.3)',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.04,
                      shadowRadius: 6,
                    }}
                  >
                    <Image source={{ uri: imgUri }} style={{ width: 76, height: 76, borderRadius: 14 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: FONT_SERIF_SEMIBOLD, fontSize: 15, color: '#002754' }} numberOfLines={1}>
                        {p.title}
                      </Text>
                      <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#64748B', marginTop: 2 }} numberOfLines={1}>
                        {p.subtitle || p.category?.name || 'Artisanal Soap'}
                      </Text>
                      <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 15, color: '#002754', marginTop: 6 }}>
                        ₹{itemPrice}
                      </Text>
                    </View>
                    <View style={{ gap: 10, alignItems: 'center' }}>
                      <TouchableOpacity onPress={() => toggleWishlist(p)} style={{ padding: 6 }}>
                        <Trash2 size={18} color="#DC2626" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          addItem({
                            id: p.id,
                            productId: p.id,
                            variantId: p.variants?.[0]?.id || p.id,
                            quantity: 1,
                            unitPrice: itemPrice,
                            productTitle: p.title,
                            imageUrl: imgUri,
                          })
                        }
                        style={{ backgroundColor: '#002754', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 }}
                      >
                        <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: '#FFFFFF', textTransform: 'uppercase' }}>
                          + Add
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}
