import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useHomeMarketingQuery } from '@cinmax/hooks';
import { getSoapImageSource } from '../constants/soapAssets';
import {
  ArrowLeft,
  Leaf,
  ShieldCheck,
  Award,
  FlaskConical,
  CheckCircle,
  GraduationCap,
  Sparkles,
  Heart,
  Droplets,
  Flame,
  CheckCircle2,
} from 'lucide-react-native';

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

const iconMap: Record<string, any> = {
  Leaf,
  ShieldCheck,
  Award,
  FlaskConical,
  CheckCircle,
  GraduationCap,
  Sparkles,
  Heart,
  Droplets,
  Flame,
};

export default function MobileAboutScreen() {
  const router = useRouter();
  const { data: homeMarketingData, isLoading } = useHomeMarketingQuery();

  const bottomBanner = homeMarketingData?.bottomBanner || {
    title: 'Crafted with Quality',
    subtitle: 'Our state-of-the-art facility ensures every bar meets global standards of purity.',
    buttonText: 'Learn More',
    linkUrl: '/about',
    imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/neem-oil-soap/2.jpg',
  };

  const trustBadges = homeMarketingData?.trustBadges || [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF7F2' }}>
      {/* 1. TOP HEADER BAR */}
      <View
        style={{
          zIndex: 100,
          elevation: 10,
          paddingHorizontal: 20,
          paddingTop: 14,
          paddingBottom: 14,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(197, 168, 128, 0.25)',
          shadowColor: '#0A3D78',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 6,
        }}
      >
        <TouchableOpacity
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)' as any))}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
          style={{ minWidth: 40, minHeight: 40, justifyContent: 'center', alignItems: 'flex-start' }}
        >
          <ArrowLeft size={22} color="#002754" />
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, fontWeight: '700', color: '#002754' }}>
            CINMAX Atelier
          </Text>
          <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 10, color: '#C5A880', letterSpacing: 1, textTransform: 'uppercase' }}>
            Artisanal Botanical Purity
          </Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      {/* 2. CONTENT SCROLL */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* HERO IMAGE BANNER */}
        <View style={{ height: 240, width: '100%', backgroundColor: '#002754', position: 'relative' }}>
          <Image
            source={getSoapImageSource(bottomBanner.imageUrl, 'neem-oil-soap')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 39, 84, 0.55)',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 24,
            }}
          >
            <Text
              style={{
                fontFamily: FONT_SERIF_BOLD,
                fontSize: 26,
                fontWeight: '700',
                color: '#FFFFFF',
                textAlign: 'center',
                marginBottom: 8,
              }}
            >
              {bottomBanner.title || 'Crafted with Quality'}
            </Text>
            <Text
              style={{
                fontFamily: FONT_SANS_REGULAR,
                fontSize: 14,
                color: '#F1F5F9',
                textAlign: 'center',
                maxWidth: 320,
                lineHeight: 20,
              }}
            >
              {bottomBanner.subtitle || 'Our state-of-the-art facility ensures every bar meets global standards of purity and botanical excellence.'}
            </Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
          {/* THE CINMAX PROMISE */}
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 22,
              borderWidth: 1,
              borderColor: 'rgba(197, 168, 128, 0.3)',
              shadowColor: '#0A3D78',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 12,
              marginBottom: 24,
            }}
          >
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: '#C5A880', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>
              Our Cold-Process Heritage
            </Text>
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, color: '#002754', marginBottom: 12 }}>
              Handcrafted in Small Batches
            </Text>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13.5, color: '#475569', lineHeight: 22, marginBottom: 16 }}>
              Every CINMAX soap bar is slow-cured for 6 weeks using time-tested cold-process saponification. We use only food-grade organic oils, therapeutic botanical extracts, and natural mineral clays to nourish and rejuvenate your skin without synthetic detergents or harsh chemicals.
            </Text>

            <View style={{ gap: 10 }}>
              {[
                '100% Pure Organic Cold-Pressed Carrier Oils',
                'Zero SLS, SLES, Parabens, or Synthetic Sulfates',
                'Naturally High Glycerin Content for Deep Hydration',
                'Eco-Friendly, Biodegradable & Cruelty-Free Packaging',
              ].map((point, idx) => (
                <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <CheckCircle2 size={18} color="#C5A880" />
                  <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 13, color: '#002754', flex: 1 }}>
                    {point}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* ADMIN-CONTROLLED TRUST BADGES */}
          {trustBadges.length > 0 && (
            <View style={{ marginBottom: 28 }}>
              <Text
                style={{
                  fontFamily: FONT_SERIF_BOLD,
                  fontSize: 20,
                  color: '#002754',
                  textAlign: 'center',
                  marginBottom: 16,
                }}
              >
                Why Choose CINMAX?
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 }}>
                {trustBadges.map((badge, idx) => {
                  const IconComp = iconMap[badge.iconName] || Leaf;
                  return (
                    <View
                      key={badge.id || idx}
                      style={{
                        width: '48%',
                        backgroundColor: '#FFFFFF',
                        borderRadius: 20,
                        padding: 16,
                        alignItems: 'center',
                        gap: 8,
                        borderWidth: 1,
                        borderColor: 'rgba(195, 198, 209, 0.35)',
                        shadowColor: '#0A3D78',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.03,
                        shadowRadius: 6,
                      }}
                    >
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 24,
                          backgroundColor: 'rgba(0, 39, 84, 0.07)',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <IconComp size={24} color="#002754" />
                      </View>
                      <Text
                        style={{
                          fontFamily: FONT_SANS_BOLD,
                          fontSize: 12,
                          color: '#002754',
                          textAlign: 'center',
                        }}
                      >
                        {badge.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* CTA BUTTON */}
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/shop' as any)}
            activeOpacity={0.85}
            style={{
              backgroundColor: '#002754',
              borderRadius: 22,
              paddingVertical: 14,
              alignItems: 'center',
              shadowColor: '#002754',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 10,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>
              Explore the Botanical Collection
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
