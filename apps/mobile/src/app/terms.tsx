import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, ShieldCheck } from 'lucide-react-native';

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

export default function MobileTermsScreen() {
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
          Terms &amp; Conditions
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: CONTAINER_PADDING, gap: 16, paddingBottom: 50 }}>
        <View style={{ backgroundColor: '#EBF3FF', borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: '#002754' }}>
          <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#002754', textTransform: 'uppercase', marginBottom: 4 }}>
            Patron Agreement
          </Text>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', lineHeight: 18 }}>
            By registering an account or placing an order on CINMAX, you agree to these Terms &amp; Conditions and Store Policies.
          </Text>
        </View>

        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.3)', gap: 12 }}>
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#002754', fontWeight: '700' }}>
            1. Account &amp; Registration
          </Text>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', lineHeight: 19 }}>
            Customers must provide accurate contact and shipping details. You are responsible for safeguarding your account credentials.
          </Text>

          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#002754', fontWeight: '700', marginTop: 8 }}>
            2. Products &amp; Pricing
          </Text>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', lineHeight: 19 }}>
            All product prices are listed in INR and include applicable GST. Natural batch variations in cold-process soaps are hallmarks of authentic artisanal crafting.
          </Text>

          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#002754', fontWeight: '700', marginTop: 8 }}>
            3. Razorpay Payment Gateway
          </Text>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', lineHeight: 19 }}>
            Payments are processed securely via Razorpay (UPI, Cards, Netbanking). Razorpay acts solely as the payment processing provider and is not responsible for product manufacturing, courier delivery, or returns.
          </Text>

          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#002754', fontWeight: '700', marginTop: 8 }}>
            4. Unsuccessful Payments
          </Text>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', lineHeight: 19 }}>
            Failed or uncaptured payments do not constitute an order. Debited amounts for failed transactions are auto-refunded by Razorpay/your bank within 5-7 working days.
          </Text>

          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#002754', fontWeight: '700', marginTop: 8 }}>
            5. Loyalty Points &amp; Coupons
          </Text>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', lineHeight: 19 }}>
            Loyalty points have a value of 1 Point = ₹1, capped at 20% per order. Points are non-transferable and non-encashable.
          </Text>

          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#002754', fontWeight: '700', marginTop: 8 }}>
            6. Governing Law &amp; Jurisdiction
          </Text>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', lineHeight: 19 }}>
            These terms are governed by the laws of India, subject to the exclusive jurisdiction of courts in Chennai, Tamil Nadu.
          </Text>
        </View>

        <View style={{ backgroundColor: '#002754', borderRadius: 20, padding: 18, alignItems: 'center' }}>
          <ShieldCheck size={28} color="#C5A880" style={{ marginBottom: 6 }} />
          <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#FFFFFF', fontSize: 13 }}>CINMAX Customer Support</Text>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 }}>
            Email: support@cinmaxglobal.com • Phone: +91 98765 43210
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
