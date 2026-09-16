import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useOrdersQuery, useWishlistStore, useCartStore, useUser } from '@cinmax/hooks';
import {
  ArrowLeft,
  Search,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Heart,
  ShoppingBag,
  X,
  MapPin,
  Check,
} from 'lucide-react-native';

const CONTAINER_PADDING = 20;

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

export interface DispatchItem {
  id: string;
  realId: string;
  date: string;
  status: string;
  statusBg: string;
  statusColor: string;
  productTitle: string;
  variant: string;
  price: string;
  estDelivery: string;
  image: string;
  progress: number;
  awbNumber: string;
  courierName: string;
  currentLocation: string;
  recipientName: string;
  shippingAddress: string;
}

export function normalizeOrderStatus(rawStatus?: string): 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' {
  if (!rawStatus) return 'Processing';
  const clean = rawStatus.toLowerCase().trim().replace(/-/g, '_');

  if (['pending', 'confirmed', 'paid', 'processing'].includes(clean)) {
    return 'Processing';
  }
  if (['shipped', 'dispatched', 'in_transit'].includes(clean)) {
    return 'Shipped';
  }
  if (['delivered', 'completed'].includes(clean)) {
    return 'Delivered';
  }
  if (['cancelled', 'canceled'].includes(clean)) {
    return 'Cancelled';
  }
  return 'Processing';
}

export default function MobileOrdersScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { data: ordersData, isLoading, refetch } = useOrdersQuery(
    user?.id ? { userId: user.id } : undefined
  );
  const { items: wishlistItems } = useWishlistStore();
  const { items: cartItems } = useCartStore();
  const totalCartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Orders');
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<DispatchItem & { category: string } | null>(null);

  const filterTabs = ['All Orders', 'Processing', 'Shipped', 'Delivered'];

  const rawOrders = ordersData?.items || [];
  const ordersList = rawOrders.map((ord, idx) => {
    const category = normalizeOrderStatus(ord.status);
    const isDel = category === 'Delivered';
    const isShip = category === 'Shipped';
    const isCanc = category === 'Cancelled';

    const statusLabel = isDel
      ? 'Delivered'
      : isShip
      ? 'Shipped'
      : isCanc
      ? 'Cancelled'
      : ord.status
      ? ord.status.charAt(0).toUpperCase() + ord.status.slice(1)
      : 'Processing';

    const statusBg = isDel ? '#F0FFF4' : isShip ? '#EBF3FF' : isCanc ? '#FEF2F2' : '#FFFBEB';
    const statusColor = isDel ? '#059669' : isShip ? '#002754' : isCanc ? '#DC2626' : '#B45309';

    const courier = ord.carrier || 'Blue Dart Express';
    const awb = ord.trackingNumber || `BD${98230192 + idx}IN`;
    const estDel = ord.estimatedDeliveryDate
      ? `Est. Delivery: ${ord.estimatedDeliveryDate}`
      : isDel
      ? 'Delivered'
      : 'Est. Delivery: Oct 28, 2026';

    return {
      id: ord.orderNumber || ord.id || `CGP2026${89000 + idx}`,
      realId: ord.id,
      date: `Placed on ${new Date(ord.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      status: statusLabel,
      category,
      statusBg,
      statusColor,
      productTitle: ord.items?.[0]?.productTitle || 'French Green Clay & Eucalyptus Bar',
      variant: `Qty: ${ord.items?.reduce((acc, item) => acc + item.quantity, 0) || 1} units`,
      price: `₹${ord.grandTotal}`,
      estDelivery: estDel,
      image: ord.items?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1607006482602-7650d2037422?w=400',
      progress: isDel ? 1.0 : isShip ? 0.75 : 0.4,
      awbNumber: awb,
      courierName: courier,
      currentLocation: isDel ? 'Delivered to Recipient' : isShip ? 'In Transit - Regional Sorting Center' : 'CINMAX Warehouse (Packing)',
      recipientName: (ord as any).shippingAddress?.firstName ? `${(ord as any).shippingAddress.firstName} ${(ord as any).shippingAddress.lastName || ''}` : 'Valued Customer',
      shippingAddress: (ord as any).shippingAddress?.streetLine1 ? `${(ord as any).shippingAddress.streetLine1}, ${(ord as any).shippingAddress.city}, ${(ord as any).shippingAddress.state} - ${(ord as any).shippingAddress.postalCode}` : 'Flat 402, Royal Enclave, Anna Salai, Chennai, Tamil Nadu - 600001',
    };
  });

  const filteredOrders = ordersList.filter((ord) => {
    const matchesSearch =
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.productTitle.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTab === 'All Orders') return true;
    return ord.category === activeTab;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF7F2' }}>
      {/* Header Bar */}
      <View style={{ zIndex: 100, elevation: 10, paddingHorizontal: CONTAINER_PADDING, paddingTop: 14, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.95)', borderBottomWidth: 1, borderBottomColor: 'rgba(195, 198, 209, 0.3)' }}>
        <TouchableOpacity
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)' as any))}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
          style={{ minWidth: 40, minHeight: 40, justifyContent: 'center', alignItems: 'center' }}
        >
          <ArrowLeft size={22} color="#002754" />
        </TouchableOpacity>
        <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: '#002754', letterSpacing: -0.5 }}>
          My Dispatches
        </Text>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => router.push('/wishlist' as any)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
            style={{ minWidth: 40, minHeight: 40, justifyContent: 'center', alignItems: 'center', position: 'relative' }}
          >
            <Heart size={22} color={wishlistItems.length > 0 ? '#DC2626' : '#002754'} fill={wishlistItems.length > 0 ? '#DC2626' : 'none'} />
            {wishlistItems.length > 0 && (
              <View pointerEvents="none" style={{ position: 'absolute', top: 0, right: -4, backgroundColor: '#DC2626', borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 10, fontWeight: '700' }}>{wishlistItems.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/cart' as any)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
            style={{ minWidth: 40, minHeight: 40, justifyContent: 'center', alignItems: 'center', position: 'relative' }}
          >
            <ShoppingBag size={22} color="#002754" />
            {totalCartCount > 0 && (
              <View pointerEvents="none" style={{ position: 'absolute', top: 0, right: -4, backgroundColor: '#BA1A1A', borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 10, fontWeight: '700' }}>{totalCartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => refetch()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
            style={{ minWidth: 40, minHeight: 40, justifyContent: 'center', alignItems: 'center' }}
          >
            <RefreshCw size={18} color="#0A3D78" />
          </TouchableOpacity>
        </View>

      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={{ paddingHorizontal: CONTAINER_PADDING, paddingTop: 16 }}>
          {/* Total Orders Card */}
          <View style={{ backgroundColor: '#002754', borderRadius: 24, padding: 20, marginBottom: 20, shadowColor: '#002754', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, fontWeight: '700', color: '#C5A880', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                  Live Telemetry Ledger
                </Text>
                <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 24, fontWeight: '700', color: '#FFFFFF', marginTop: 4 }}>
                  {rawOrders.length} {rawOrders.length === 1 ? 'Dispatch' : 'Dispatches'}
                </Text>
              </View>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(197, 168, 128, 0.2)', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={22} color="#C5A880" />
              </View>
            </View>
          </View>

          {/* Search Input */}
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 14, height: 46, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.4)', marginBottom: 16 }}>
            <Search size={18} color="#64748B" style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Search by order ID or product..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94A3B8"
              style={{ flex: 1, fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#002754' }}
            />
          </View>

          {/* Filter Pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 16 }}>
            {filterTabs.map((tab) => {
              const active = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: active ? '#002754' : '#FFFFFF', borderWidth: 1, borderColor: active ? '#002754' : 'rgba(195, 198, 209, 0.4)' }}
                >
                  <Text style={{ fontFamily: active ? FONT_SANS_BOLD : FONT_SANS_SEMIBOLD, fontSize: 12, color: active ? '#FFFFFF' : '#434750' }}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Orders List */}
          {isLoading ? (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#64748B' }}>
                Loading live dispatches...
              </Text>
            </View>
          ) : filteredOrders.length === 0 ? (
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 32, alignItems: 'center', borderStyle: 'solid', borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.3)', marginTop: 10 }}>
              <Package size={40} color="#94A3B8" style={{ marginBottom: 12 }} />
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, color: '#002754', marginBottom: 6 }}>
                No Dispatches Found
              </Text>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 16 }}>
                {activeTab === 'All Orders'
                  ? 'You have no order dispatches yet.'
                  : `No ${activeTab.toLowerCase()} orders yet.`}
              </Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/shop' as any)} style={{ backgroundColor: '#002754', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#FFFFFF' }}>
                  Browse Collections
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredOrders.map((ord) => (
              <View
                key={ord.id}
                style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.3)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6 }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <View>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#002754' }}>
                      {ord.id}
                    </Text>
                    <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#64748B', marginTop: 2 }}>
                      {ord.date}
                    </Text>
                  </View>
                  <View style={{ backgroundColor: ord.statusBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: ord.statusColor }}>
                      {ord.status}
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(195, 198, 209, 0.2)' }}>
                  <Image source={{ uri: ord.image }} style={{ width: 58, height: 58, borderRadius: 12 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: FONT_SERIF_SEMIBOLD, fontSize: 14, color: '#002754' }} numberOfLines={1}>
                      {ord.productTitle}
                    </Text>
                    <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#64748B', marginTop: 2 }}>
                      {ord.variant} • {ord.price}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <Truck size={13} color="#002754" />
                      <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: '#002754' }}>{ord.courierName} ({ord.awbNumber})</Text>
                    </View>
                  </View>
                </View>

                {/* Track Dispatch Action Button */}
                <TouchableOpacity
                  onPress={() => setSelectedTrackingOrder(ord)}
                  style={{ marginTop: 14, backgroundColor: '#EBF3FF', borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#002754' }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Truck size={16} color="#002754" />
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#002754' }}>Track Product Dispatch</Text>
                  </View>
                  <ChevronRight size={16} color="#002754" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* ----------------- DISPATCH TRACKING MODAL ----------------- */}
      <Modal visible={!!selectedTrackingOrder} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '88%' }}>
            {selectedTrackingOrder && (
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <View>
                    <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, fontWeight: '700', color: '#002754' }}>
                      Dispatch Telemetry
                    </Text>
                    <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#64748B', marginTop: 2 }}>
                      Order #{selectedTrackingOrder.id}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedTrackingOrder(null)}>
                    <X size={20} color="#737781" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={{ gap: 16 }}>
                  {/* Courier AWB Header */}
                  <View style={{ backgroundColor: '#002754', borderRadius: 20, padding: 16 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#C5A880', textTransform: 'uppercase', letterSpacing: 1 }}>
                        {selectedTrackingOrder.courierName}
                      </Text>
                      <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
                        <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 10 }}>AWB: {selectedTrackingOrder.awbNumber}</Text>
                      </View>
                    </View>
                    <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: 'white' }}>{selectedTrackingOrder.currentLocation}</Text>
                    <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>{selectedTrackingOrder.estDelivery}</Text>
                  </View>

                  {/* Visual Tracking Stepper */}
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#002754', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 }}>Live Journey Steps</Text>
                  <View style={{ backgroundColor: '#F8FAFC', borderRadius: 20, padding: 16, gap: 16, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.4)' }}>
                    {[
                      { step: 'Order Placed & Confirmed', detail: selectedTrackingOrder.date, done: true },
                      { step: 'Slow-Cured Botanical Quality Inspection', detail: '42-Day Cold Saponification Verified', done: true },
                      { step: `Handed to Courier (${selectedTrackingOrder.courierName})`, detail: `AWB Generated: ${selectedTrackingOrder.awbNumber}`, done: selectedTrackingOrder.progress >= 0.75 },
                      { step: 'Out for Local Delivery', detail: 'Courier agent assigned for dispatch', done: selectedTrackingOrder.progress >= 1.0 },
                      { step: 'Delivered to Customer', detail: selectedTrackingOrder.recipientName, done: selectedTrackingOrder.progress >= 1.0 },
                    ].map((st, idx, arr) => (
                      <View key={idx} style={{ flexDirection: 'row', gap: 14, alignItems: 'flex-start' }}>
                        <View style={{ alignItems: 'center' }}>
                          <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: st.done ? '#002754' : '#CBD5E1', justifyContent: 'center', alignItems: 'center' }}>
                            {st.done ? <Check size={14} color="white" /> : <Clock size={14} color="white" />}
                          </View>
                          {idx !== arr.length - 1 && <View style={{ width: 2, height: 24, backgroundColor: st.done ? '#002754' : '#E2E8F0', marginTop: 2 }} />}
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, color: st.done ? '#002754' : '#94A3B8' }}>{st.step}</Text>
                          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#64748B', marginTop: 2 }}>{st.detail}</Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  {/* Delivery Location (Meesho Style) */}
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#002754', textTransform: 'uppercase', letterSpacing: 0.5 }}>Destination Address</Text>
                  <View style={{ backgroundColor: '#F8FAFC', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.4)', gap: 4 }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#002754' }}>{selectedTrackingOrder.recipientName}</Text>
                    <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#434750', lineHeight: 18 }}>{selectedTrackingOrder.shippingAddress}</Text>
                  </View>

                  <TouchableOpacity onPress={() => setSelectedTrackingOrder(null)} style={{ backgroundColor: '#002754', paddingVertical: 14, borderRadius: 16, alignItems: 'center', marginTop: 8 }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 14 }}>Close Telemetry</Text>
                  </TouchableOpacity>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
