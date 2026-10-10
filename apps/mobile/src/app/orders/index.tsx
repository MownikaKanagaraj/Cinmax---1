import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Package, ChevronRight, ShoppingBag, Clock } from 'lucide-react-native';
import { useOrdersQuery } from '@cinmax/hooks';
import type { Order } from '@cinmax/types';

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

export default function MobileOrdersScreen() {
  const router = useRouter();
  const { data: ordersData, isLoading, refetch, isFetching } = useOrdersQuery();
  const orders: Order[] = ordersData?.items || [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF7F2' }}>
      {/* 1. TOP HEADER */}
      <View
        style={{
          paddingHorizontal: CONTAINER_PADDING,
          paddingTop: 14,
          paddingBottom: 12,
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
          zIndex: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/profile' as any))}
          style={{ padding: 6, flexDirection: 'row', alignItems: 'center' }}
        >
          <ArrowLeft size={20} color="#002754" />
          <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, fontWeight: '700', color: '#002754', marginLeft: 4 }}>
            Profile
          </Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, fontWeight: '700', color: '#002754' }}>
            My Orders
          </Text>
          <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 9, color: '#C5A880', textTransform: 'uppercase', letterSpacing: 0.8 }}>
            Patron Ledger
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: CONTAINER_PADDING, paddingBottom: 60 }}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor="#002754"
            colors={['#002754', '#C5A880']}
          />
        }
      >
        {isLoading ? (
          <View style={{ paddingVertical: 60, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <ActivityIndicator size="large" color="#002754" />
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750' }}>
              Loading order history...
            </Text>
          </View>
        ) : orders.length === 0 ? (
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 24,
              padding: 32,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(195, 198, 209, 0.4)',
              marginTop: 20,
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: 'rgba(0, 39, 84, 0.06)',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <Package size={28} color="#002754" />
            </View>
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, color: '#002754', marginBottom: 6 }}>
              No Orders Placed Yet
            </Text>
            <Text
              style={{
                fontFamily: FONT_SANS_REGULAR,
                fontSize: 13,
                color: '#737781',
                textAlign: 'center',
                marginBottom: 20,
                lineHeight: 18,
              }}
            >
              Explore our artisanal cold-processed soap collection and place your first order.
            </Text>
            <TouchableOpacity
              onPress={() => router.replace('/(tabs)/shop' as any)}
              style={{
                backgroundColor: '#002754',
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 14,
                flexDirection: 'row',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <ShoppingBag size={16} color="white" />
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 13 }}>
                Explore Collection
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ gap: 14 }}>
            {orders.map((ord: Order) => {
              const status = (ord.status || 'pending').toLowerCase();
              const isDelivered = status === 'delivered';
              const isCancelled = status === 'cancelled' || status === 'refunded';

              const statusColor = isDelivered ? '#10B981' : isCancelled ? '#EF4444' : '#0A3D78';
              const statusBg = isDelivered ? '#ECFDF5' : isCancelled ? '#FEF2F2' : '#EFF6FF';

              return (
                <TouchableOpacity
                  key={ord.id}
                  onPress={() => router.push(`/orders/${ord.id}` as any)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 20,
                    padding: 18,
                    borderWidth: 1,
                    borderColor: 'rgba(195, 198, 209, 0.4)',
                    shadowColor: '#0A3D78',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04,
                    shadowRadius: 6,
                    gap: 10,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 15, fontWeight: '700', color: '#002754' }}>
                      {ord.orderNumber}
                    </Text>
                    <View style={{ backgroundColor: statusBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                      <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, color: statusColor, textTransform: 'uppercase' }}>
                        {status.replace(/_/g, ' ')}
                      </Text>
                    </View>
                  </View>

                  <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#64748B' }}>
                    Placed on {new Date(ord.createdAt).toLocaleDateString()} • {ord.items?.length || 1} Item(s)
                  </Text>

                  {ord.trackingNumber ? (
                    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                      <Clock size={12} color="#059669" />
                      <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 11, color: '#059669' }}>
                        AWB: {ord.trackingNumber} ({ord.carrier || 'Express'})
                      </Text>
                    </View>
                  ) : null}

                  <View
                    style={{
                      height: 1,
                      backgroundColor: '#F1F5F9',
                      marginVertical: 2,
                    }}
                  />

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 16, fontWeight: '700', color: '#002754' }}>
                      ₹{(ord.grandTotal || 0).toFixed(2)}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                      <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#0A3D78' }}>
                        Track & Details
                      </Text>
                      <ChevronRight size={14} color="#0A3D78" />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
