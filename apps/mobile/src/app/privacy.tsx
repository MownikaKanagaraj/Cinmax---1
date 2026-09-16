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
import { ChevronLeft, Lock } from 'lucide-react-native';

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

export default function MobilePrivacyScreen() {
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
          Privacy &amp; Data Protection
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: CONTAINER_PADDING, gap: 16, paddingBottom: 50 }}>
        <View style={{ backgroundColor: '#EBF3FF', borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: '#002754', gap: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Lock size={18} color="#002754" />
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#002754', textTransform: 'uppercase' }}>
              Encrypted Data Security
            </Text>
          </View>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', lineHeight: 18 }}>
            CINMAX never stores your credit card details, UPI PINs, or banking passwords.
          </Text>
        </View>

        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.3)', gap: 12 }}>
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#002754', fontWeight: '700' }}>
            1. Information Collected
          </Text>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', lineHeight: 19 }}>
            We collect essential details (name, phone, email, shipping address) to process orders, credit loyalty points, and send courier updates.
          </Text>

          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#002754', fontWeight: '700', marginTop: 8 }}>
            2. Razorpay Payment Security
          </Text>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', lineHeight: 19 }}>
            All payments are encrypted via PCI-DSS compliant Razorpay with 256-bit SSL protection. Your banking credentials are never exposed to our servers.
          </Text>

          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#002754', fontWeight: '700', marginTop: 8 }}>
            3. Privacy Support
          </Text>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', lineHeight: 19 }}>
            To request personal data archive deletion or privacy assistance, email support@cinmaxglobal.com.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
