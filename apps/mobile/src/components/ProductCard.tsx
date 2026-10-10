import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Star, Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useWishlistStore, useCartStore } from '@cinmax/hooks';
import { getProductFallbackImage } from '@cinmax/utils';

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

import { getSoapImageSource } from '../constants/soapAssets';

export interface ProductCardProps {
  id: string;
  title: string;
  slug: string;
  price: string | number;
  originalPrice?: string | number;
  image?: string;
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
  badge,
  badgeBg,
  width,
}: ProductCardProps) {
  const router = useRouter();
  const { toggleItem, isWishlisted } = useWishlistStore();
  const { addItem } = useCartStore();

  const cardWidth = width || '48%';
  const [imageError, setImageError] = React.useState(false);

  const imageSource = imageError
    ? getSoapImageSource(undefined, slug || title)
    : getSoapImageSource(image, slug || title);

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
      product: { id, title, slug, images: [{ id: `img_${id}`, url: typeof image === 'string' ? image : '', altText: title, sortOrder: 0 }], processType: 'cold-process' },
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
        borderRadius: 18,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(197, 168, 128, 0.35)',
        shadowColor: '#3C2A1E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: 14,
      }}
    >
      {/* Luxury Blurred Background + Crisp Product Frame */}
      <View style={{ width: '100%', height: 156, position: 'relative', overflow: 'hidden', backgroundColor: '#FAF5EE', justifyContent: 'center', alignItems: 'center' }}>
        {/* 1. Ambient Blurred Layer */}
        <Image
          source={imageSource}
          style={{ position: 'absolute', width: '125%', height: '125%', opacity: 0.38 }}
          blurRadius={Platform.OS === 'ios' ? 20 : 12}
          resizeMode="cover"
        />

        {/* 2. Soft Ambient Tint */}
        <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(250, 245, 238, 0.35)' }} />

        {/* 3. Sharp Foreground Product Image */}
        <Image
          source={imageSource}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />

        {badge ? (
          <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: badgeBg || '#002754', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 3 }}>
            <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#FAF7F2', fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 }}>
              {badge}
            </Text>
          </View>
        ) : null}
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            toggleItem({
              id,
              title,
              slug: slug || id,
              basePrice: typeof price === 'number' ? price : parseInt(String(price).replace(/[^0-9]/g, '')) || 249,
              images: [{ id: `img_${id}`, url: typeof image === 'string' ? image : '', altText: title, sortOrder: 0 }],
              processType: 'cold-process',
            });
          }}
          style={{ position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.92)', justifyContent: 'center', alignItems: 'center', shadowColor: '#3C2A1E', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4, elevation: 2 }}
        >
          <Heart size={15} color={isWishlisted(id) || isWishlisted(slug) ? '#DC2626' : '#002754'} fill={isWishlisted(id) || isWishlisted(slug) ? '#DC2626' : 'none'} />
        </TouchableOpacity>
      </View>

      {/* Info Body */}
      <View style={{ padding: 12, flex: 1, justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}>
        <View>
          {/* Rating */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
            <Star size={12} color="#C5A880" fill="#C5A880" />
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#465F8A' }}>
              {rating} ({reviewCount})
            </Text>
          </View>

          {/* Title */}
          <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, fontWeight: '700', color: '#191C1E', lineHeight: 17 }} numberOfLines={2}>
            {title}
          </Text>
        </View>

        {/* Pricing & Add to Cart */}
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 15, fontWeight: '700', color: '#002754' }}>
            {formattedPrice}{' '}
            {formattedOriginalPrice && (
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#737781', textDecorationLine: 'line-through', fontWeight: '400' }}>
                {formattedOriginalPrice}
              </Text>
            )}
          </Text>

          <TouchableOpacity
            onPress={handleAddToCart}
            style={{ marginTop: 8, borderWidth: 1.5, borderColor: '#002754', borderRadius: 10, paddingVertical: 7, alignItems: 'center', backgroundColor: '#002754' }}
          >
            <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, color: '#FFFFFF', fontWeight: '600', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.3 }}>
              + Add to Cart
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
