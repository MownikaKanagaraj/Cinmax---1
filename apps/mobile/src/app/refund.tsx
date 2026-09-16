import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, AlertCircle, Phone } from 'lucide-react-native';

const CONTAINER_PADDING = 20;

const FONT_SERIF_BOLD = Platform.select({
  web: "'Noto Serif', Georgia, serif",
  default: 'NotoSerif_700Bold',
});

const FONT_SANS_REGULAR = Platform.select({
  web: "'Plus Jakarta Sans', system-ui, sans-serif",
  default: 'PlusJakartaSans_400Regular',
});

const FONT_SANS_BOLD = Platform.select({
  web: "'Plus Jakarta Sans', system-ui, sans-serif",
  default: 'PlusJakartaSans_700Bold',
});

export default function MobileRefundScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FB' }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: CONTAINER_PADDING,
          paddingVertical: 14,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(195, 198, 209, 0.3)',
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <ChevronLeft size={24} color="#002754" />
        </TouchableOpacity>
        <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, color: '#002754', fontWeight: '700' }}>
          Return &amp; Refund Policy
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: CONTAINER_PADDING, gap: 16, paddingBottom: 50 }}>
        {/* Strict Policy Banner */}
        <View style={{ backgroundColor: '#FEF2F2', borderRadius: 18, padding: 18, borderWidth: 1.5, borderColor: '#FCA5A5', gap: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <AlertCircle size={18} color="#991B1B" />
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 14, color: '#991B1B', fontWeight: '700', textTransform: 'uppercase' }}>
              No Return &amp; No Refund Policy
            </Text>
          </View>
          <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#7F1D1D', lineHeight: 18 }}>
            "All purchases are final. CINMAX follows a No Return and No Refund policy, except where otherwise required by applicable law or specifically approved by CINMAX."
          </Text>
        </View>

        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.3)', gap: 12 }}>
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#002754', fontWeight: '700' }}>
            1. Finality of Sales
          </Text>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', lineHeight: 19 }}>
            Due to the personal care and botanical hygiene nature of our formulations, products once purchased cannot be returned or exchanged. Please verify all product details before placing an order.
          </Text>

          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#002754', fontWeight: '700', marginTop: 8 }}>
            2. Cancellation Policy
          </Text>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', lineHeight: 19 }}>
            Confirmed orders enter immediate batch packing and cannot normally be cancelled. Any exceptional cancellation is subject to CINMAX approval prior to dispatch.
          </Text>

          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#002754', fontWeight: '700', marginTop: 8 }}>
            3. Damaged or Defective Items
          </Text>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', lineHeight: 19 }}>
            If an item arrives damaged or incorrect, contact support within 48 hours of delivery with your order reference and clear unboxing photos/videos. CINMAX will investigate and decide the appropriate resolution.
          </Text>

          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#002754', fontWeight: '700', marginTop: 8 }}>
            4. Exceptional Approved Refunds
          </Text>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', lineHeight: 19 }}>
            If a refund is approved by CINMAX, it will be credited to your original payment method via Razorpay within 5 to 7 business days.
          </Text>
        </View>

        <View style={{ backgroundColor: '#002754', borderRadius: 20, padding: 18, alignItems: 'center', gap: 6 }}>
          <Phone size={24} color="#C5A880" />
          <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#FFFFFF', fontSize: 13 }}>CINMAX Customer Support</Text>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
            Email: support@cinmaxglobal.com • Phone: +91 98765 43210
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
