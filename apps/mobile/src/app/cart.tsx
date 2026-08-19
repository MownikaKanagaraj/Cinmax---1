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
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCartStore, useCartQuery } from '@cinmax/hooks';
import { calculateDeliveryCharge, ALL_INDIAN_STATES } from '@cinmax/utils';
import {
  ArrowLeft,
  Heart,
  Bell,
  MapPin,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ChevronDown,
  Check,
  ShoppingBag,
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

export default function MobileCartScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { items: storeItems, updateQuantity, removeItem } = useCartStore();
  const { data: cartData } = useCartQuery();

  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, []);

  const [selectedState, setSelectedState] = useState<string>('Tamil Nadu');
  const [isStateModalOpen, setIsStateModalOpen] = useState<boolean>(false);
  const [pincode, setPincode] = useState('600001');

  const cartList = storeItems.map((item) => ({
    id: item.id,
    slug: item.product?.slug || 'organic-saffron-sandalwood-soap',
    title: item.product?.title || 'Organic Saffron Soap',
    price: item.unitPrice || 450,
    originalPrice: item.unitPrice + 100,
    quantity: item.quantity,
    badge: 'Handcrafted',
    badgeBg: '#EBF3FF',
    badgeText: '#002754',
    image: item.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&auto=format&fit=crop&q=80',
  }));

  // Formula: SUM(quantity of every item in cart)
  const totalItemsCount = cartList.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = cartList.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const discount = 230;

  // Centralized Delivery Charge Algorithm
  const deliveryInfo = calculateDeliveryCharge(selectedState, totalItemsCount);
  const shipping = deliveryInfo.deliveryCharge;
  const gst = Math.round(subtotal * 0.02);
  const grandTotal = Math.max(0, subtotal - discount + shipping + gst);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FB' }}>
      {/* 1. Header Bar */}
      <View style={{ paddingHorizontal: CONTAINER_PADDING, paddingTop: 14, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(247, 249, 251, 0.9)', borderBottomWidth: 1, borderBottomColor: 'rgba(195, 198, 209, 0.3)' }}>
        <TouchableOpacity onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)' as any))} style={{ padding: 4 }}>
          <ArrowLeft size={22} color="#002754" />
        </TouchableOpacity>
        <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: '#002754', letterSpacing: -0.5 }}>
          Shopping Cart
        </Text>
        <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/wishlist' as any)} style={{ padding: 4 }}>
            <Heart size={22} color="#002754" />
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 4, position: 'relative' }}>
            <Bell size={22} color="#002754" />
            <View style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#C5A880' }} />
          </TouchableOpacity>
        </View>
      </View>

      {cartList.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#EBF3FF', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
            <ShoppingBag size={32} color="#002754" />
          </View>
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 24, color: '#002754', marginBottom: 12 }}>Your Cart is Empty</Text>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#434750', textAlign: 'center', marginBottom: 30, lineHeight: 22 }}>
            Looks like you haven't added any artisanal botanicals to your cart yet.
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/shop' as any)} style={{ backgroundColor: '#002754', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 30 }}>
            <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 14 }}>Explore Collection</Text>
          </TouchableOpacity>
        </View>
      ) : (
      <>
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>

        {/* 2. Cart Summary Header Card */}
        <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 16, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.25)' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, fontWeight: '700', color: '#002754' }}>
              Your Atelier Cart
            </Text>
            <View style={{ backgroundColor: '#EBF3FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#002754', fontSize: 11, fontWeight: '700' }}>
                {totalItemsCount} {totalItemsCount === 1 ? 'Product' : 'Products'}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, color: '#059669', fontWeight: '700' }}>
              Saved: ₹{discount}
            </Text>
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, color: '#194682', fontWeight: '700' }}>
              Reward Points: {user?.loyaltyPoints || 0}
            </Text>
          </View>
        </View>

        {/* 3. Cart Items List */}
        <View style={{ paddingHorizontal: CONTAINER_PADDING, marginTop: 18, gap: 14 }}>
          {cartList.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push(`/product/${item.slug}` as any)}
              activeOpacity={0.9}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: 14,
                flexDirection: 'row',
                gap: 14,
                position: 'relative',
                shadowColor: '#0A3D78',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.04,
                shadowRadius: 10,
                borderWidth: 1,
                borderColor: 'rgba(195, 198, 209, 0.25)',
              }}
            >
              {item.badge && (
                <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: item.badgeBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, zIndex: 10 }}>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, color: item.badgeText, fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.badge}</Text>
                </View>
              )}

              <View style={{ width: 90, height: 90, borderRadius: 14, overflow: 'hidden', backgroundColor: '#ECEEF0' }}>
                <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} />
              </View>

              <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 14, fontWeight: '600', color: '#191C1E', lineHeight: 18 }} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                    <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, fontWeight: '700', color: '#002754' }}>
                      ₹{item.price}
                    </Text>
                    {item.originalPrice && (
                      <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#737781', textDecorationLine: 'line-through' }}>
                        ₹{item.originalPrice}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECEEF0', borderRadius: 20, paddingHorizontal: 6, paddingVertical: 3 }}>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        updateQuantity(item.id, Math.max(1, item.quantity - 1));
                      }}
                      style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}
                    >
                      <Minus size={14} color="#002754" />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, color: '#002754', width: 28, textAlign: 'center' }}>
                      {item.quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        updateQuantity(item.id, item.quantity + 1);
                      }}
                      style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}
                    >
                      <Plus size={14} color="#002754" />
                    </TouchableOpacity>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        router.push('/(tabs)/wishlist' as any);
                      }}
                      style={{ padding: 4 }}
                    >
                      <Heart size={18} color="#C3C6D1" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        removeItem(item.id);
                      }}
                      style={{ padding: 4 }}
                    >
                      <Trash2 size={18} color="#BA1A1A" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 4. Delivery Charge Estimator */}
        <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 18, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, gap: 12, shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.2)' }}>
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, fontWeight: '700', color: '#002754' }}>
            Delivery Location &amp; Tariff Rule
          </Text>

          {/* State Dropdown Picker Trigger */}
          <TouchableOpacity
            onPress={() => setIsStateModalOpen(true)}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#F7F9FB',
              borderWidth: 1,
              borderColor: '#002754',
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 12,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MapPin size={18} color="#002754" />
              <View>
                <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 10, color: '#737781', textTransform: 'uppercase' }}>Delivery State</Text>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#002754', fontWeight: '700' }}>{selectedState}</Text>
              </View>
            </View>
            <ChevronDown size={18} color="#002754" />
          </TouchableOpacity>

          <View style={{ backgroundColor: '#EBF3FF', borderRadius: 12, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#002754', fontWeight: '700' }}>
                {totalItemsCount} Cart Products ({selectedState})
              </Text>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#434750', marginTop: 2 }}>
                {deliveryInfo.isFreeDelivery ? 'Free delivery rule applies!' : `Standard tariff for ${selectedState}`}
              </Text>
            </View>
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#002754', fontWeight: '700' }}>
              {deliveryInfo.isFreeDelivery ? 'FREE' : `₹${deliveryInfo.deliveryCharge}`}
            </Text>
          </View>
        </View>

        {/* 5. Order Summary */}
        <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 18, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.2)' }}>
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, fontWeight: '700', color: '#002754', marginBottom: 14 }}>
            Order Summary
          </Text>
          <View style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#434750' }}>Subtotal ({totalItemsCount} items)</Text>
              <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 14, color: '#191C1E' }}>₹{subtotal}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#C5A880' }}>Discount</Text>
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#C5A880' }}>-₹{discount}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#434750' }}>Delivery Charge</Text>
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: deliveryInfo.isFreeDelivery ? '#059669' : '#002754' }}>
                {deliveryInfo.isFreeDelivery ? 'FREE' : `₹${shipping}`}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#434750' }}>GST (18%)</Text>
              <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 14, color: '#191C1E' }}>₹{gst}</Text>
            </View>
            <View style={{ borderTopWidth: 1, borderTopColor: '#E0E3E5', paddingTop: 12, marginTop: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, fontWeight: '700', color: '#002754' }}>Total</Text>
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: '#002754' }}>₹{grandTotal}</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* State Selector Modal */}
      <Modal visible={isStateModalOpen} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '80%', padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, fontWeight: '700', color: '#002754' }}>Select Delivery State</Text>
              <TouchableOpacity onPress={() => setIsStateModalOpen(false)} style={{ padding: 6 }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#737781' }}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 400 }}>
              {ALL_INDIAN_STATES.map((st) => (
                <TouchableOpacity
                  key={st}
                  onPress={() => {
                    setSelectedState(st);
                    setIsStateModalOpen(false);
                  }}
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#F0F2F5',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: selectedState === st ? '#EBF3FF' : 'transparent',
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ fontFamily: selectedState === st ? FONT_SANS_BOLD : FONT_SANS_REGULAR, fontSize: 15, color: '#002754' }}>
                    {st}
                  </Text>
                  {selectedState === st && <Check size={18} color="#002754" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 6. Sticky Checkout Bottom Bar */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: CONTAINER_PADDING, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(195, 198, 209, 0.3)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.08, shadowRadius: 20, zIndex: 100 }}>
        <View>
          <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, fontWeight: '700', color: '#737781', textTransform: 'uppercase', letterSpacing: 0.8 }}>Grand Total</Text>
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 24, fontWeight: '700', color: '#002754' }}>₹{grandTotal}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (user) {
              router.push('/checkout' as any);
            } else {
              router.push('/(auth)/login' as any);
            }
          }}
          style={{ backgroundColor: '#002754', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 30, flexDirection: 'row', alignItems: 'center', gap: 8, shadowColor: '#002754', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 }}
        >
          <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 14, fontWeight: '700' }}>Proceed to Checkout</Text>
          <ArrowRight size={18} color="white" />
        </TouchableOpacity>
      </View>
      </>
      )}
    </SafeAreaView>
  );
}
