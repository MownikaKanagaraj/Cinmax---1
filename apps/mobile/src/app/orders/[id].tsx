import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useOrderByIdQuery } from '@cinmax/hooks';

export default function MobileOrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderId = id || 'ord_1';
  const { data: order, isLoading } = useOrderByIdQuery(orderId);

  if (isLoading || !order) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FB', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 14, color: '#64748B' }}>Loading order details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FB' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#0A3D78' }}>
            ← Back to Orders
          </Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 10, fontWeight: '800', letterSpacing: 2, color: '#C5A880', textTransform: 'uppercase' }}>
          Dispatch Details
        </Text>
        <Text style={{ fontSize: 22, fontWeight: '900', color: '#002754', marginTop: 2, marginBottom: 20 }}>
          {order.orderNumber}
        </Text>

        <View style={{ backgroundColor: 'white', borderRadius: 24, padding: 20, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 }}>
          <Text style={{ fontSize: 14, fontWeight: '800', color: '#002754' }}>Status: {order.status.toUpperCase()}</Text>
          <Text style={{ fontSize: 12, color: '#64748B' }}>
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/orders/track' as any)}
            style={{ marginTop: 8, backgroundColor: '#002754', borderRadius: 16, paddingVertical: 12, alignItems: 'center' }}
          >
            <Text style={{ color: 'white', fontWeight: '800', fontSize: 11, textTransform: 'uppercase' }}>
              Track Air Shipment Live
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
