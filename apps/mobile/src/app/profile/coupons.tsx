import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCouponsQuery } from '@cinmax/hooks';
import type { Coupon } from '@cinmax/types';

export default function MobileCouponsScreen() {
  const router = useRouter();
  const { data: coupons = [] } = useCouponsQuery();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FB' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#0A3D78' }}>
            ← Back to Profile
          </Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 10, fontWeight: '800', letterSpacing: 2, color: '#C5A880', textTransform: 'uppercase' }}>
          Patron Passes
        </Text>
        <Text style={{ fontSize: 24, fontWeight: '900', color: '#002754', marginTop: 2, marginBottom: 20 }}>
          Available Coupons
        </Text>

        <View style={{ gap: 14 }}>
          {coupons.map((c: Coupon) => (
            <View
              key={c.id}
              style={{ backgroundColor: 'white', borderRadius: 20, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, gap: 6 }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, fontWeight: '900', color: '#002754', letterSpacing: 1 }}>
                  {c.code}
                </Text>
                <View style={{ backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 }}>
                  <Text style={{ color: '#D97706', fontSize: 10, fontWeight: '800' }}>
                    {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `$${c.discountValue} OFF`}
                  </Text>
                </View>
              </View>
              <Text style={{ fontSize: 11, color: '#64748B' }}>
                {c.description || 'Valid on all handcrafted soap bars and personal care formulations.'}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
