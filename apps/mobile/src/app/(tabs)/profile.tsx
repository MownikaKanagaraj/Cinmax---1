import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  ActivityIndicator,
  Modal,
  TextInput,
  Switch,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ChevronRight,
  Package,
  Heart,
  ShoppingBag,
  MapPin,
  HelpCircle,
  LogOut,
  ShieldCheck,
  Bell,
  User,
  Sparkles,
  KeyRound,
  Video,
  Plus,
  X,
  Check,
  Home,
  MessageSquare,
  Phone,
  Mail,
  Lock,
  Smartphone,
  Download,
  Trash2,
  ChevronDown,
  FileText,
  AlertCircle,
  Truck,
} from 'lucide-react-native';
import {
  useCustomerProfileQuery,
  useWishlistStore,
  useOrdersQuery,
  useCartStore,
  useUser,
  useLogoutMutation,
  useAddressesQuery,
  useAddCustomerAddressMutation,
} from '@cinmax/hooks';
import { ALL_INDIAN_STATES, calculateLoyaltyProgress } from '@cinmax/utils';


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
  const { user, isAuthenticated, isLoading: authLoading } = useUser();
  const logoutMutation = useLogoutMutation();

  const { data: customer } = useCustomerProfileQuery(user?.id || '', { enabled: isAuthenticated && !!user?.id });
  const { data: dbAddresses = [] } = useAddressesQuery(user?.id);
  const addAddressMutation = useAddCustomerAddressMutation();
  
  const { items: wishlistItems } = useWishlistStore();
  const { items: cartItems } = useCartStore();
  const totalCartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const { data: ordersData } = useOrdersQuery(undefined, undefined, { enabled: isAuthenticated });

  const ordersCount = ordersData?.items?.length || 0;

  // Active Preference Modal state
  const [activeModal, setActiveModal] = useState<'addresses' | 'notifications' | 'security' | 'concierge' | null>(null);

  // Address Modal Internal State (Meesho Format)
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    addressLine1: '', // House No / Building / Flat Name
    addressLine2: '', // Road Name / Area / Colony / Street
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
    landmark: '',
    type: 'Home',
  });

  const handleSaveNewAddress = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.addressLine1 || !newAddress.pincode || !newAddress.city) {
      alert('Please fill in all mandatory address fields (Name, Phone, House/Building No, Pincode, City).');
      return;
    }

    if (user?.id) {
      const nameParts = newAddress.name.trim().split(' ');
      addAddressMutation.mutate({
        userId: user.id,
        address: {
          firstName: nameParts[0] || 'Valued',
          lastName: nameParts.slice(1).join(' ') || '',
          phone: newAddress.phone,
          streetLine1: newAddress.addressLine1,
          streetLine2: newAddress.addressLine2 ? `${newAddress.addressLine2}${newAddress.landmark ? ` (Landmark: ${newAddress.landmark})` : ''}` : newAddress.landmark || '',
          city: newAddress.city,
          state: newAddress.state,
          postalCode: newAddress.pincode,
          country: 'India',
          isDefaultShipping: true,
          isDefaultBilling: true,
        },
      }, {
        onSuccess: () => {
          setIsAddingNewAddress(false);
          alert('Address saved successfully!');
        }
      });
    } else {
      setIsAddingNewAddress(false);
    }
  };

  // Notification Preferences State
  const [notifState, setNotifState] = useState({
    orderDispatches: true,
    whatsappReceipts: true,
    videoMasterclasses: true,
    promoCures: false,
    smsReceipts: true,
  });

  // Security Preferences State
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [passwordForm, setPasswordForm] = useState({ currentPass: '', newPass: '' });

  // Concierge FAQ Accordion state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const name = isAuthenticated && customer 
    ? `${customer.firstName} ${customer.lastName}`.trim() 
    : isAuthenticated && user?.email ? user.email.split('@')[0] : '';
  const email = isAuthenticated && (customer?.email || user?.email) ? (customer?.email || user?.email) : '';
  const initials = isAuthenticated && name
    ? `${name.split(' ')[0]?.[0] || ''}${name.split(' ')[1]?.[0] || ''}`.toUpperCase()
    : '?';
  const tier = isAuthenticated && customer?.loyaltyTier ? `${customer.loyaltyTier.toUpperCase()} VIP Member` : 'CINMAX Member';

  const rawPoints = customer?.loyaltyPoints ?? user?.loyaltyPoints ?? 0;
  const loyaltyProgress = calculateLoyaltyProgress(rawPoints);


  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.replace('/(auth)/login' as any);
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  const handleMenuPress = (route: string, label: string) => {
    if (label === 'Saved Shipping Addresses') {
      setActiveModal('addresses');
    } else if (label === 'Notification Preferences') {
      setActiveModal('notifications');
    } else if (label === 'Privacy & Security') {
      setActiveModal('security');
    } else if (label === 'CINMAX Support & Help') {
      setActiveModal('concierge');
    } else {
      router.push(route as any);
    }
  };

  interface ProfileMenuItem {
    label: string;
    subtitle: string;
    route: string;
    icon: any;
    badge?: string;
  }

  interface ProfileMenuSection {
    title: string;
    items: ProfileMenuItem[];
  }

  const menuSections: ProfileMenuSection[] = [
    {
      title: 'Orders & My Classes',
      items: [
        { label: 'My Orders & Dispatches', subtitle: isAuthenticated ? `${ordersCount} active or past orders` : 'Sign in to view orders', route: '/(tabs)/orders', icon: Package, badge: ordersCount > 0 ? `${ordersCount}` : undefined },
        { label: 'Master Classes & Workshops', subtitle: 'Access your purchased classes & tutorials', route: '/(tabs)/videos', icon: Video },
        { label: 'Active Shopping Cart', subtitle: `${cartItems.length} items in cart`, route: '/cart', icon: ShoppingBag, badge: cartItems.length > 0 ? `${cartItems.length}` : undefined },
      ],
    },
    {
      title: 'Account Preferences',
      items: [
        { label: 'Saved Delivery Addresses', subtitle: 'Manage default delivery locations', route: '/checkout', icon: MapPin },
        { label: 'Notification Preferences', subtitle: 'Order dispatches & updates', route: '/(tabs)/profile', icon: Bell },
        { label: 'Privacy & Security', subtitle: 'Account protection & settings', route: '/(tabs)/profile', icon: ShieldCheck },
        { label: 'CINMAX Support & Help', subtitle: 'Live support & FAQs', route: '/(tabs)/shop', icon: HelpCircle },
      ],
    },
    {
      title: 'Store Policies & Legal',
      items: [
        { label: 'Terms & Conditions', subtitle: 'Indian e-commerce & patron terms', route: '/terms', icon: FileText },
        { label: 'Return & Refund Policy', subtitle: 'No Return & No Refund terms', route: '/refund', icon: AlertCircle },
        { label: 'Shipping & Delivery Policy', subtitle: 'State tariffs & dispatch timelines', route: '/shipping', icon: Truck },
        { label: 'Privacy Policy', subtitle: 'Razorpay SSL & data security', route: '/privacy', icon: Lock },
      ],
    },
  ];

  const faqs = [
    { q: 'How long does curing cold-process soap take?', a: 'All CINMAX soaps are slowly cold-cured for 42 days to ensure dense lather and lock in unrefined barrier lipids.' },
    { q: 'What are the delivery and shipping timelines?', a: 'Orders are dispatched within 24-48 hours. Express Courier delivery takes 2-4 business days across South India and 4-7 days for rest of India.' },
    { q: 'How do I track my order dispatch?', a: 'Open the "My Orders" tab in the app to view real-time tracking and courier status.' },
    { q: 'What is the return and refund policy?', a: 'All purchases are final. CINMAX follows a No Return and No Refund policy, except where required by law or approved by CINMAX for damaged delivery.' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF7F2' }}>
      {/* 1. TOP BRAND HEADER */}
      <View style={{ zIndex: 100, elevation: 10, paddingHorizontal: CONTAINER_PADDING, paddingTop: 14, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.95)', borderBottomWidth: 1, borderBottomColor: 'rgba(195, 198, 209, 0.3)' }}>
        <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: '#002754', letterSpacing: -0.5 }}>
          My Account
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
          {isAuthenticated && (
            <View style={{ backgroundColor: 'rgba(197, 168, 128, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(197, 168, 128, 0.3)' }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#C5A880', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                CINMAX VIP
              </Text>
            </View>
          )}
        </View>

      </View>

      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={{ paddingHorizontal: CONTAINER_PADDING, paddingTop: 16 }}>

          {/* 2. LUXURY MEMBER HERO CARD */}
          {authLoading ? (
            <View style={{ backgroundColor: '#002754', borderRadius: 24, padding: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
              <ActivityIndicator color="#C5A880" size="large" />
            </View>
          ) : isAuthenticated ? (
            <View style={{ backgroundColor: '#002754', borderRadius: 24, padding: 22, shadowColor: '#002754', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 15, borderWidth: 1, borderColor: 'rgba(197, 168, 128, 0.3)', marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#C5A880', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFFFFF' }}>
                  <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 24, fontWeight: '700', color: '#002754' }}>
                    {initials}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, fontWeight: '700', color: '#FFFFFF' }}>
                    {name || 'Valued Customer'}
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
                  <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#FFFFFF' }}>{rawPoints}</Text>
                  <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 10, color: '#C5A880', textTransform: 'uppercase', marginTop: 2 }}>Points</Text>
                </View>
              </View>

              {/* Smart Loyalty Rewards Experience Card */}
              <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 18, padding: 14, marginTop: 14, borderWidth: 1, borderColor: 'rgba(197, 168, 128, 0.25)', gap: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Sparkles size={14} color="#C5A880" />
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: '#C5A880', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      Smart Loyalty Rewards
                    </Text>
                  </View>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#FFFFFF' }}>
                    {loyaltyProgress.tierLabel} ({loyaltyProgress.multiplier}x)
                  </Text>
                </View>

                {/* Progress Bar */}
                <View style={{ height: 6, backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 3, overflow: 'hidden' }}>
                  <View style={{ height: '100%', width: `${loyaltyProgress.progressPercent}%`, backgroundColor: '#C5A880', borderRadius: 3 }} />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 10, color: 'rgba(255, 255, 255, 0.75)' }}>
                    {loyaltyProgress.nextTierLabel
                      ? `${loyaltyProgress.pointsToNextTier} pts to ${loyaltyProgress.nextTierLabel}`
                      : 'Unlocked Apex Tier'}
                  </Text>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, color: '#4ADE80' }}>
                    Value: ₹{loyaltyProgress.redeemableValueRupees}
                  </Text>
                </View>

                {/* Redeem CTA Button */}
                <TouchableOpacity
                  onPress={() => router.push('/cart' as any)}
                  activeOpacity={0.8}
                  style={{ marginTop: 4, backgroundColor: '#C5A880', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: '#002754', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Redeem Points at Checkout →
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

          ) : (
            /* Unauthenticated Hero State */
            <View style={{ backgroundColor: '#002754', borderRadius: 24, padding: 24, shadowColor: '#002754', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 15, borderWidth: 1, borderColor: 'rgba(197, 168, 128, 0.3)', marginBottom: 20, alignItems: 'center' }}>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#C5A880', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
                <KeyRound size={26} color="#002754" />
              </View>
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' }}>
                Welcome to CINMAX
              </Text>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: 'rgba(255, 255, 255, 0.85)', textAlign: 'center', marginTop: 6, lineHeight: 18 }}>
                Sign in to track orders, manage your wishlist, and unlock exclusive VIP benefits.
              </Text>

              <View style={{ flexDirection: 'row', gap: 12, marginTop: 20, width: '100%', maxWidth: 320 }}>
                <TouchableOpacity
                  onPress={() => router.push('/(auth)/login' as any)}
                  activeOpacity={0.8}
                  style={{ flex: 1, minHeight: 46, paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: 14, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 }}
                >
                  <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#002754', fontSize: 14, fontWeight: '700' }}>
                    Sign In
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push('/(auth)/signup' as any)}
                  activeOpacity={0.8}
                  style={{ flex: 1, minHeight: 46, paddingHorizontal: 16, backgroundColor: '#C5A880', borderRadius: 14, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
                >
                  <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#002754', fontSize: 14, fontWeight: '700' }}>
                    Register
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

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
                      onPress={() => handleMenuPress(item.route, item.label)}
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
          {isAuthenticated && (
            <View style={{ gap: 10, marginBottom: 24 }}>
              <TouchableOpacity
                onPress={handleLogout}
                disabled={logoutMutation.isPending}
                style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(220, 38, 38, 0.3)' }}
              >
                {logoutMutation.isPending ? (
                  <ActivityIndicator color="#DC2626" />
                ) : (
                  <>
                    <LogOut size={18} color="#DC2626" />
                    <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#DC2626', fontSize: 13, fontWeight: '700' }}>
                      Sign Out
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* 5. FOOTER */}
          <View style={{ alignItems: 'center', paddingBottom: 10 }}>
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 12, color: '#002754' }}>
              CINMAX Global Products
            </Text>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 10, color: '#94A3B8', marginTop: 2 }}>
              Handcrafted CINMAX Mobile • Version 1.0.4
            </Text>
          </View>

        </View>
      </ScrollView>

      {/* ----------------- MODAL 1: SAVED SHIPPING ADDRESSES (MEESHO FORMAT) ----------------- */}
      <Modal visible={activeModal === 'addresses'} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, fontWeight: '700', color: '#002754' }}>
                {isAddingNewAddress ? 'Add New Address' : 'Saved Shipping Addresses'}
              </Text>
              <TouchableOpacity onPress={() => { setActiveModal(null); setIsAddingNewAddress(false); }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#737781' }}>Done</Text>
              </TouchableOpacity>
            </View>

            {!isAddingNewAddress ? (
              <View style={{ gap: 14 }}>
                <TouchableOpacity
                  onPress={() => setIsAddingNewAddress(true)}
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#EBF3FF', paddingVertical: 12, borderRadius: 14, borderWidth: 1, borderColor: '#002754' }}
                >
                  <Plus size={18} color="#002754" />
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#002754' }}>
                    + Add New Delivery Address
                  </Text>
                </TouchableOpacity>

                <ScrollView style={{ maxHeight: 380 }}>
                  <View style={{ gap: 12 }}>
                    {dbAddresses.length > 0 ? dbAddresses.map((addr) => (
                      <View key={addr.id} style={{ backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.4)', gap: 4 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#002754' }}>{addr.firstName} {addr.lastName}</Text>
                          <View style={{ backgroundColor: '#EBF3FF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
                            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, color: '#002754', textTransform: 'uppercase' }}>DEFAULT</Text>
                          </View>
                        </View>
                        <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#434750', marginTop: 4, lineHeight: 18 }}>
                          {addr.streetLine1}, {addr.streetLine2 ? addr.streetLine2 + ', ' : ''}{addr.city}, {addr.state} - {addr.postalCode}
                        </Text>
                        <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 12, color: '#002754', marginTop: 2 }}>Phone: {addr.phone}</Text>
                      </View>
                    )) : (
                      <View style={{ backgroundColor: '#F7F9FB', borderRadius: 16, padding: 20, alignItems: 'center' }}>
                        <MapPin size={32} color="#94A3B8" style={{ marginBottom: 8 }} />
                        <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#002754' }}>No Saved Addresses</Text>
                        <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#64748B', textAlign: 'center', marginTop: 4 }}>Add a delivery address to speed up checkout.</Text>
                      </View>
                    )}
                  </View>
                </ScrollView>
              </View>
            ) : (
              <ScrollView style={{ gap: 10 }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#002754', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>1. Recipient Contact Details</Text>
                <View style={{ marginBottom: 8 }}>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#191C1E', marginBottom: 4 }}>Full Name *</Text>
                  <TextInput placeholder="e.g. Aanya Sharma" placeholderTextColor="#737781" selectionColor="#002754" cursorColor="#002754" underlineColorAndroid="transparent" value={newAddress.name} onChangeText={(t) => setNewAddress({ ...newAddress, name: t })} style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, padding: 12, fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#191C1E' }} />
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#191C1E', marginBottom: 4 }}>10 digit mobile number *</Text>
                  <TextInput placeholder="e.g. 9876543210" placeholderTextColor="#737781" selectionColor="#002754" cursorColor="#002754" underlineColorAndroid="transparent" keyboardType="phone-pad" maxLength={10} value={newAddress.phone} onChangeText={(t) => setNewAddress({ ...newAddress, phone: t })} style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, padding: 12, fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#191C1E' }} />
                </View>

                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#002754', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>2. Location &amp; Street Address</Text>
                <View style={{ marginBottom: 8 }}>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#191C1E', marginBottom: 4 }}>House / Flat / Door No. *</Text>
                  <TextInput placeholder="e.g. Flat 402, Royal Enclave" placeholderTextColor="#737781" selectionColor="#002754" cursorColor="#002754" underlineColorAndroid="transparent" value={newAddress.addressLine1} onChangeText={(t) => setNewAddress({ ...newAddress, addressLine1: t })} style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, padding: 12, fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#191C1E' }} />
                </View>
                <View style={{ marginBottom: 8 }}>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#191C1E', marginBottom: 4 }}>Street / Road / Area / Locality *</Text>
                  <TextInput placeholder="e.g. 2nd Main Road, T. Nagar" placeholderTextColor="#737781" selectionColor="#002754" cursorColor="#002754" underlineColorAndroid="transparent" value={newAddress.addressLine2} onChangeText={(t) => setNewAddress({ ...newAddress, addressLine2: t })} style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, padding: 12, fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#191C1E' }} />
                </View>
                
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#191C1E', marginBottom: 4 }}>Pincode *</Text>
                    <TextInput placeholder="e.g. 600017" placeholderTextColor="#737781" selectionColor="#002754" cursorColor="#002754" underlineColorAndroid="transparent" keyboardType="number-pad" maxLength={6} value={newAddress.pincode} onChangeText={(t) => setNewAddress({ ...newAddress, pincode: t })} style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, padding: 12, fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#191C1E' }} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#191C1E', marginBottom: 4 }}>City *</Text>
                    <TextInput placeholder="e.g. Chennai" placeholderTextColor="#737781" selectionColor="#002754" cursorColor="#002754" underlineColorAndroid="transparent" value={newAddress.city} onChangeText={(t) => setNewAddress({ ...newAddress, city: t })} style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, padding: 12, fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#191C1E' }} />
                  </View>
                </View>

                <View style={{ marginBottom: 8 }}>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#191C1E', marginBottom: 4 }}>State *</Text>
                  <TouchableOpacity onPress={() => setIsStateDropdownOpen(!isStateDropdownOpen)} style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#002754', borderRadius: 12, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#191C1E' }}>{newAddress.state || 'Select State'}</Text>
                    <ChevronDown size={18} color="#002754" />
                  </TouchableOpacity>
                </View>

                {isStateDropdownOpen && (
                  <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#002754', borderRadius: 12, maxHeight: 180, marginBottom: 8 }}>
                    <ScrollView nestedScrollEnabled>
                      {ALL_INDIAN_STATES.map((st) => (
                        <TouchableOpacity key={st} onPress={() => { setNewAddress({ ...newAddress, state: st }); setIsStateDropdownOpen(false); }} style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#F0F2F5' }}>
                          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#191C1E' }}>{st}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}

                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#191C1E', marginBottom: 4 }}>Landmark (Optional)</Text>
                  <TextInput placeholder="Nearby Landmark (e.g. Near City Hospital)" placeholderTextColor="#737781" selectionColor="#002754" cursorColor="#002754" underlineColorAndroid="transparent" value={newAddress.landmark} onChangeText={(t) => setNewAddress({ ...newAddress, landmark: t })} style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, padding: 12, fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#191C1E' }} />
                </View>

                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#002754', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Save Address As</Text>
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
                  {['Home', 'Work', 'Other'].map((tag) => {
                    const isSel = newAddress.type === tag;
                    return (
                      <TouchableOpacity
                        key={tag}
                        onPress={() => setNewAddress({ ...newAddress, type: tag })}
                        style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: isSel ? '#002754' : '#F2F4F6', borderWidth: 1, borderColor: isSel ? '#002754' : '#C3C6D1' }}
                      >
                        <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: isSel ? 'white' : '#434750' }}>{tag}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity onPress={() => setIsAddingNewAddress(false)} style={{ flex: 1, backgroundColor: '#ECEEF0', paddingVertical: 14, borderRadius: 16, alignItems: 'center' }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#434750', fontSize: 14 }}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSaveNewAddress} style={{ flex: 1, backgroundColor: '#002754', paddingVertical: 14, borderRadius: 16, alignItems: 'center' }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 14 }}>Save Address</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* ----------------- MODAL 2: NOTIFICATION PREFERENCES ----------------- */}
      <Modal visible={activeModal === 'notifications'} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '85%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, fontWeight: '700', color: '#002754' }}>
                Notification Preferences
              </Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <X size={20} color="#737781" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ gap: 16 }}>
              <View style={{ backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: '#002754' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#002754' }}>Order Dispatches &amp; Tracking</Text>
                    <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#64748B', marginTop: 2 }}>Instant updates when your artisanal bars are packed &amp; handed to courier.</Text>
                  </View>
                  <Switch value={notifState.orderDispatches} onValueChange={(val) => setNotifState({ ...notifState, orderDispatches: val })} trackColor={{ false: '#CBD5E1', true: '#002754' }} />
                </View>
              </View>

              <View style={{ backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: '#059669' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#002754' }}>WhatsApp Live Receipts</Text>
                    <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#64748B', marginTop: 2 }}>Receive delivery receipts and courier tracking links directly on WhatsApp.</Text>
                  </View>
                  <Switch value={notifState.whatsappReceipts} onValueChange={(val) => setNotifState({ ...notifState, whatsappReceipts: val })} trackColor={{ false: '#CBD5E1', true: '#059669' }} />
                </View>
              </View>

              <View style={{ backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: '#C5A880' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#002754' }}>Video Masterclasses &amp; Drops</Text>
                    <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#64748B', marginTop: 2 }}>Alerts when new artisan masterclass videos or batch launches drop.</Text>
                  </View>
                  <Switch value={notifState.videoMasterclasses} onValueChange={(val) => setNotifState({ ...notifState, videoMasterclasses: val })} trackColor={{ false: '#CBD5E1', true: '#C5A880' }} />
                </View>
              </View>

              <View style={{ backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: '#3B82F6' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#002754' }}>VIP Promo Cures &amp; Offers</Text>
                    <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#64748B', marginTop: 2 }}>Exclusive discounts and seasonal promotional coupons.</Text>
                  </View>
                  <Switch value={notifState.promoCures} onValueChange={(val) => setNotifState({ ...notifState, promoCures: val })} trackColor={{ false: '#CBD5E1', true: '#3B82F6' }} />
                </View>
              </View>

              <TouchableOpacity onPress={() => { alert('Notification preferences saved!'); setActiveModal(null); }} style={{ backgroundColor: '#002754', paddingVertical: 14, borderRadius: 16, alignItems: 'center', marginTop: 10 }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 14 }}>Save Preferences</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ----------------- MODAL 3: PRIVACY & SECURITY ----------------- */}
      <Modal visible={activeModal === 'security'} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '85%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, fontWeight: '700', color: '#002754' }}>
                Privacy &amp; Security Controls
              </Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <X size={20} color="#737781" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ gap: 16 }}>
              <View style={{ backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, gap: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Lock size={18} color="#002754" />
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#002754' }}>Change Account Password</Text>
                </View>
                <TextInput placeholder="Current Password" secureTextEntry value={passwordForm.currentPass} onChangeText={(t) => setPasswordForm({ ...passwordForm, currentPass: t })} style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, padding: 10, fontFamily: FONT_SANS_REGULAR, fontSize: 13 }} />
                <TextInput placeholder="New Password" secureTextEntry value={passwordForm.newPass} onChangeText={(t) => setPasswordForm({ ...passwordForm, newPass: t })} style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, padding: 10, fontFamily: FONT_SANS_REGULAR, fontSize: 13 }} />
                <TouchableOpacity onPress={() => { alert('Password updated successfully!'); setPasswordForm({ currentPass: '', newPass: '' }); }} style={{ backgroundColor: '#002754', paddingVertical: 10, borderRadius: 10, alignItems: 'center' }}>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 12 }}>Update Password</Text>
                </TouchableOpacity>
              </View>

              <View style={{ backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#002754' }}>Biometric App Lock</Text>
                    <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#64748B', marginTop: 2 }}>Require TouchID / FaceID when launching CINMAX.</Text>
                  </View>
                  <Switch value={biometricEnabled} onValueChange={setBiometricEnabled} trackColor={{ false: '#CBD5E1', true: '#002754' }} />
                </View>
              </View>

              <View style={{ backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, gap: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Smartphone size={18} color="#002754" />
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#002754' }}>Active Device Sessions</Text>
                </View>
                <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#64748B' }}>Windows / Mobile Web Inspector • Active Now</Text>
              </View>

              <TouchableOpacity onPress={() => alert('Data Archive export initiated! Check your email in 5 minutes.')} style={{ backgroundColor: '#ECEEF0', paddingVertical: 12, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                <Download size={16} color="#002754" />
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, color: '#002754' }}>Download Personal Data Archive</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ----------------- MODAL 4: CINMAX SUPPORT ----------------- */}
      <Modal visible={activeModal === 'concierge'} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, fontWeight: '700', color: '#002754' }}>
                CINMAX Support
              </Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <X size={20} color="#737781" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ gap: 14 }}>
              {/* WhatsApp & Call Direct Action Buttons */}
              <TouchableOpacity
                onPress={() => Linking.openURL('https://wa.me/919876543210?text=Hello%20CINMAX%20Support%2C%20I%20need%20assistance')}
                style={{ backgroundColor: '#25D366', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <MessageSquare size={18} color="white" />
                <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 14 }}>Chat Live on WhatsApp (+91 98765 43210)</Text>
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity onPress={() => Linking.openURL('tel:+919876543210')} style={{ flex: 1, backgroundColor: '#EBF3FF', borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Phone size={16} color="#002754" />
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#002754' }}>Call Support</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL('mailto:support@cinmaxglobal.com')} style={{ flex: 1, backgroundColor: '#EBF3FF', borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Mail size={16} color="#002754" />
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#002754' }}>Email Support</Text>
                </TouchableOpacity>
              </View>

              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#002754', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 10 }}>Frequently Asked Questions</Text>
              <View style={{ gap: 8 }}>
                {faqs.map((faq, idx) => {
                  const isExp = expandedFaq === idx;
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => setExpandedFaq(isExp ? null : idx)}
                      style={{ backgroundColor: '#F8FAFC', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.4)' }}
                    >
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, color: '#002754', flex: 1, paddingRight: 8 }}>{faq.q}</Text>
                        <ChevronDown size={16} color="#002754" style={{ transform: [{ rotate: isExp ? '180deg' : '0deg' }] }} />
                      </View>
                      {isExp && (
                        <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#64748B', marginTop: 8, lineHeight: 18 }}>
                          {faq.a}
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
