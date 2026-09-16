import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Star, Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useWishlistStore, useCartStore } from '@cinmax/hooks';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

export interface ProductCardProps {
  id: string;
  title: string;
  slug: string;
  price: string | number;
  originalPrice?: string | number;
  image: string;
  rating?: string | number;
  reviewCount?: string | number;
  badge?: string;
  badgeBg?: string;
  width?: number | string;
}

export function ProductCard({
  id,
  title,
  slug,
  price,
  originalPrice,
  image,
  rating = '4.8',
  reviewCount = '128',
  badge = 'TOP RATED',
  badgeBg = '#002754',
  width,
}: ProductCardProps) {
  const router = useRouter();
  const { toggleItem, isWishlisted } = useWishlistStore();
  const { addItem } = useCartStore();

  const cardWidth = width || '48%';

  const isGreenOrPlaceholder =
    !image ||
    typeof image !== 'string' ||
    image.toLowerCase().includes('55ff') ||
    image.toLowerCase().includes('00ff') ||
    image.toLowerCase().includes('placehold') ||
    image.toLowerCase().includes('svg') ||
    image.toLowerCase().includes('lh3.googleusercontent') ||
    image.startsWith('data:');

  const displayImage = isGreenOrPlaceholder
    ? title.toLowerCase().includes('saffron') || title.toLowerCase().includes('rose')
      ? 'https://images.unsplash.com/photo-1607006482172-35891d9e1158?w=500&auto=format&fit=crop&q=80'
      : title.toLowerCase().includes('ash') || title.toLowerCase().includes('charcoal') || title.toLowerCase().includes('pine') || title.toLowerCase().includes('scrub')
      ? 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&auto=format&fit=crop&q=80'
      : title.toLowerCase().includes('serum') || title.toLowerCase().includes('glow') || title.toLowerCase().includes('oil')
      ? 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80'
    : image;

  const formattedPrice = typeof price === 'number' ? `₹${price}` : price.startsWith('₹') ? price : `₹${price}`;
  const formattedOriginalPrice = originalPrice
    ? typeof originalPrice === 'number'
      ? `₹${originalPrice}`
      : originalPrice.startsWith('₹')
      ? originalPrice
      : `₹${originalPrice}`
    : null;

  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    const numPrice = typeof price === 'number' ? price : parseInt(String(price).replace(/[^0-9]/g, '')) || 249;
    addItem({
      id: `ci_${id}`,
      cartId: 'c1',
      productId: id,
      unitPrice: numPrice,
      totalPrice: numPrice,
      quantity: 1,
      product: { id, title, slug, images: [], processType: 'cold-process' },
      variant: { id: `v_${id}`, sku: `SKU-${id}`, title: 'Standard', price: numPrice, weightGrams: 100, volumeMl: 0, options: {} },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <TouchableOpacity
      onPress={() => router.push(`/product/${slug}` as any)}
      activeOpacity={0.9}
      style={{
        width: cardWidth as any,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(195, 198, 209, 0.25)',
        shadowColor: '#0A3D78',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        marginBottom: 14,
      }}
    >
      {/* Image & Badges */}
      <View style={{ width: '100%', height: 140, position: 'relative', backgroundColor: '#F2F4F6' }}>
        <Image
          source={{ uri: displayImage }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        {badge && (
          <View style={{ position: 'absolute', top: 6, left: 6, backgroundColor: badgeBg, paddingHorizontal: 7, paddingVertical: 2.5, borderRadius: 10 }}>
            <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 }}>
              {badge}
            </Text>
          </View>
        )}
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            toggleItem(id);
          }}
          style={{ position: 'absolute', top: 6, right: 6, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
        >
          <Heart size={15} color={isWishlisted(id) ? '#DC2626' : '#002754'} fill={isWishlisted(id) ? '#DC2626' : 'none'} />
        </TouchableOpacity>

      </View>

      {/* Info Body */}
      <View style={{ padding: 10, flex: 1, justifyContent: 'space-between' }}>
        <View>
          {/* Rating */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 }}>
            <Star size={11} color="#C5A880" fill="#C5A880" />
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 10, color: '#465F8A' }}>
              {rating} ({reviewCount})
            </Text>
          </View>

          {/* Title */}
          <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, fontWeight: '700', color: '#191C1E', lineHeight: 16 }} numberOfLines={2}>
            {title}
          </Text>
        </View>

        {/* Pricing & Add to Cart */}
        <View style={{ marginTop: 8 }}>
          <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, fontWeight: '700', color: '#002754' }}>
            {formattedPrice}{' '}
            {formattedOriginalPrice && (
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#737781', textDecorationLine: 'line-through', fontWeight: '400' }}>
                {formattedOriginalPrice}
              </Text>
            )}
          </Text>

          <TouchableOpacity
            onPress={handleAddToCart}
            style={{ marginTop: 6, borderWidth: 1.5, borderColor: '#002754', borderRadius: 10, paddingVertical: 6, alignItems: 'center', backgroundColor: '#002754' }}
          >
            <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, color: '#FFFFFF', fontWeight: '600', fontSize: 11, textTransform: 'uppercase' }}>
              + Add to Cart
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
