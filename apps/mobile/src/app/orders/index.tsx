import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useOrdersQuery } from '@cinmax/hooks';
import type { Order } from '@cinmax/types';

export default function MobileOrdersScreen() {
  const router = useRouter();
  const { data: ordersData } = useOrdersQuery();
  const orders: Order[] = ordersData?.items || [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FB' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        <TouchableOpacity onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)' as any))} style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#0A3D78' }}>
            ← Back to Profile
          </Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 10, fontWeight: '800', letterSpacing: 2, color: '#C5A880', textTransform: 'uppercase' }}>
          Patron Ledger
        </Text>
        <Text style={{ fontSize: 24, fontWeight: '900', color: '#002754', marginTop: 2, marginBottom: 20 }}>
          Order History
        </Text>

        <View style={{ gap: 14 }}>
          {orders.map((ord: Order) => (
            <TouchableOpacity
              key={ord.id}
              onPress={() => router.push(`/orders/${ord.id}` as any)}
              style={{ backgroundColor: 'white', borderRadius: 20, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, gap: 8 }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#002754' }}>
                  {ord.orderNumber}
                </Text>
                <View style={{ backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#0A3D78', textTransform: 'uppercase' }}>
                    {ord.status}
                  </Text>
                </View>
              </View>
              <Text style={{ fontSize: 11, color: '#64748B' }}>
                Placed {new Date(ord.createdAt).toLocaleDateString()} • {ord.items?.length || 2} Items
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <Text style={{ fontSize: 14, fontWeight: '900', color: '#002754' }}>
                  ₹{ord.grandTotal?.toFixed(2) || '499.00'}
                </Text>
                <Text style={{ fontSize: 11, fontWeight: '800', color: '#0A3D78' }}>
                  View Details →
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
