import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useOrdersQuery } from '@cinmax/hooks';
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
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
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

export default function MobileOrdersScreen() {
  const router = useRouter();
  const { data: ordersData, isLoading, refetch } = useOrdersQuery();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Orders');

  const filterTabs = ['All Orders', 'Processing', 'Shipped', 'Delivered'];

  const rawOrders = ordersData?.items || [];
  const ordersList = rawOrders.map((ord) => ({
    id: ord.orderNumber || ord.id,
    realId: ord.id,
    date: `Placed on ${new Date(ord.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
    status: ord.status === 'delivered' ? 'Delivered' : ord.status === 'shipped' ? 'Shipped' : 'Processing',
    statusBg: ord.status === 'delivered' ? '#ECEEF0' : '#EBF3FF',
    statusColor: ord.status === 'delivered' ? '#434750' : '#002754',
    productTitle: ord.items?.[0]?.productTitle || 'Artisanal Botanical Bar',
    variant: `Qty: ${ord.items?.reduce((acc, item) => acc + item.quantity, 0) || 1} units`,
    price: `₹${ord.grandTotal}`,
    estDelivery: ord.status === 'delivered' ? 'Delivered' : 'Est. Delivery: 3-5 days',
    image: ord.items?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1607006482602-7650d2037422?w=400',
    progress: ord.status === 'delivered' ? 1.0 : ord.status === 'shipped' ? 0.75 : 0.35,
  }));

  const filteredOrders = ordersList.filter((ord) => {
    const matchesSearch =
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.productTitle.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'All Orders') return matchesSearch;
    return matchesSearch && ord.status.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FB' }}>
      {/* Header Bar */}
      <View style={{ paddingHorizontal: CONTAINER_PADDING, paddingTop: 14, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderBottomWidth: 1, borderBottomColor: 'rgba(195, 198, 209, 0.3)' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <ArrowLeft size={22} color="#002754" />
        </TouchableOpacity>
        <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: '#002754', letterSpacing: -0.5 }}>
          My Dispatches
        </Text>
        <TouchableOpacity onPress={() => refetch()} style={{ padding: 4 }}>
          <RefreshCw size={18} color="#0A3D78" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={{ paddingHorizontal: CONTAINER_PADDING, paddingTop: 16 }}>
          {/* Total Orders Card */}
          <View style={{ backgroundColor: '#002754', borderRadius: 24, padding: 20, marginBottom: 20, shadowColor: '#002754', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, fontWeight: '700', color: '#C5A880', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                  Live Ledger
                </Text>
                <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 24, fontWeight: '700', color: '#FFFFFF', marginTop: 4 }}>
                  {rawOrders.length} {rawOrders.length === 1 ? 'Dispatch' : 'Dispatches'}
                </Text>
              </View>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(197, 168, 128, 0.2)', alignItems: 'center', justifyCenter: 'center' }}>
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
            <View style={{ py: 40, alignItems: 'center' }}>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#64748B' }}>
                Loading live dispatches...
              </Text>
            </View>
          ) : filteredOrders.length === 0 ? (
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 32, alignItems: 'center', borderOutset: 'none', borderStyle: 'solid', borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.3)', marginTop: 10 }}>
              <Package size={40} color="#94A3B8" style={{ marginBottom: 12 }} />
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, color: '#002754', marginBottom: 6 }}>
                No Dispatches Found
              </Text>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 16 }}>
                You have no active or previous order dispatches matching this criteria.
              </Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/shop' as any)} style={{ backgroundColor: '#002754', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#FFFFFF' }}>
                  Browse Collections
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredOrders.map((ord) => (
              <TouchableOpacity
                key={ord.id}
                onPress={() => router.push(`/orders/${ord.realId || ord.id}` as any)}
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

                <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center', paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(195, 198, 209, 0.2)' }}>
                  <Image source={{ uri: ord.image }} style={{ width: 54, height: 54, borderRadius: 12 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: FONT_SERIF_SEMIBOLD, fontSize: 14, color: '#002754' }} numberOfLines={1}>
                      {ord.productTitle}
                    </Text>
                    <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#64748B', marginTop: 2 }}>
                      {ord.variant}
                    </Text>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#002754', marginTop: 4 }}>
                      {ord.price}
                    </Text>
                  </View>
                  <ChevronRight size={18} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
