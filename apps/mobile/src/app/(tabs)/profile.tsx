import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronRight,
  Package,
  Heart,
  ShoppingBag,
  MapPin,
  HelpCircle,
  LogOut,
  Award,
  ShieldCheck,
  Bell,
  User,
  Sparkles,
  RefreshCw,
} from 'lucide-react-native';
import { useCustomerProfileQuery, useWishlistStore, useOrdersQuery, useCartStore } from '@cinmax/hooks';

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

export default function MobileProfileScreen() {
  const router = useRouter();
  const { data: customer, isLoading } = useCustomerProfileQuery('current');
  const { items: wishlistItems } = useWishlistStore();
  const { items: cartItems } = useCartStore();
  const { data: ordersData } = useOrdersQuery();

  const ordersCount = ordersData?.items?.length || 0;

  const name = customer ? `${customer.firstName} ${customer.lastName}`.trim() : 'Aanya Sharma';
  const email = customer?.email || 'aanya.sharma@cinmax.com';
  const initials = customer
    ? `${customer.firstName?.[0] || ''}${customer.lastName?.[0] || ''}`.toUpperCase() || 'AS'
    : 'AS';
  const tier = customer?.loyaltyTier ? `${customer.loyaltyTier.toUpperCase()} VIP Patron` : 'Master Atelier VIP';

  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, []);

  const menuSections = [
    {
      title: 'Order Telemetry & Purchases',
      items: [
        { label: 'Order History & Dispatches', subtitle: `${ordersCount} active or past dispatches`, route: '/(tabs)/orders', icon: Package, badge: ordersCount > 0 ? `${ordersCount}` : undefined },
        { label: 'Saved Wishlist Reserve', subtitle: `${wishlistItems.length} handcrafted favorites`, route: '/(tabs)/wishlist', icon: Heart, badge: wishlistItems.length > 0 ? `${wishlistItems.length}` : undefined },
        { label: 'Active Shopping Cart', subtitle: `${cartItems.length} items in cart`, route: '/cart', icon: ShoppingBag, badge: cartItems.length > 0 ? `${cartItems.length}` : undefined },
      ],
    },
    {
      title: 'Account & Atelier Preferences',
      items: [
        { label: 'Saved Shipping Addresses', subtitle: 'Manage default delivery locations', route: '/checkout', icon: MapPin },
        { label: 'Notification Preferences', subtitle: 'Order dispatches & exclusive cures', route: '/(tabs)/profile', icon: Bell },
        { label: 'Privacy & Security', subtitle: 'Biometric & account protection', route: '/(tabs)/profile', icon: ShieldCheck },
        { label: 'Atelier Concierge Support', subtitle: 'Botanical advisors & FAQs', route: '/(tabs)/shop', icon: HelpCircle },
      ],
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FB' }}>
      {/* 1. TOP BRAND HEADER */}
      <View style={{ paddingHorizontal: CONTAINER_PADDING, paddingTop: 14, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.95)', borderBottomWidth: 1, borderBottomColor: 'rgba(195, 198, 209, 0.3)' }}>
        <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: '#002754', letterSpacing: -0.5 }}>
          Patron Profile
        </Text>
        <View style={{ backgroundColor: 'rgba(197, 168, 128, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(197, 168, 128, 0.3)' }}>
          <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#C5A880', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Atelier VIP
          </Text>
        </View>
      </View>

      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={{ paddingHorizontal: CONTAINER_PADDING, paddingTop: 16 }}>

          {/* 2. LUXURY PATRON HERO CARD */}
          <View style={{ backgroundColor: '#002754', borderRadius: 24, padding: 22, shadowColor: '#002754', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 15, borderWidth: 1, borderColor: 'rgba(197, 168, 128, 0.3)', marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#C5A880', justifyContent: 'center', alignItems: 'center', borderOutset: 'none', borderWidth: 2, borderColor: '#FFFFFF' }}>
                <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 24, fontWeight: '700', color: '#002754' }}>
                  {initials}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, fontWeight: '700', color: '#FFFFFF' }}>
                  {name}
                </Text>
                <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: 'rgba(255, 255, 255, 0.75)', marginTop: 2 }}>
                  {email}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
                  <Sparkles size={13} color="#C5A880" />
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: '#C5A880', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {tier}
                  </Text>
                </View>
              </View>
            </View>

            {/* Quick Metrics Bar */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 16, padding: 14, marginTop: 18, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#FFFFFF' }}>{ordersCount}</Text>
                <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 10, color: '#C5A880', textTransform: 'uppercase', marginTop: 2 }}>Dispatches</Text>
              </View>

              <View style={{ width: 1, backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />

              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#FFFFFF' }}>{wishlistItems.length}</Text>
                <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 10, color: '#C5A880', textTransform: 'uppercase', marginTop: 2 }}>Wishlist</Text>
              </View>

              <View style={{ width: 1, backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />

              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#FFFFFF' }}>480</Text>
                <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 10, color: '#C5A880', textTransform: 'uppercase', marginTop: 2 }}>Points</Text>
              </View>
            </View>
          </View>

          {/* 3. MENU SECTIONS */}
          {menuSections.map((section, sIdx) => (
            <View key={sIdx} style={{ marginBottom: 20 }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, fontWeight: '700', color: '#002754', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10, marginLeft: 4 }}>
                {section.title}
              </Text>

              <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 6, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.3)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.04, shadowRadius: 8 }}>
                {section.items.map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => router.push(item.route as any)}
                      style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 14, borderBottomWidth: idx !== section.items.length - 1 ? 1 : 0, borderBottomColor: 'rgba(195, 198, 209, 0.2)' }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                        <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(0, 39, 84, 0.06)', justifyContent: 'center', alignItems: 'center' }}>
                          <IconComp size={18} color="#002754" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, fontWeight: '700', color: '#002754' }}>
                            {item.label}
                          </Text>
                          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#64748B', marginTop: 1 }}>
                            {item.subtitle}
                          </Text>
                        </View>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        {item.badge && (
                          <View style={{ backgroundColor: '#002754', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }}>
                            <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#FFFFFF', fontSize: 10 }}>
                              {item.badge}
                            </Text>
                          </View>
                        )}
                        <ChevronRight size={16} color="#94A3B8" />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}

          {/* 4. AUTH & SIGN OUT BUTTONS */}
          <View style={{ gap: 10, marginBottom: 24 }}>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login' as any)}
              style={{ backgroundColor: '#002754', borderRadius: 20, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#002754' }}
            >
              <User size={18} color="#C5A880" />
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>
                Login with Mobile Number &amp; OTP
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(auth)/login' as any)}
              style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(220, 38, 38, 0.3)' }}
            >
              <LogOut size={18} color="#DC2626" />
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#DC2626', fontSize: 13, fontWeight: '700' }}>
                Sign Out from Atelier Session
              </Text>
            </TouchableOpacity>
          </View>

          {/* 5. FOOTER */}
          <View style={{ alignItems: 'center', paddingBottom: 10 }}>
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 12, color: '#002754' }}>
              CINMAX Global Products
            </Text>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 10, color: '#94A3B8', marginTop: 2 }}>
              Handcrafted Atelier Mobile • Version 1.0.4
            </Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
