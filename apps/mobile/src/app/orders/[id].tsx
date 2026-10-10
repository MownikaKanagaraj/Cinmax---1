import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Truck,
  Package,
  MapPin,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react-native';
import { useOrderByIdQuery } from '@cinmax/hooks';
import { getProductFallbackImage } from '@cinmax/utils';
import type { OrderItem } from '@cinmax/types';

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

export default function MobileOrderDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const orderId = params.id || '';

  const {
    data: order,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useOrderByIdQuery(orderId, {
    enabled: Boolean(orderId),
  });

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF7F2', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#002754" />
        <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', marginTop: 12 }}>
          Retrieving order details...
        </Text>
      </SafeAreaView>
    );
  }

  if (isError || !order) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF7F2' }}>
        <View style={{ paddingHorizontal: CONTAINER_PADDING, paddingTop: 14 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 6 }}>
            <ArrowLeft size={22} color="#002754" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <AlertCircle size={44} color="#DC2626" />
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, color: '#002754', marginTop: 12, marginBottom: 6 }}>
            Order Not Found
          </Text>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#737781', textAlign: 'center', marginBottom: 20 }}>
            Unable to load the requested order details.
          </Text>
          <TouchableOpacity
            onPress={() => router.replace('/orders' as any)}
            style={{ backgroundColor: '#002754', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 }}
          >
            <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 13 }}>View All Orders</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const status = (order.status || 'pending').toLowerCase();
  const isDelivered = status === 'delivered';
  const isCancelled = status === 'cancelled' || status === 'refunded';

  const statusColor = isDelivered ? '#10B981' : isCancelled ? '#EF4444' : '#0A3D78';
  const statusBg = isDelivered ? '#ECFDF5' : isCancelled ? '#FEF2F2' : '#EFF6FF';

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
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/orders' as any))}
          style={{ padding: 6, flexDirection: 'row', alignItems: 'center' }}
        >
          <ArrowLeft size={20} color="#002754" />
          <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, fontWeight: '700', color: '#002754', marginLeft: 4 }}>
            Orders
          </Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, fontWeight: '700', color: '#002754' }}>
            {order.orderNumber}
          </Text>
          <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 9, color: '#C5A880', textTransform: 'uppercase', letterSpacing: 0.8 }}>
            Placed {new Date(order.createdAt).toLocaleDateString()}
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
        {/* 2. LIVE TRACKING CTA CARD */}
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/orders/track', params: { id: order.id } } as any)}
          style={{
            backgroundColor: '#002754',
            borderRadius: 22,
            padding: 18,
            marginBottom: 18,
            borderWidth: 1,
            borderColor: 'rgba(197, 168, 128, 0.4)',
            shadowColor: '#0A3D78',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <Truck size={18} color="#C5A880" />
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#C5A880', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>
                LIVE FULFILLMENT TELEMETRY
              </Text>
            </View>
            <View style={{ backgroundColor: statusBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: statusColor, fontSize: 10, textTransform: 'uppercase' }}>
                {status.replace(/_/g, ' ')}
              </Text>
            </View>
          </View>

          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, color: 'white', fontWeight: '700' }}>
            {isDelivered
              ? 'Package Delivered Successfully'
              : isCancelled
              ? 'Order Has Been Cancelled'
              : status === 'out_for_delivery'
              ? 'Out for Delivery Today'
              : status === 'shipped'
              ? 'In Transit with Courier'
              : 'Processing & Artisan Packing'}
          </Text>

          {order.trackingNumber ? (
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
              AWB: {order.trackingNumber} • {order.carrier || 'Priority Express'}
            </Text>
          ) : (
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
              Estimated Delivery: {order.estimatedDeliveryDate || '3-5 Business Days'}
            </Text>
          )}

          <View style={{ marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.12)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#F3E5D8', fontSize: 12 }}>
              View Step-by-Step Live Tracking
            </Text>
            <ChevronRight size={16} color="#F3E5D8" />
          </View>
        </TouchableOpacity>

        {/* 3. ORDERED PRODUCTS */}
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 22,
            padding: 18,
            marginBottom: 18,
            borderWidth: 1,
            borderColor: 'rgba(195, 198, 209, 0.4)',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Package size={17} color="#002754" />
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#002754' }}>
              Ordered Items ({order.items?.length || 0})
            </Text>
          </View>

          <View style={{ gap: 14 }}>
            {order.items?.map((item: OrderItem, idx: number) => (
              <View key={item.id || idx} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                <Image
                  source={{
                    uri:
                      item.imageUrl ||
                      getProductFallbackImage(item.productTitle, 1),
                  }}
                  style={{ width: 60, height: 60, borderRadius: 12, backgroundColor: '#F1F5F9' }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, color: '#002754' }} numberOfLines={1}>
                    {item.productTitle}
                  </Text>
                  {item.variantTitle ? (
                    <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#737781', marginTop: 1 }}>
                      {item.variantTitle}
                    </Text>
                  ) : null}
                  <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#434750', marginTop: 2 }}>
                    Qty: {item.quantity} × ₹{item.unitPrice}
                  </Text>
                </View>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#002754', fontWeight: '700' }}>
                  ₹{(item.totalPrice || item.unitPrice * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 4. SHIPPING ADDRESS */}
        {order.shippingAddress ? (
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 22,
              padding: 18,
              marginBottom: 18,
              borderWidth: 1,
              borderColor: 'rgba(195, 198, 209, 0.4)',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <MapPin size={17} color="#002754" />
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#002754' }}>
                Delivery Destination
              </Text>
            </View>
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, color: '#191C1E' }}>
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </Text>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#434750', marginTop: 2 }}>
              {order.shippingAddress.streetLine1}
              {order.shippingAddress.streetLine2 ? `, ${order.shippingAddress.streetLine2}` : ''}
            </Text>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#434750', marginTop: 2 }}>
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
            </Text>
            {order.shippingAddress.phone ? (
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#737781', marginTop: 4 }}>
                Phone: {order.shippingAddress.phone}
              </Text>
            ) : null}
          </View>
        ) : null}

        {/* 5. PRICE BREAKDOWN */}
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 22,
            padding: 18,
            marginBottom: 18,
            borderWidth: 1,
            borderColor: 'rgba(195, 198, 209, 0.4)',
            gap: 10,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <CreditCard size={17} color="#002754" />
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#002754' }}>
              Payment Summary
            </Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#64748B' }}>Items Subtotal</Text>
            <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 12, color: '#002754' }}>
              ₹{(order.subtotal || 0).toFixed(2)}
            </Text>
          </View>

          {order.discountTotal > 0 && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#059669' }}>Discounts Applied</Text>
              <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 12, color: '#059669' }}>
                -₹{order.discountTotal.toFixed(2)}
              </Text>
            </View>
          )}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#64748B' }}>Shipping & Handling</Text>
            <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 12, color: '#002754' }}>
              {order.shippingTotal > 0 ? `₹${order.shippingTotal.toFixed(2)}` : 'FREE'}
            </Text>
          </View>

          <View style={{ height: 1, backgroundColor: '#F1F5F9', marginVertical: 4 }} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#002754' }}>Grand Total</Text>
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, color: '#002754', fontWeight: '700' }}>
              ₹{(order.grandTotal || 0).toFixed(2)}
            </Text>
          </View>

          <View style={{ backgroundColor: '#F8FAFC', borderRadius: 10, padding: 10, marginTop: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#64748B' }}>
              Payment: {order.paymentMethod ? order.paymentMethod.toUpperCase() : 'ONLINE'}
            </Text>
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: order.paymentStatus === 'paid' ? '#059669' : '#D97706', textTransform: 'uppercase' }}>
              {order.paymentStatus || 'PAID'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
