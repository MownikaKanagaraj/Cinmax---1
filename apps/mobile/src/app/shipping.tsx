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
import { ChevronLeft, Truck, MapPin } from 'lucide-react-native';

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

export default function MobileShippingScreen() {
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
          Shipping &amp; Delivery Policy
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: CONTAINER_PADDING, gap: 16, paddingBottom: 50 }}>
        <View style={{ backgroundColor: '#EBF3FF', borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: '#002754', gap: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Truck size={18} color="#002754" />
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#002754', textTransform: 'uppercase' }}>
              Dispatch &amp; Delivery Timeline
            </Text>
          </View>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', lineHeight: 18 }}>
            Orders are packed and dispatched within 24 to 48 business hours of payment confirmation.
          </Text>
        </View>

        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.3)', gap: 12 }}>
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#002754', fontWeight: '700' }}>
            1. Delivery Timelines
          </Text>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', lineHeight: 19 }}>
            • South India (Tamil Nadu, Puducherry, Kerala, Karnataka, AP, Telangana): 2 – 4 Business Days{'\n'}
            • Rest of India &amp; Metro Cities: 4 – 7 Business Days
          </Text>

          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#002754', fontWeight: '700', marginTop: 8 }}>
            2. Shipping Charges
          </Text>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', lineHeight: 19 }}>
            • Tamil Nadu &amp; Puducherry: ₹60{'\n'}
            • Other South Indian States: ₹80{'\n'}
            • Rest of India: ₹100{'\n'}
            • Free Shipping: Orders above ₹1,499 or qualifying promo vouchers.
          </Text>

          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#002754', fontWeight: '700', marginTop: 8 }}>
            3. Address Accuracy &amp; Delays
          </Text>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', lineHeight: 19 }}>
            Customers must ensure complete address, landmark, pincode, and 10-digit mobile number are correct. CINMAX is not liable for delays caused by courier logistics or weather disruptions.
          </Text>
        </View>

        <View style={{ backgroundColor: '#002754', borderRadius: 20, padding: 18, alignItems: 'center', gap: 6 }}>
          <MapPin size={24} color="#C5A880" />
          <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#FFFFFF', fontSize: 13 }}>Live Courier Tracking</Text>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, color: 'rgba(255,255,255,0.7)', fontSize: 11, textAlign: 'center' }}>
            Track your order dispatch anytime directly under the My Orders tab.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
