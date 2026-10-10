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
  Share,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ProductCard } from '../../components/ProductCard';
import { useProductsQuery, useProductBySlugQuery, useWishlistStore, useCartStore, usePlaylistsQuery, useUser } from '@cinmax/hooks';
import { getProductFallbackGallery, getProductFallbackImage } from '@cinmax/utils';
import {
  ArrowLeft,
  Share2,
  Heart,
  ShoppingBag,
  Star,
  Gift,
  Truck,
  CheckCircle,
  Hand,
  Leaf,
  FlaskConical,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  CreditCard,
  GraduationCap,
  Layers,
  ArrowRight,
  Lock,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
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

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MobileProductDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useUser();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { data: directProduct, isLoading: isDirectLoading } = useProductBySlugQuery(slug as string);
  const { data: productsData, isLoading: isProductsLoading } = useProductsQuery();
  const productData = directProduct || productsData?.items?.find((p) => p.slug === slug);
  const { data: productPlaylists = [] } = usePlaylistsQuery(true, productData?.id);
  const { isWishlisted, toggleItem } = useWishlistStore();
  const { addItem } = useCartStore();

  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    setQuantity(1);
    setQuantityInput('1');
  }, [slug]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const galleryScrollRef = React.useRef<ScrollView>(null);
  const GALLERY_WIDTH = SCREEN_WIDTH - (CONTAINER_PADDING * 2);

  const [selectedWeight, setSelectedWeight] = useState('100g');
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [quantityInput, setQuantityInput] = useState('1');
  const [pincode, setPincode] = useState('201301');
  const [isPincodeChecked, setIsPincodeChecked] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<'specs' | 'shipping' | null>(null);

  const defaultImages = getProductFallbackGallery(slug as string);

  const handleSelectImage = (idx: number) => {
    setSelectedImageIndex(idx);
    galleryScrollRef.current?.scrollTo({ x: idx * GALLERY_WIDTH, animated: true });
  };

  const rawImgs = productData?.images && productData.images.length > 0
    ? productData.images.map((i: any) => (typeof i === 'string' ? i : i.url)).filter((u: string) => Boolean(u && !u.includes('lh3.googleusercontent')))
    : [];
  const productImages = rawImgs.length > 0 ? rawImgs : defaultImages;
  const productTitle = productData?.title || 'Botanical Product';
  const productDesc = productData?.description || 'Artisanal formulation with pure botanical extracts.';
  
  const variantsList = productData?.variants && productData.variants.length > 0 ? productData.variants : null;
  const activeVariant = variantsList ? (variantsList[selectedVariantIndex] || variantsList[0]) : null;

  const baseProductPrice = productData?.basePrice ? Number(productData.basePrice) : 199;
  const weightPrices: Record<string, number> = {
    '50g': Math.round(baseProductPrice * 0.6),
    '75g': Math.round(baseProductPrice * 0.8),
    '100g': baseProductPrice,
    '125g': Math.round(baseProductPrice * 1.25),
    '200g': Math.round(baseProductPrice * 1.8),
  };
  const dynamicWeightPrice = weightPrices[selectedWeight] || baseProductPrice;

  const productPrice = activeVariant ? Number(activeVariant.price) : dynamicWeightPrice;
  const originalPrice = activeVariant?.compareAtPrice ? Number(activeVariant.compareAtPrice) : Math.round(productPrice * 1.25);
  const discountPercent = originalPrice && originalPrice > productPrice ? Math.round(((originalPrice - productPrice) / originalPrice) * 100) : 0;
  const savings = originalPrice && originalPrice > productPrice ? originalPrice - productPrice : 0;

  const maxStock = Math.max(1, (activeVariant as any)?.inventoryQuantity ?? (productData as any)?.inventoryQuantity ?? 99);

  const relatedProducts = (productsData?.items || [])
    .filter((p) => p.slug !== slug)
    .slice(0, 4)
    .map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      price: `₹${p.basePrice}`,
      image: typeof p.images?.[0] === 'string' ? p.images[0] : p.images?.[0]?.url || 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/aroma-soap/1.jpg',
    }));

  const handleShare = async () => {
    const shareUrl = Platform.OS === 'web' && typeof window !== 'undefined' ? window.location.href : `https://cinmax.com/product/${slug}`;
    const shareMessage = `Explore ${productTitle} on CINMAX Global Products:\n${shareUrl}`;

    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: productTitle,
          text: productDesc,
          url: shareUrl,
        });
      } else {
        await Share.share({
          title: productTitle,
          message: shareMessage,
          url: shareUrl,
        });
      }
    } catch (err) {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        alert('Product link copied to clipboard!');
      }
    }
  };

  const handleAddToCart = () => {
    const rawParsed = parseInt(quantityInput, 10);
    const validQty = !isNaN(rawParsed) && rawParsed >= 1 ? Math.min(maxStock, rawParsed) : Math.max(1, Math.min(maxStock, quantity));
    if (validQty !== quantity) {
      setQuantity(validQty);
      setQuantityInput(String(validQty));
    }

    const variantToUse = activeVariant || {
      id: `v_${selectedWeight}`,
      sku: `SKU-${selectedWeight}`,
      title: selectedWeight,
      price: productPrice,
      weightGrams: 100,
      volumeMl: 0,
      options: {},
    };

    addItem({
      id: `ci_${productData?.id || 'prod'}_${variantToUse.id}`,
      cartId: 'c1',
      productId: productData?.id || 'p_prod',
      unitPrice: productPrice,
      totalPrice: productPrice * validQty,
      quantity: validQty,
      product: {
        id: productData?.id || 'p_prod',
        title: productTitle,
        slug: slug || 'product',
        images: productImages.map((u: string, idx: number) => ({ id: `img_${idx}`, url: u, altText: productTitle, sortOrder: idx })),
        processType: 'cold-process',
      },
      variant: variantToUse,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    router.push('/cart' as any);
  };

  const handleBuyNow = () => {
    const rawParsed = parseInt(quantityInput, 10);
    const validQty = !isNaN(rawParsed) && rawParsed >= 1 ? Math.min(maxStock, rawParsed) : Math.max(1, Math.min(maxStock, quantity));
    if (validQty !== quantity) {
      setQuantity(validQty);
      setQuantityInput(String(validQty));
    }

    const variantToUse = activeVariant || {
      id: `v_${selectedWeight}`,
      sku: `SKU-${selectedWeight}`,
      title: selectedWeight,
      price: productPrice,
      weightGrams: 100,
      volumeMl: 0,
      options: {},
    };

    addItem({
      id: `ci_${productData?.id || 'prod'}_${variantToUse.id}`,
      cartId: 'c1',
      productId: productData?.id || 'p_prod',
      unitPrice: productPrice,
      totalPrice: productPrice * validQty,
      quantity: validQty,
      product: {
        id: productData?.id || 'p_prod',
        title: productTitle,
        slug: slug || 'product',
        images: productImages.map((u: string, idx: number) => ({ id: `img_${idx}`, url: u, altText: productTitle, sortOrder: idx })),
        processType: 'cold-process',
      },
      variant: variantToUse,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (!user && !isAuthenticated) {
      setIsLoginModalOpen(true);
    } else {
      router.push('/checkout' as any);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF7F2' }}>
      {/* 1. TOP HEADER NAVIGATION BAR */}
      <View style={{ paddingHorizontal: CONTAINER_PADDING, paddingTop: 12, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(247, 249, 251, 0.95)', borderBottomWidth: 1, borderBottomColor: 'rgba(195, 198, 209, 0.3)', zIndex: 100, elevation: 10 }}>
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)' as any)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={{ width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
        >
          <ArrowLeft size={22} color="#002754" />
        </TouchableOpacity>
        <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: '#002754' }}>
          CINMAX
        </Text>
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
          <TouchableOpacity onPress={handleShare} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} style={{ width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Share2 size={20} color="#434750" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (productData) {
                toggleItem(productData);
              } else {
                toggleItem({
                  id: (slug as string) || 'prod',
                  title: productTitle,
                  slug: (slug as string) || 'product',
                  basePrice: productPrice,
                  images: productImages.map((u: string, idx: number) => ({ id: `img_${idx}`, url: u, altText: productTitle, sortOrder: idx })),
                });
              }
            }}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={{ width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
          >
            <Heart
              size={20}
              color={isWishlisted(productData?.id) || isWishlisted(slug as string) ? '#DC2626' : '#002754'}
              fill={isWishlisted(productData?.id) || isWishlisted(slug as string) ? '#DC2626' : 'none'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/cart' as any)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} style={{ width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <ShoppingBag size={20} color="#002754" />
            <View pointerEvents="none" style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: '#BA1A1A' }} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }}>

        {/* 2. Image Gallery & Thumbnails */}
        <View style={{ paddingHorizontal: CONTAINER_PADDING, marginTop: 16 }}>
          <View style={{ width: '100%', aspectRatio: 4 / 5, borderRadius: 24, overflow: 'hidden', backgroundColor: '#FAF5EE', borderWidth: 1, borderColor: 'rgba(197, 168, 128, 0.35)', position: 'relative', shadowColor: '#3C2A1E', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 }}>
            <ScrollView
              ref={galleryScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToInterval={GALLERY_WIDTH}
              snapToAlignment="center"
              nestedScrollEnabled={true}
              onMomentumScrollEnd={(e) => {
                const offset = e.nativeEvent.contentOffset.x;
                const newIndex = Math.round(offset / GALLERY_WIDTH);
                if (newIndex >= 0 && newIndex < productImages.length) {
                  setSelectedImageIndex(newIndex);
                }
              }}
              style={{ width: '100%', height: '100%' }}
            >
              {productImages.map((img: string, idx: number) => (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.95}
                  onPress={() => {
                    setZoomScale(1);
                    setIsZoomModalOpen(true);
                  }}
                  style={{ width: GALLERY_WIDTH, height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAF5EE' }}
                >
                  <Image source={{ uri: img }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Tap to Zoom Badge */}
            <TouchableOpacity
              onPress={() => {
                setZoomScale(1.5);
                setIsZoomModalOpen(true);
              }}
              activeOpacity={0.8}
              style={{ position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0, 39, 84, 0.85)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, zIndex: 10 }}
            >
              <Maximize2 size={13} color="#FFFFFF" />
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>
                Zoom
              </Text>
            </TouchableOpacity>

            {/* Prev / Next Arrows on Main Image */}
            {selectedImageIndex > 0 && (
              <TouchableOpacity
                onPress={() => handleSelectImage(selectedImageIndex - 1)}
                style={{ position: 'absolute', left: 8, top: '45%', width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.92)', justifyContent: 'center', alignItems: 'center', shadowColor: '#3C2A1E', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, zIndex: 10 }}
              >
                <ChevronLeft size={20} color="#002754" />
              </TouchableOpacity>
            )}
            {selectedImageIndex < productImages.length - 1 && (
              <TouchableOpacity
                onPress={() => handleSelectImage(selectedImageIndex + 1)}
                style={{ position: 'absolute', right: 8, top: '45%', width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.92)', justifyContent: 'center', alignItems: 'center', shadowColor: '#3C2A1E', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, zIndex: 10 }}
              >
                <ChevronRight size={20} color="#002754" />
              </TouchableOpacity>
            )}

            {/* Swipe Indicator Dots */}
            <View style={{ position: 'absolute', bottom: 12, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6, zIndex: 10 }}>
              {productImages.map((_: any, idx: number) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleSelectImage(idx)}
                  style={{
                    width: selectedImageIndex === idx ? 18 : 7,
                    height: 7,
                    borderRadius: 3.5,
                    backgroundColor: selectedImageIndex === idx ? '#002754' : 'rgba(0, 39, 84, 0.25)',
                  }}
                />
              ))}
            </View>
          </View>

          {/* Horizontal Thumbnails */}
          <ScrollView horizontal nestedScrollEnabled={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, marginTop: 12, paddingBottom: 4 }}>
            {productImages.map((img: string, idx: number) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handleSelectImage(idx)}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 14,
                  overflow: 'hidden',
                  borderWidth: 2,
                  borderColor: selectedImageIndex === idx ? '#002754' : 'rgba(197, 168, 128, 0.35)',
                  backgroundColor: '#FAF5EE',
                  shadowColor: '#3C2A1E',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: selectedImageIndex === idx ? 0.15 : 0.04,
                  shadowRadius: 6,
                }}
              >
                <Image source={{ uri: img }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 3. Product Info Header & Pricing */}
        <View style={{ paddingHorizontal: CONTAINER_PADDING, marginTop: 24, gap: 10 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ backgroundColor: 'rgba(197, 168, 128, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#C5A880', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>BEST SELLER</Text>
            </View>
            <View style={{ backgroundColor: 'rgba(197, 168, 128, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#C5A880', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>100% ORGANIC</Text>
            </View>
          </View>

          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 26, fontWeight: '700', color: '#002754', lineHeight: 34 }}>
            {productTitle}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ flexDirection: 'row', gap: 2 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={14} color="#C5A880" fill="#C5A880" />
              ))}
            </View>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#434750' }}>
              4.9/5 (120 reviews)
            </Text>
          </View>

          {/* Pricing Row */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginTop: 6 }}>
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 32, fontWeight: '700', color: '#002754' }}>
              ₹{productPrice}
            </Text>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 16, color: '#434750', textDecorationLine: 'line-through', marginBottom: 4 }}>
              ₹{originalPrice}
            </Text>
            <View style={{ backgroundColor: 'rgba(186, 26, 26, 0.1)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 4 }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#BA1A1A', fontSize: 11, fontWeight: '700' }}>18% OFF</Text>
            </View>
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#4CAF50', marginLeft: 'auto', marginBottom: 4 }}>
              Save ₹100
            </Text>
          </View>
        </View>

        {/* 4. Promotion Offer Card */}
        <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 18, backgroundColor: '#F2F4F6', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.6)' }}>
          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(197, 168, 128, 0.15)', justifyContent: 'center', alignItems: 'center' }}>
            <Gift size={20} color="#C5A880" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, fontWeight: '700', color: '#002754' }}>
              Limited Offer: Buy 2 Get 1 Free
            </Text>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#434750', marginTop: 2 }}>
              Automatically applied at checkout
            </Text>
          </View>
        </View>

        {/* 5. Selectors: Variant / Weight & Quantity */}
        <View style={{ paddingHorizontal: CONTAINER_PADDING, marginTop: 22, gap: 18 }}>
          {/* Variant Selector */}
          <View>
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, fontWeight: '700', color: '#191C1E', marginBottom: 10 }}>
              {variantsList ? 'Select Size / Variant' : 'Weight'}
            </Text>
            <ScrollView horizontal nestedScrollEnabled={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
              {variantsList
                ? variantsList.map((v, idx) => {
                    const isSelected = selectedVariantIndex === idx;
                    const vPrice = Number(v.price);
                    return (
                      <TouchableOpacity
                        key={v.id || idx}
                        onPress={() => setSelectedVariantIndex(idx)}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 12,
                          borderWidth: isSelected ? 2 : 1,
                          borderColor: isSelected ? '#002754' : '#C3C6D1',
                          backgroundColor: isSelected ? 'rgba(0, 39, 84, 0.05)' : '#FFFFFF',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 13, color: isSelected ? '#002754' : '#434750', fontWeight: '600' }}>
                          {v.title}
                        </Text>
                        <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, color: isSelected ? '#002754' : '#737781', fontWeight: '700' }}>
                          ₹{vPrice}
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                : ['50g', '75g', '100g', '125g', '200g'].map((w) => (
                    <TouchableOpacity
                      key={w}
                      onPress={() => setSelectedWeight(w)}
                      style={{
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderRadius: 12,
                        borderWidth: selectedWeight === w ? 2 : 1,
                        borderColor: selectedWeight === w ? '#002754' : '#C3C6D1',
                        backgroundColor: selectedWeight === w ? 'rgba(0, 39, 84, 0.05)' : '#FFFFFF',
                      }}
                    >
                      <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 14, color: selectedWeight === w ? '#002754' : '#434750', fontWeight: '600' }}>
                        {w}
                      </Text>
                    </TouchableOpacity>
                  ))}
            </ScrollView>
          </View>

          {/* Quantity */}
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, fontWeight: '700', color: '#191C1E' }}>
                Quantity
              </Text>
              {maxStock < 99 && (
                <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: maxStock <= 5 ? '#BA1A1A' : '#737781' }}>
                  {maxStock <= 5 ? `Only ${maxStock} left in stock` : `${maxStock} available`}
                </Text>
              )}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, width: 140, height: 44, overflow: 'hidden' }}>
              <TouchableOpacity
                onPress={() => {
                  const newQty = Math.max(1, quantity - 1);
                  setQuantity(newQty);
                  setQuantityInput(String(newQty));
                }}
                disabled={quantity <= 1}
                style={{ width: 42, height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: quantity <= 1 ? '#F8F9FA' : '#F2F4F6' }}
              >
                <Minus size={16} color={quantity <= 1 ? '#B0B4BA' : '#434750'} />
              </TouchableOpacity>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TextInput
                  value={quantityInput}
                  onChangeText={(text) => {
                    const cleanText = text.replace(/[^0-9]/g, '');
                    setQuantityInput(cleanText);
                    if (cleanText !== '') {
                      const num = parseInt(cleanText, 10);
                      if (!isNaN(num)) {
                        const clamped = Math.max(1, Math.min(maxStock, num));
                        setQuantity(clamped);
                      }
                    }
                  }}
                  onBlur={() => {
                    const num = parseInt(quantityInput, 10);
                    if (isNaN(num) || num < 1) {
                      setQuantity(1);
                      setQuantityInput('1');
                    } else if (num > maxStock) {
                      setQuantity(maxStock);
                      setQuantityInput(String(maxStock));
                    } else {
                      setQuantity(num);
                      setQuantityInput(String(num));
                    }
                  }}
                  keyboardType="number-pad"
                  maxLength={3}
                  style={{
                    fontFamily: FONT_SANS_BOLD,
                    fontSize: 15,
                    color: '#191C1E',
                    textAlign: 'center',
                    width: '100%',
                    padding: 0,
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  const newQty = Math.min(maxStock, quantity + 1);
                  setQuantity(newQty);
                  setQuantityInput(String(newQty));
                }}
                disabled={quantity >= maxStock}
                style={{ width: 42, height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: quantity >= maxStock ? '#F8F9FA' : '#F2F4F6' }}
              >
                <Plus size={16} color={quantity >= maxStock ? '#B0B4BA' : '#434750'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 6. Delivery Options */}
        <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 24, backgroundColor: '#F2F4F6', borderRadius: 16, padding: 16, gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Truck size={18} color="#002754" />
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, fontWeight: '700', color: '#191C1E' }}>
              Delivery Options
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TextInput
              value={pincode}
              onChangeText={setPincode}
              placeholder="Enter PIN code"
              keyboardType="number-pad"
              maxLength={6}
              placeholderTextColor="#737781"
              style={{ fontFamily: FONT_SANS_REGULAR, flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 10, paddingHorizontal: 14, fontSize: 13, color: '#191C1E' }}
            />
            <TouchableOpacity onPress={() => setIsPincodeChecked(true)} style={{ backgroundColor: '#002754', paddingHorizontal: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 12, fontWeight: '700' }}>Check</Text>
            </TouchableOpacity>
          </View>

          {isPincodeChecked && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <CheckCircle size={14} color="#4CAF50" />
              <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 12, color: '#4CAF50' }}>Estimated delivery in 2-3 days</Text>
            </View>
          )}
        </View>

        {/* 7. Trust Badges Bar */}
        <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 24, paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(195, 198, 209, 0.3)', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
          <View style={{ alignItems: 'center', gap: 6 }}>
            <Hand size={22} color="#C5A880" />
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 9, fontWeight: '700', color: '#434750', textTransform: 'uppercase' }}>Handcrafted</Text>
          </View>
          <View style={{ alignItems: 'center', gap: 6 }}>
            <Heart size={22} color="#C5A880" />
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 9, fontWeight: '700', color: '#434750', textTransform: 'uppercase' }}>Cruelty-Free</Text>
          </View>
          <View style={{ alignItems: 'center', gap: 6 }}>
            <Leaf size={22} color="#C5A880" />
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 9, fontWeight: '700', color: '#434750', textTransform: 'uppercase' }}>Vegan</Text>
          </View>
          <View style={{ alignItems: 'center', gap: 6 }}>
            <FlaskConical size={22} color="#C5A880" />
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 9, fontWeight: '700', color: '#434750', textTransform: 'uppercase' }}>Chemical Free</Text>
          </View>
        </View>

        {/* 8. Content Sections: Ritual, Key Ingredients, How to Use */}
        <View style={{ paddingHorizontal: CONTAINER_PADDING, marginTop: 24, gap: 24 }}>
          {/* The Ritual */}
          <View>
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, fontWeight: '700', color: '#002754', marginBottom: 10 }}>
              The Ritual
            </Text>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#434750', lineHeight: 22 }}>
              {productDesc}
            </Text>
          </View>

          {/* Key Ingredients */}
          <View>
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, fontWeight: '700', color: '#002754', marginBottom: 12 }}>
              Key Ingredients
            </Text>
            <View style={{ gap: 10 }}>
              <View style={{ backgroundColor: '#F2F4F6', borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(197, 168, 128, 0.15)', justifyContent: 'center', alignItems: 'center' }}>
                  <Sparkles size={20} color="#C5A880" />
                </View>
                <View>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, fontWeight: '700', color: '#191C1E' }}>Kashmiri Saffron</Text>
                  <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#434750' }}>Brightens &amp; Evens Tone</Text>
                </View>
              </View>

              <View style={{ backgroundColor: '#F2F4F6', borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(197, 168, 128, 0.15)', justifyContent: 'center', alignItems: 'center' }}>
                  <Leaf size={20} color="#C5A880" />
                </View>
                <View>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, fontWeight: '700', color: '#191C1E' }}>Mysore Sandalwood</Text>
                  <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#434750' }}>Soothes &amp; Calms</Text>
                </View>
              </View>
            </View>
          </View>

          {/* How to Use */}
          <View>
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, fontWeight: '700', color: '#002754', marginBottom: 14 }}>
              How to Use
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
              <View style={{ alignItems: 'center', gap: 8 }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#C3C6D1', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, color: '#002754' }}>1</Text>
                </View>
                <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#434750' }}>Lather in hands</Text>
              </View>
              <View style={{ alignItems: 'center', gap: 8 }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#C3C6D1', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, color: '#002754' }}>2</Text>
                </View>
                <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#434750' }}>Apply to skin</Text>
              </View>
              <View style={{ alignItems: 'center', gap: 8 }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#C3C6D1', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, color: '#002754' }}>3</Text>
                </View>
                <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#434750' }}>Rinse well</Text>
              </View>
            </View>
          </View>

          {/* Accordions */}
          <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(195, 198, 209, 0.3)' }}>
            <TouchableOpacity onPress={() => setOpenAccordion(openAccordion === 'specs' ? null : 'specs')} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(195, 198, 209, 0.3)' }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, fontWeight: '700', color: '#191C1E' }}>Specifications</Text>
              {openAccordion === 'specs' ? <ChevronUp size={18} color="#002754" /> : <ChevronDown size={18} color="#002754" />}
            </TouchableOpacity>
            {openAccordion === 'specs' && (
              <View style={{ paddingVertical: 10, gap: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 13, color: '#191C1E' }}>Skin Type:</Text><Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750' }}>All Skin Types</Text></View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 13, color: '#191C1E' }}>Weight:</Text><Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750' }}>100g</Text></View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 13, color: '#191C1E' }}>Shelf Life:</Text><Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750' }}>24 Months</Text></View>
              </View>
            )}

            <TouchableOpacity onPress={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(195, 198, 209, 0.3)' }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, fontWeight: '700', color: '#191C1E' }}>Shipping &amp; Returns</Text>
              {openAccordion === 'shipping' ? <ChevronUp size={18} color="#002754" /> : <ChevronDown size={18} color="#002754" />}
            </TouchableOpacity>
            {openAccordion === 'shipping' && (
              <View style={{ paddingVertical: 10 }}>
                <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', lineHeight: 20 }}>
                  Free shipping on orders over ₹1000. Unopened products can be returned within 30 days for a full refund.
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Classes for this Product Section */}
          {productPlaylists && productPlaylists.length > 0 && (
            <View style={{ marginTop: 24, backgroundColor: '#002754', borderRadius: 20, padding: 18, gap: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: '#C5A880', justifyContent: 'center', alignItems: 'center' }}>
                  <GraduationCap size={20} color="#002754" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#FFFFFF' }}>Classes for this Product</Text>
                  <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#E0E3E5' }}>Dedicated masterclass course</Text>
                </View>
              </View>

              {productPlaylists.map((pl: any) => (
                <View key={pl.id} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 14, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, color: '#FFFFFF' }} numberOfLines={1}>{pl.title}</Text>
                    <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#C5A880', marginTop: 2 }}>
                      {pl.videos?.length || pl.videoCount || 0} Classes Included • ₹{pl.price}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => router.push('/(tabs)/videos' as any)}
                    style={{ backgroundColor: '#C5A880', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 }}
                  >
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: '#002754' }}>View Playlist</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* 9. Customer Reviews Section */}
          <View style={{ paddingHorizontal: CONTAINER_PADDING, marginTop: 32 }}>
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: '#002754', marginBottom: 16 }}>
            Customer Reviews
          </Text>

          <View style={{ backgroundColor: '#F2F4F6', borderRadius: 16, padding: 18, alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 44, fontWeight: '700', color: '#002754' }}>
              4.9<Text style={{ fontSize: 20, color: '#434750' }}>/5</Text>
            </Text>
            <View style={{ flexDirection: 'row', gap: 4, marginVertical: 6 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={18} color="#C5A880" fill="#C5A880" />
              ))}
            </View>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#434750', marginBottom: 12 }}>Based on 120 reviews</Text>
            <TouchableOpacity style={{ borderWidth: 1, borderColor: '#002754', paddingHorizontal: 24, paddingVertical: 8, borderRadius: 12 }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#002754', fontSize: 13, fontWeight: '700' }}>Write a Review</Text>
            </TouchableOpacity>
          </View>

          {/* Review Cards */}
          <View style={{ gap: 12 }}>
            <View style={{ backgroundColor: '#F2F4F6', borderRadius: 16, padding: 14 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#191C1E' }}>Aarya S.</Text>
                    <View style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                      <Text style={{ color: '#4CAF50', fontSize: 9, fontWeight: '700', textTransform: 'uppercase' }}>Verified Buyer</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 2, marginTop: 4 }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} color="#C5A880" fill="#C5A880" />
                    ))}
                  </View>
                </View>
                <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#434750' }}>2 days ago</Text>
              </View>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', lineHeight: 18 }}>
                Absolutely love the scent! My skin feels so soft and hydrated after just a few uses. The saffron adds such a beautiful glow.
              </Text>
            </View>

            <View style={{ backgroundColor: '#F2F4F6', borderRadius: 16, padding: 14 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#191C1E' }}>Rohan M.</Text>
                    <View style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                      <Text style={{ color: '#4CAF50', fontSize: 9, fontWeight: '700', textTransform: 'uppercase' }}>Verified Buyer</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 2, marginTop: 4 }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} color="#C5A880" fill="#C5A880" />
                    ))}
                  </View>
                </View>
                <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#434750' }}>1 week ago</Text>
              </View>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', lineHeight: 18 }}>
                The sandalwood aroma is so calming. It's become a staple in my morning routine. High quality packaging too.
              </Text>
            </View>
          </View>
        </View>

        {/* 10. Related Products Section */}
        <View style={{ marginTop: 32, paddingHorizontal: CONTAINER_PADDING }}>
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: '#002754', marginBottom: 16 }}>
            Complete Your Ritual
          </Text>
          <ScrollView horizontal nestedScrollEnabled={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 6 }}>
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                id={rel.id}
                title={rel.title}
                slug={rel.slug || rel.id}
                price={rel.price}
                image={rel.image}
                width={160}
                rating="4.8"
                badge="RECOMMENDED"
                badgeBg="#365E9B"
              />
            ))}
          </ScrollView>
        </View>

      </ScrollView>

      {/* 11. DOCKED STICKY BOTTOM ACTION BAR (Replaces Bottom Navigation Bar) */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60 + insets.bottom, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: 'rgba(195, 198, 209, 0.3)', flexDirection: 'row', zIndex: 100, paddingTop: 10, paddingBottom: Math.max(10, insets.bottom), paddingHorizontal: 16, gap: 12, shadowColor: '#0A3D78', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.08, shadowRadius: 15, alignItems: 'center' }}>
        <TouchableOpacity
          onPress={handleAddToCart}
          style={{ flex: 1, backgroundColor: '#B4CDFE', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8, height: 48, borderRadius: 16, shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8 }}
        >
          <ShoppingBag size={18} color="#002754" />
          <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#002754', fontSize: 14, fontWeight: '700' }}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleBuyNow}
          style={{ flex: 1, backgroundColor: '#002754', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8, height: 48, borderRadius: 16, shadowColor: '#002754', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 10 }}
        >
          <CreditCard size={18} color="white" />
          <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 14, fontWeight: '700' }}>Buy Now</Text>
        </TouchableOpacity>
      </View>

      {/* LOGIN REQUIRED MODAL */}
      <Modal visible={isLoginModalOpen} animationType="fade" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <View style={{ width: '100%', maxWidth: 360, backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, alignItems: 'center', shadowColor: '#002754', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 8 }}>
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#F0F4F8', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
              <Lock size={26} color="#002754" />
            </View>

            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, color: '#002754', marginBottom: 8, textAlign: 'center' }}>
              Login Required
            </Text>

            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#434750', textAlign: 'center', marginBottom: 24, lineHeight: 20 }}>
              Please login to proceed with checkout.
            </Text>

            <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
              <TouchableOpacity
                onPress={() => setIsLoginModalOpen(false)}
                style={{ flex: 1, paddingVertical: 13, borderRadius: 14, borderWidth: 1, borderColor: '#C3C6D1', alignItems: 'center' }}
              >
                <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#434750', fontSize: 14 }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setIsLoginModalOpen(false);
                  router.push('/(auth)/login?redirect=/checkout' as any);
                }}
                style={{ flex: 1, paddingVertical: 13, borderRadius: 14, backgroundColor: '#002754', alignItems: 'center', shadowColor: '#002754', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 }}
              >
                <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#FFFFFF', fontSize: 14 }}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* INTERACTIVE FULL SCREEN ZOOM MODAL */}
      <Modal visible={isZoomModalOpen} animationType="fade" transparent onRequestClose={() => setIsZoomModalOpen(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 18, 42, 0.96)', justifyContent: 'space-between', alignItems: 'center', paddingVertical: insets.top + 10 }}>
          {/* Zoom Header */}
          <View style={{ width: '100%', paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
            <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#FFFFFF', fontSize: 12 }}>
                {selectedImageIndex + 1} / {productImages.length}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => setZoomScale((prev) => Math.max(1, prev - 0.5))}
                disabled={zoomScale <= 1}
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: zoomScale <= 1 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center' }}
              >
                <ZoomOut size={20} color={zoomScale <= 1 ? '#888' : '#FFFFFF'} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setZoomScale((prev) => Math.min(3.5, prev + 0.5))}
                disabled={zoomScale >= 3.5}
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: zoomScale >= 3.5 ? 'rgba(255,255,255,0.1)' : '#C5A880', justifyContent: 'center', alignItems: 'center' }}
              >
                <ZoomIn size={20} color="#002754" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setZoomScale(1);
                  setIsZoomModalOpen(false);
                }}
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginLeft: 4 }}
              >
                <X size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Zoomable Image Container */}
          <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
              maximumZoomScale={4}
              minimumZoomScale={1}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              centerContent
            >
              <Image
                source={{ uri: productImages[selectedImageIndex] }}
                style={{
                  width: SCREEN_WIDTH * 0.94,
                  height: SCREEN_WIDTH * 1.15,
                  borderRadius: 16,
                  transform: [{ scale: zoomScale }],
                }}
                resizeMode="contain"
              />
            </ScrollView>

            {/* Prev image in Zoom Modal */}
            {selectedImageIndex > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setZoomScale(1);
                  handleSelectImage(selectedImageIndex - 1);
                }}
                style={{ position: 'absolute', left: 14, top: '48%', width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0, 39, 84, 0.85)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(197, 168, 128, 0.5)', zIndex: 10 }}
              >
                <ChevronLeft size={24} color="#C5A880" />
              </TouchableOpacity>
            )}

            {/* Next image in Zoom Modal */}
            {selectedImageIndex < productImages.length - 1 && (
              <TouchableOpacity
                onPress={() => {
                  setZoomScale(1);
                  handleSelectImage(selectedImageIndex + 1);
                }}
                style={{ position: 'absolute', right: 14, top: '48%', width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0, 39, 84, 0.85)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(197, 168, 128, 0.5)', zIndex: 10 }}
              >
                <ChevronRight size={24} color="#C5A880" />
              </TouchableOpacity>
            )}
          </View>

          {/* Bottom Thumbnails Strip in Zoom Modal */}
          <View style={{ width: '100%', paddingHorizontal: 20, paddingBottom: insets.bottom + 10, alignItems: 'center' }}>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 12 }}>
              Tap thumbnail or zoom controls to inspect ingredients & packaging
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, justifyContent: 'center' }}>
              {productImages.map((img: string, idx: number) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => {
                    setZoomScale(1);
                    handleSelectImage(idx);
                  }}
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 12,
                    overflow: 'hidden',
                    borderWidth: 2,
                    borderColor: selectedImageIndex === idx ? '#C5A880' : 'rgba(255,255,255,0.3)',
                  }}
                >
                  <Image source={{ uri: img }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
