import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Linking,
  RefreshControl,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Sparkles,
  MapPin,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Copy,
  ChevronRight,
} from 'lucide-react-native';
import { useOrderByIdQuery } from '@cinmax/hooks';
import type { OrderStatus } from '@cinmax/types';

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

function getCourierTrackingUrl(carrier?: string, trackingNumber?: string, directUrl?: string): string | null {
  if (directUrl && directUrl.startsWith('http')) return directUrl;
  if (!trackingNumber) return null;

  const cleanCarrier = (carrier || '').toLowerCase();
  if (cleanCarrier.includes('blue dart') || cleanCarrier.includes('bluedart')) {
    return `https://www.bluedart.com/tracking?trackNumber=${encodeURIComponent(trackingNumber)}`;
  }
  if (cleanCarrier.includes('delhivery')) {
    return `https://www.delhivery.com/track/package/${encodeURIComponent(trackingNumber)}`;
  }
  if (cleanCarrier.includes('dtdc')) {
    return `https://www.dtdc.in/tracking/shipment-tracking.asp?trkType=awb&strCnno=${encodeURIComponent(trackingNumber)}`;
  }
  if (cleanCarrier.includes('india post') || cleanCarrier.includes('speedpost')) {
    return `https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx`;
  }
  if (cleanCarrier.includes('shiprocket')) {
    return `https://www.shiprocket.in/shipment-tracking/?tracking_id=${encodeURIComponent(trackingNumber)}`;
  }
  return `https://www.shiprocket.in/shipment-tracking/?tracking_id=${encodeURIComponent(trackingNumber)}`;
}

interface TrackingStage {
  key: string;
  title: string;
  subtitle: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
  date?: string;
  icon: any;
}

export default function MobileTrackOrderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; orderId?: string }>();
  const orderId = params.id || params.orderId || '';

  const {
    data: order,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useOrderByIdQuery(orderId, {
    enabled: Boolean(orderId),
  });

  const [copied, setCopied] = useState(false);

  const handleCopyAWB = (awb: string) => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenCourier = async (url: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      }
    } catch (e) {
      console.warn('Failed to open tracking URL:', e);
    }
  };

  // Determine stage progression
  const status = (order?.status || 'pending').toLowerCase() as OrderStatus;
  const isCancelled = status === 'cancelled' || status === 'refunded';

  const orderDateFormatted = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Placed';

  const estDateFormatted = order?.estimatedDeliveryDate || '3-5 Business Days';

  // Build the 6-stage lifecycle
  // 1: Order Placed
  // 2: Order Confirmed
  // 3: Processing & Packing
  // 4: Shipped with Courier
  // 5: Out for Delivery
  // 6: Delivered
  const stages: TrackingStage[] = [
    {
      key: 'placed',
      title: 'Order Placed',
      subtitle: 'Order received & recorded',
      description: 'Your bespoke botanical selection has been safely received.',
      isCompleted: true,
      isCurrent: status === 'pending',
      date: orderDateFormatted,
      icon: Package,
    },
    {
      key: 'confirmed',
      title: 'Order Confirmed',
      subtitle: 'Payment verified & batch allocated',
      description: 'Payment authorized and soap batch allocated from our cure inventory.',
      isCompleted: ['processing', 'packed', 'shipped', 'out_for_delivery', 'delivered'].includes(status),
      isCurrent: status === 'processing' && !order?.trackingNumber,
      date: order?.createdAt ? new Date(new Date(order.createdAt).getTime() + 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
      icon: ShieldCheck,
    },
    {
      key: 'processing',
      title: 'Artisan Preparation & Packing',
      subtitle: 'Inspection, packing & sealing',
      description: 'Handcrafted soaps carefully inspected, cedar-wrapped, and boxed for transit.',
      isCompleted: ['shipped', 'out_for_delivery', 'delivered'].includes(status),
      isCurrent: status === 'packed' || (status === 'processing' && Boolean(order?.trackingNumber)),
      icon: Sparkles,
    },
    {
      key: 'shipped',
      title: 'Dispatched with Courier',
      subtitle: order?.carrier ? `In transit with ${order.carrier}` : 'Handed over to delivery logistics',
      description: order?.trackingNumber
        ? `Consignment AWB #${order.trackingNumber} is moving through the logistics network.`
        : 'Shipment has departed the CINMAX warehouse.',
      isCompleted: ['out_for_delivery', 'delivered'].includes(status),
      isCurrent: status === 'shipped',
      icon: Truck,
    },
    {
      key: 'out_for_delivery',
      title: 'Out for Delivery',
      subtitle: 'Courier executive is nearby',
      description: 'Package is on the local delivery van heading towards your address.',
      isCompleted: status === 'delivered',
      isCurrent: status === 'out_for_delivery',
      icon: MapPin,
    },
    {
      key: 'delivered',
      title: 'Delivered',
      subtitle: 'Safely delivered to your address',
      description: 'Package handed over. Enjoy your artisanal CINMAX botanical experience!',
      isCompleted: status === 'delivered',
      isCurrent: status === 'delivered',
      icon: CheckCircle2,
    },
  ];

  const courierUrl = getCourierTrackingUrl(
    order?.carrier,
    order?.trackingNumber,
    order?.trackingUrl
  );

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
            Order
          </Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, fontWeight: '700', color: '#002754' }}>
            Live Tracking
          </Text>
          <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 9, color: '#C5A880', textTransform: 'uppercase', letterSpacing: 0.8 }}>
            Fulfillment Telemetry
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => refetch()}
          disabled={isFetching}
          style={{ padding: 6 }}
        >
          <RefreshCw size={18} color="#002754" style={{ transform: [{ rotate: isFetching ? '180deg' : '0deg' }] }} />
        </TouchableOpacity>
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
              Connecting to CINMAX fulfillment telemetry...
            </Text>
          </View>
        ) : isError || !order ? (
          <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#FEE2E2', marginTop: 20 }}>
            <AlertCircle size={44} color="#DC2626" />
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, color: '#002754', marginTop: 12, marginBottom: 4 }}>
              Order Not Found
            </Text>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#737781', textAlign: 'center', marginBottom: 16 }}>
              We could not locate shipment tracking data for this order reference.
            </Text>
            <TouchableOpacity
              onPress={() => refetch()}
              style={{ backgroundColor: '#002754', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 }}
            >
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 13 }}>Retry Telemetry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* 2. CANCELLED BANNER (IF APPLICABLE) */}
            {isCancelled && (
              <View style={{ backgroundColor: '#FEF2F2', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#FCA5A5', marginBottom: 16, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                <AlertCircle size={24} color="#DC2626" />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#991B1B', fontWeight: '700' }}>
                    Order Cancelled
                  </Text>
                  <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#7F1D1D', marginTop: 2 }}>
                    This order has been cancelled and fulfillment is stopped.
                  </Text>
                </View>
              </View>
            )}

            {/* 3. HERO SHIPMENT SUMMARY CARD */}
            <View
              style={{
                backgroundColor: '#002754',
                borderRadius: 24,
                padding: 20,
                marginBottom: 18,
                borderWidth: 1,
                borderColor: 'rgba(197, 168, 128, 0.4)',
                shadowColor: '#0A3D78',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.15,
                shadowRadius: 14,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#C5A880', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2 }}>
                    CONSIGNMENT REFERENCE
                  </Text>
                  <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, fontWeight: '700', color: 'white', marginTop: 2 }}>
                    {order.orderNumber}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor:
                      status === 'delivered'
                        ? 'rgba(16, 185, 129, 0.2)'
                        : isCancelled
                        ? 'rgba(239, 68, 68, 0.2)'
                        : 'rgba(197, 168, 128, 0.25)',
                    borderWidth: 1,
                    borderColor:
                      status === 'delivered'
                        ? '#10B981'
                        : isCancelled
                        ? '#EF4444'
                        : '#C5A880',
                    paddingHorizontal: 12,
                    paddingVertical: 5,
                    borderRadius: 14,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONT_SANS_BOLD,
                      color:
                        status === 'delivered'
                          ? '#A7F3D0'
                          : isCancelled
                          ? '#FCA5A5'
                          : '#F3E5D8',
                      fontSize: 10,
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: 0.8,
                    }}
                  >
                    {status.replace(/_/g, ' ')}
                  </Text>
                </View>
              </View>

              <View style={{ height: 1, backgroundColor: 'rgba(255, 255, 255, 0.12)', marginVertical: 14 }} />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontFamily: FONT_SANS_REGULAR, color: 'rgba(255,255,255,0.65)', fontSize: 11 }}>
                    Estimated Delivery
                  </Text>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 13, marginTop: 2 }}>
                    {estDateFormatted}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontFamily: FONT_SANS_REGULAR, color: 'rgba(255,255,255,0.65)', fontSize: 11 }}>
                    Courier Logistics
                  </Text>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#F3E5D8', fontSize: 13, marginTop: 2 }}>
                    {order.carrier || 'Assigned on Dispatch'}
                  </Text>
                </View>
              </View>
            </View>

            {/* 4. AWB & COURIER PARTNER CARD */}
            {order.trackingNumber ? (
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 20,
                  padding: 16,
                  marginBottom: 18,
                  borderWidth: 1,
                  borderColor: 'rgba(195, 198, 209, 0.4)',
                  shadowColor: '#0A3D78',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: '#737781', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                      Air Waybill (AWB) Number
                    </Text>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 15, color: '#002754', fontWeight: '700', marginTop: 2 }}>
                      {order.trackingNumber}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleCopyAWB(order.trackingNumber!)}
                    style={{
                      backgroundColor: copied ? '#ECFDF5' : '#F1F5F9',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 10,
                      flexDirection: 'row',
                      gap: 6,
                      alignItems: 'center',
                    }}
                  >
                    <Copy size={13} color={copied ? '#059669' : '#002754'} />
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: copied ? '#059669' : '#002754' }}>
                      {copied ? 'Copied' : 'Copy AWB'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {courierUrl ? (
                  <TouchableOpacity
                    onPress={() => handleOpenCourier(courierUrl)}
                    style={{
                      marginTop: 12,
                      backgroundColor: '#F8FAFC',
                      borderWidth: 1,
                      borderColor: '#E2E8F0',
                      paddingVertical: 10,
                      paddingHorizontal: 14,
                      borderRadius: 12,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                      <ExternalLink size={15} color="#0A3D78" />
                      <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#0A3D78' }}>
                        Track on {order.carrier || 'Courier'} Official Portal
                      </Text>
                    </View>
                    <ChevronRight size={15} color="#0A3D78" />
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : null}

            {/* 5. VISUAL PROGRESS TIMELINE */}
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 24,
                padding: 20,
                borderWidth: 1,
                borderColor: 'rgba(195, 198, 209, 0.4)',
                shadowColor: '#0A3D78',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
                marginBottom: 18,
              }}
            >
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 17, fontWeight: '700', color: '#002754', marginBottom: 16 }}>
                Fulfillment Journey
              </Text>

              <View style={{ gap: 0 }}>
                {stages.map((stage, idx) => {
                  const Icon = stage.icon;
                  const isLast = idx === stages.length - 1;

                  const dotBg = stage.isCompleted
                    ? '#002754'
                    : stage.isCurrent
                    ? '#C5A880'
                    : '#E2E8F0';

                  const dotColor = stage.isCompleted || stage.isCurrent ? 'white' : '#94A3B8';

                  const lineColor = stage.isCompleted ? '#002754' : '#E2E8F0';

                  return (
                    <View key={stage.key} style={{ flexDirection: 'row', gap: 14 }}>
                      {/* Left: Icon Node + Connector Line */}
                      <View style={{ alignItems: 'center', width: 36 }}>
                        <View
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 17,
                            backgroundColor: dotBg,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: stage.isCurrent ? 3 : 0,
                            borderColor: stage.isCurrent ? 'rgba(197, 168, 128, 0.35)' : 'transparent',
                            zIndex: 2,
                          }}
                        >
                          <Icon size={16} color={dotColor} />
                        </View>
                        {!isLast && (
                          <View
                            style={{
                              width: 2,
                              flex: 1,
                              backgroundColor: lineColor,
                              minHeight: 38,
                              marginVertical: 4,
                            }}
                          />
                        )}
                      </View>

                      {/* Right: Content */}
                      <View style={{ flex: 1, paddingBottom: isLast ? 0 : 20, paddingTop: 2 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Text
                            style={{
                              fontFamily: FONT_SANS_BOLD,
                              fontSize: 14,
                              fontWeight: '700',
                              color: stage.isCompleted || stage.isCurrent ? '#002754' : '#94A3B8',
                            }}
                          >
                            {stage.title}
                          </Text>
                          {stage.date ? (
                            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 10, color: '#737781' }}>
                              {stage.date}
                            </Text>
                          ) : null}
                        </View>
                        <Text
                          style={{
                            fontFamily: FONT_SANS_SEMIBOLD,
                            fontSize: 12,
                            color: stage.isCurrent ? '#C5A880' : stage.isCompleted ? '#434750' : '#A0AEC0',
                            marginTop: 2,
                          }}
                        >
                          {stage.subtitle}
                        </Text>
                        <Text
                          style={{
                            fontFamily: FONT_SANS_REGULAR,
                            fontSize: 11,
                            color: '#737781',
                            marginTop: 4,
                            lineHeight: 16,
                          }}
                        >
                          {stage.description}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* 6. DESTINATION ADDRESS CARD */}
            {order.shippingAddress ? (
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 20,
                  padding: 16,
                  marginBottom: 18,
                  borderWidth: 1,
                  borderColor: 'rgba(195, 198, 209, 0.4)',
                }}
              >
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                  <MapPin size={16} color="#002754" />
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, color: '#002754', fontWeight: '700' }}>
                    Destination Sanctuary
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
                    Contact Phone: {order.shippingAddress.phone}
                  </Text>
                ) : null}
              </View>
            ) : null}

            {/* 7. VERIFICATION TELEMETRY NOTICE */}
            <View
              style={{
                backgroundColor: 'rgba(0, 39, 84, 0.04)',
                borderRadius: 16,
                padding: 14,
                flexDirection: 'row',
                gap: 10,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'rgba(0, 39, 84, 0.08)',
              }}
            >
              <ShieldCheck size={20} color="#002754" />
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#434750', flex: 1, lineHeight: 16 }}>
                Real-time milestone tracking synced with CINMAX logistics servers and verified courier AWB checkpoints.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
