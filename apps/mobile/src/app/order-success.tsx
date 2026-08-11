import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  CheckCircle,
  Package,
  MapPin,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Truck,
} from 'lucide-react-native';

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

export default function MobileOrderSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ deliveryState?: string; totalProducts?: string; deliveryCharge?: string; isFree?: string }>();

  const orderedItems = [
    {
      id: 'os1',
      title: 'Organic Saffron & Honey Soap',
      variant: 'Qty: 2 • 150g',
      price: '₹850',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZHbiWzdqlWotKE_R5mRigs-k-s7pi5XBl-YdVnd9UCCnqB8eYNUzrHKUAbCfoOQrCRiBLSqfGkyKsXxcG88nWUMGwKSZBa5UmV_AlSYmElejlbwO6v1gX4RhqHCzY2Zs4ym1DzNFGvWdGwdLPXlzc_tOU2YWVAzu1Hnlpm0qMEiaLkPNtlo2SZLQrqQqmkVd0TSclg_8dWBTMCuQdIKA3T8Jd7W_9oIOrjpcrGPmFsxvw-BP9QHyG',
    },
    {
      id: 'os2',
      title: 'Revitalizing Botanical Serum',
      variant: 'Qty: 1 • 30ml',
      price: '₹1,450',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA37j4IUoXLKnf_1IBqj8M2-R1wao__PeN5LX5HhNTEPPU6hVX8ZsQufqpL9sWbMgMXoDbDIWfnz6oHnGW6rZBGuBF04icPWyFsAEBejwTEEKqU7a8x_-G3jFTXavGBBKD-QcC5_ZISEg9eA67JEUtRdIfjYgyy1HweEzndmIQgz6WQO46RMpcdCYvCEyz0OeM9YJ--aajtAhgcjdn1NQyVE921mCLIVk2oOhYAakMnQHjadCGBDxzT',
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FB' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60, paddingHorizontal: CONTAINER_PADDING, paddingTop: 30 }}>

        {/* Hero Celebration Badge */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(76, 175, 80, 0.12)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
            <CheckCircle size={44} color="#4CAF50" />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Sparkles size={16} color="#C5A880" />
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#C5A880', letterSpacing: 1.5, textTransform: 'uppercase' }}>
              Order Confirmed
            </Text>
            <Sparkles size={16} color="#C5A880" />
          </View>
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 26, fontWeight: '700', color: '#002754', textAlign: 'center', marginBottom: 8, lineHeight: 32 }}>
            Thank You for Your Order!
          </Text>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', textAlign: 'center', maxWidth: 300, lineHeight: 18 }}>
            We have received your order and are preparing your artisanal package with pure natural care.
          </Text>
        </View>

        {/* Order Info Card */}
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 18, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.25)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.05, shadowRadius: 12, gap: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E0E3E5', paddingBottom: 12 }}>
            <View>
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: '#737781', textTransform: 'uppercase', letterSpacing: 0.8 }}>Order Number</Text>
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, color: '#002754', fontWeight: '700' }}>#CNM-8492</Text>
            </View>
            <View style={{ backgroundColor: '#EBF3FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: '#002754', fontWeight: '700' }}>In Transit</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Truck size={18} color="#002754" />
              <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 13, color: '#191C1E' }}>
                Estimated Delivery: <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#002754' }}>Oct 28, 2023</Text>
              </Text>
            </View>
            <View style={{ backgroundColor: '#EBF3FF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, color: '#002754', fontWeight: '700' }}>Paid via Razorpay</Text>
            </View>
          </View>
        </View>

        {/* Delivery Address & Tariff Details */}
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, marginBottom: 18, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.25)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MapPin size={18} color="#002754" />
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, color: '#002754', fontWeight: '700' }}>Delivery Destination</Text>
            </View>
            <View style={{ backgroundColor: '#EBF3FF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#002754', fontSize: 10, fontWeight: '700' }}>
                State: {params?.deliveryState || 'Tamil Nadu'}
              </Text>
            </View>
          </View>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', lineHeight: 18 }}>
            Aanya Sharma{'\n'}
            Villa 42, Lotus Boulevard, Sector 100, Noida, UP 201304{'\n'}
            +91 98765 43210
          </Text>
          <View style={{ borderTopWidth: 1, borderTopColor: '#F0F2F5', paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#434750' }}>
              Delivery Fee ({params?.totalProducts || '3'} products)
            </Text>
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: params?.isFree === 'true' ? '#059669' : '#002754', fontWeight: '700' }}>
              {params?.isFree === 'true' ? 'FREE' : `₹${params?.deliveryCharge || '60'}`}
            </Text>
          </View>
        </View>

        {/* Ordered Items List */}
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.25)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, gap: 12 }}>
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, fontWeight: '700', color: '#002754' }}>
            Items Ordered (2)
          </Text>
          {orderedItems.map((item) => (
            <View key={item.id} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <Image source={{ uri: item.image }} style={{ width: 54, height: 54, borderRadius: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, color: '#191C1E' }} numberOfLines={1}>{item.title}</Text>
                <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#737781' }}>{item.variant}</Text>
              </View>
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 14, color: '#002754', fontWeight: '700' }}>{item.price}</Text>
            </View>
          ))}
          <View style={{ borderTopWidth: 1, borderTopColor: '#E0E3E5', paddingTop: 10, marginTop: 4, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, color: '#434750' }}>Total Amount Paid</Text>
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#002754', fontWeight: '700' }}>₹2,356</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ gap: 12 }}>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/orders' as any)}
            style={{ backgroundColor: '#002754', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, shadowColor: '#002754', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 }}
          >
            <Package size={18} color="white" />
            <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>Track Order</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)' as any)}
            style={{ backgroundColor: '#ECEEF0', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}
          >
            <ShoppingBag size={18} color="#002754" />
            <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#002754', fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
