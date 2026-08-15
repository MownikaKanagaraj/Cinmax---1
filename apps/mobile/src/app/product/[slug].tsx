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
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ProductCard } from '../../components/ProductCard';
import { useProductsQuery, useWishlistStore, useCartStore } from '@cinmax/hooks';
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

export default function MobileProductDetailsScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { data: productsData } = useProductsQuery();
  const productData = productsData?.items?.find((p) => p.slug === slug) || productsData?.items?.[0];
  const { isWishlisted, toggleItem } = useWishlistStore();
  const { addItem } = useCartStore();

  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, [slug]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState('100g');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('201301');
  const [isPincodeChecked, setIsPincodeChecked] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<'specs' | 'shipping' | null>(null);

  const defaultImages = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAa53xGDNm24F3FLLvkunr8Wc3UvxBX72m-eGWbQq3GGO3i_64mO5N1GuVU5hTCEIp6TRuZkR3AU54alBhH6lqpP9bcP3Z7SWW9nocgstrZ0qsXEXnFToOLUoLrMyJyFPvSXcyWV--X-Em8ONgiYTgU88w3sBYevC-6g1s_A3PfZ5jPm8ExPbF5o7Cz7pEhJIHlXNQdj9P1-ItHKQqrVjgp8g3DNn8m8iHfO8xmfagbwbDIJj737UCa',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCf9JoWSF3-S5LwBKgj6E_ydizODwyBL7ZB5CrYxX0UOlEtz-rYpHe362m1-U4IFKlAvZb0jKnVsAzC_JsBOQIDlzd0KF7g4GGAg4oua71dPHrK_NNA16JlU8csEvzHJTrnADDK0BWoSUnjksVcQ-IprWSbjZFZOT95Gigw5zNrT_BDl1UrbJcPNpFlElNbK5oGoeeQw4rT9hWvOTX82EEaMHU3PXWFyujUGfgP_zZO_oE2z3krND0l',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuClMfZAIfX6HGhXNqF4OsqLoSsD5fpBaUZTPX5dN0aL16awrYcV2jwsPlX1qy1VaUmfinGyyNai8b-j8YZuUM1llki-6GfJCs0_j1ov-rlBMycm5Gn8fFVKZ8t-LI5wV5F2tXerSvapl8LF5aY3pIKPXmSLL1SP3dMakULs_U0ErbOvE-CyyyEIf66n4xiChbr3TJQ5Ajep8J8qJtNJQI8ygCYiLe21aMsrW6E6BG6zibVm8nroqxGv',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCZfQtzA9d4pmFfzymqypTKQTGS-5-fHBtJ08VsBNtq5oVz9yMxPZMEdZB39Z6vlsaPwav2RoVK1u0uau1Lp9Fl8DX-IjmIWbfUS0F0xDEqWfR4VTtozZHh10cEOtlROVba_nbwyJwg4-Dtq1kLiaEJgCYfmp5kSVOY1U_TEpxg9Bxeczec9BYy3GNlVOhlAaiOMwOLfobcZmdJaRzQChY0hYNRXsMK17H74dZ5td__IpHgF1WKtsnl',
  ];

  const productImages = productData?.images?.map((i: any) => (typeof i === 'string' ? i : i.url)) || defaultImages;
  const productTitle = productData?.title || 'Azure Marine Botanical Bar';
  const productDesc = productData?.description || 'Handcrafted over a 6-week slow cold-cure process. Infused with wild-harvested Atlantic kelp, cold-pressed virgin olive oil, and organic bergamot peel for an invigorating, deeply hydrating cleansing ritual.';
  const productPrice = productData?.basePrice ? Number(productData.basePrice) : 18;
  const originalPrice = productData?.compareAtPrice ? Number(productData.compareAtPrice) : 22;

  const relatedProducts = (productsData?.items || [])
    .filter((p) => p.slug !== slug)
    .slice(0, 4)
    .map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      price: `₹${p.basePrice}`,
      image: typeof p.images?.[0] === 'string' ? p.images[0] : p.images?.[0]?.url || 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400',
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
    addItem({
      id: `ci_${productData?.id || 'saffron'}`,
      cartId: 'c1',
      productId: productData?.id || 'p_saffron',
      unitPrice: productPrice,
      totalPrice: productPrice * quantity,
      quantity,
      product: { id: productData?.id || 'p_saffron', title: productTitle, slug: slug || 'saffron-soap', images: [], processType: 'cold-process' },
      variant: { id: `v_${selectedWeight}`, sku: `SKU-${selectedWeight}`, title: selectedWeight, price: productPrice, weightGrams: 100, volumeMl: 0, options: {} },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    router.push('/cart' as any);
  };

  const handleBuyNow = () => {
    addItem({
      id: `ci_${productData?.id || 'saffron'}`,
      cartId: 'c1',
      productId: productData?.id || 'p_saffron',
      unitPrice: productPrice,
      totalPrice: productPrice * quantity,
      quantity,
      product: { id: productData?.id || 'p_saffron', title: productTitle, slug: slug || 'saffron-soap', images: [], processType: 'cold-process' },
      variant: { id: `v_${selectedWeight}`, sku: `SKU-${selectedWeight}`, title: selectedWeight, price: productPrice, weightGrams: 100, volumeMl: 0, options: {} },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    router.push('/checkout' as any);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FB' }}>
      {/* 1. TOP HEADER NAVIGATION BAR */}
      <View style={{ paddingHorizontal: CONTAINER_PADDING, paddingTop: 12, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(247, 249, 251, 0.95)', borderBottomWidth: 1, borderBottomColor: 'rgba(195, 198, 209, 0.3)', zIndex: 100 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }}>
          <ArrowLeft size={22} color="#002754" />
        </TouchableOpacity>
        <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: '#002754' }}>
          CINMAX
        </Text>
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
          <TouchableOpacity onPress={handleShare} style={{ width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }}>
            <Share2 size={20} color="#434750" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleItem({ id: productData?.id || 'p_saffron', title: productTitle, slug: slug || 'saffron-soap', price: productPrice, images: productImages })} style={{ width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }}>
            <Heart size={20} color="#002754" fill={isWishlisted(productData?.id || 'p_saffron') ? '#002754' : 'none'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/cart' as any)} style={{ width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <ShoppingBag size={20} color="#002754" />
            <View style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: '#BA1A1A' }} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }}>

        {/* 2. Image Gallery & Thumbnails */}
        <View style={{ paddingHorizontal: CONTAINER_PADDING, marginTop: 16 }}>
          <View style={{ width: '100%', aspectRatio: 4 / 5, borderRadius: 20, overflow: 'hidden', backgroundColor: '#ECEEF0', position: 'relative', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.06, shadowRadius: 15 }}>
            <Image source={{ uri: productImages[selectedImageIndex] || defaultImages[0] }} style={{ width: '100%', height: '100%' }} />
            {/* Swipe Indicator Dots */}
            <View style={{ position: 'absolute', bottom: 12, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
              {productImages.map((_: any, idx: number) => (
                <View
                  key={idx}
                  style={{
                    width: selectedImageIndex === idx ? 16 : 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: selectedImageIndex === idx ? '#002754' : 'rgba(0, 39, 84, 0.3)',
                  }}
                />
              ))}
            </View>
          </View>

          {/* Horizontal Thumbnails */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, marginTop: 12, paddingBottom: 4 }}>
            {productImages.map((img: string, idx: number) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setSelectedImageIndex(idx)}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 12,
                  overflow: 'hidden',
                  borderWidth: selectedImageIndex === idx ? 2 : 1,
                  borderColor: selectedImageIndex === idx ? '#002754' : 'transparent',
                  opacity: selectedImageIndex === idx ? 1 : 0.7,
                }}
              >
                <Image source={{ uri: img }} style={{ width: '100%', height: '100%' }} />
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

        {/* 5. Selectors: Weight & Quantity */}
        <View style={{ paddingHorizontal: CONTAINER_PADDING, marginTop: 22, gap: 18 }}>
          {/* Weight */}
          <View>
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, fontWeight: '700', color: '#191C1E', marginBottom: 10 }}>
              Weight
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {['75g', '100g', '125g'].map((w) => (
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
            </View>
          </View>

          {/* Quantity */}
          <View>
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, fontWeight: '700', color: '#191C1E', marginBottom: 10 }}>
              Quantity
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, width: 130, height: 44, overflow: 'hidden' }}>
              <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: 40, height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F4F6' }}>
                <Minus size={16} color="#434750" />
              </TouchableOpacity>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 15, color: '#191C1E' }}>{quantity}</Text>
              </View>
              <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={{ width: 40, height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F4F6' }}>
                <Plus size={16} color="#434750" />
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 6 }}>
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
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 68, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: 'rgba(195, 198, 209, 0.3)', flexDirection: 'row', zIndex: 100, paddingVertical: 10, paddingHorizontal: 16, gap: 12, shadowColor: '#0A3D78', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.08, shadowRadius: 15, alignItems: 'center' }}>
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
    </SafeAreaView>
  );
}
