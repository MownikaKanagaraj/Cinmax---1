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
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  useCartStore,
  useUser,
  useValidateCouponMutation,
  useAddressesQuery,
  useAddCustomerAddressMutation,
} from '@cinmax/hooks';
import { calculateDeliveryCharge, ALL_INDIAN_STATES } from '@cinmax/utils';
import {
  ArrowLeft,
  Heart,
  Bell,
  MapPin,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ChevronDown,
  Check,
  ShoppingBag,
  Tag,
  X,
  Video,
  Home,
  Lock,
} from 'lucide-react-native';

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

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&auto=format&fit=crop&q=80';

interface CartItemCardProps {
  item: {
    id: string;
    slug: string;
    title: string;
    price: number;
    originalPrice: number;
    quantity: number;
    badge: string;
    badgeBg: string;
    badgeText: string;
    image: string;
    maxStock: number;
  };
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onPressItem: (slug: string) => void;
}

function CartItemCard({ item, onUpdateQuantity, onRemove, onPressItem }: CartItemCardProps) {
  const [localText, setLocalText] = useState(String(item.quantity));

  React.useEffect(() => {
    setLocalText(String(item.quantity));
  }, [item.quantity]);

  const commitQuantity = (raw: string) => {
    const parsed = parseInt(raw, 10);
    if (isNaN(parsed) || parsed < 1) {
      setLocalText(String(item.quantity));
      return;
    }
    const clamped = Math.max(1, Math.min(item.maxStock, parsed));
    setLocalText(String(clamped));
    if (clamped !== item.quantity) {
      onUpdateQuantity(item.id, clamped);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPressItem(item.slug)}
      activeOpacity={0.9}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 14,
        flexDirection: 'row',
        gap: 14,
        position: 'relative',
        shadowColor: '#0A3D78',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(195, 198, 209, 0.25)',
      }}
    >
      <Image source={{ uri: item.image }} style={{ width: 84, height: 84, borderRadius: 14 }} />

      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={{ paddingRight: 20 }}>
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 14, color: '#002754', fontWeight: '700' }} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 15, color: '#002754', fontWeight: '700' }}>
              ₹{item.price}
            </Text>
            {item.originalPrice > item.price && (
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#737781', textDecorationLine: 'line-through' }}>
                ₹{item.originalPrice}
              </Text>
            )}
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7F9FB', borderRadius: 20, borderWidth: 1, borderColor: '#C3C6D1', height: 34, paddingHorizontal: 4 }}>
            <TouchableOpacity
              onPress={() => {
                const next = Math.max(1, item.quantity - 1);
                onUpdateQuantity(item.id, next);
                setLocalText(String(next));
              }}
              disabled={item.quantity <= 1}
              style={{ width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center' }}
            >
              <Minus size={13} color={item.quantity <= 1 ? '#B0B4BA' : '#002754'} />
            </TouchableOpacity>

            <TextInput
              value={localText}
              onChangeText={(text) => {
                const clean = text.replace(/[^0-9]/g, '');
                setLocalText(clean);
                if (clean !== '') {
                  const num = parseInt(clean, 10);
                  if (!isNaN(num) && num >= 1) {
                    const clamped = Math.min(item.maxStock, num);
                    onUpdateQuantity(item.id, clamped);
                  }
                }
              }}
              onBlur={() => commitQuantity(localText)}
              keyboardType="number-pad"
              maxLength={3}
              style={{
                fontFamily: FONT_SANS_BOLD,
                fontSize: 13,
                color: '#002754',
                paddingHorizontal: 4,
                textAlign: 'center',
                minWidth: 32,
                paddingVertical: 0,
              }}
            />

            <TouchableOpacity
              onPress={() => {
                const next = Math.min(item.maxStock, item.quantity + 1);
                onUpdateQuantity(item.id, next);
                setLocalText(String(next));
              }}
              disabled={item.quantity >= item.maxStock}
              style={{ width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center' }}
            >
              <Plus size={13} color={item.quantity >= item.maxStock ? '#B0B4BA' : '#002754'} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => onRemove(item.id)} style={{ padding: 4 }}>
            <Trash2 size={16} color="#BA1A1A" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function MobileCartScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, isAuthenticated } = useUser();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const {
    items: storeItems,
    updateQuantity,
    removeItem,
    coupon,
    applyCoupon,
    removeCoupon,
    savedLocalAddress,
    setSavedLocalAddress,
  } = useCartStore();

  const handleProceedToCheckout = () => {
    if (!user && !isAuthenticated) {
      setIsLoginModalOpen(true);
    } else {
      router.push('/checkout' as any);
    }
  };

  const { data: dbAddresses = [] } = useAddressesQuery(user?.id);
  const addAddressMutation = useAddCustomerAddressMutation();

  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, []);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isManageAddressModalOpen, setIsManageAddressModalOpen] = useState<boolean>(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState<boolean>(false);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState<boolean>(false);

  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    houseNo: '',
    street: '',
    area: '',
    city: '',
    district: '',
    state: 'Tamil Nadu',
    pincode: '',
    landmark: '',
    type: 'Home',
  });

  // Active Detailed Address
  const activeAddress = React.useMemo(() => {
    if (selectedAddressId && dbAddresses.length > 0) {
      const found = dbAddresses.find((a) => a.id === selectedAddressId);
      if (found) {
        return {
          id: found.id,
          name: `${found.firstName} ${found.lastName || ''}`.trim(),
          phone: found.phone,
          houseNo: found.streetLine1?.split(',')[0] || found.streetLine1,
          street: found.streetLine1?.split(',').slice(1).join(',') || found.streetLine1,
          area: found.streetLine2 || '',
          city: found.city,
          district: found.city,
          state: found.state,
          pincode: found.postalCode,
          landmark: found.streetLine2?.includes('Landmark:') ? found.streetLine2.split('Landmark:')[1]?.replace(')', '') : '',
        };
      }
    }
    if (dbAddresses && dbAddresses.length > 0) {
      const first = dbAddresses[0];
      return {
        id: first.id,
        name: `${first.firstName} ${first.lastName || ''}`.trim(),
        phone: first.phone,
        houseNo: first.streetLine1?.split(',')[0] || first.streetLine1,
        street: first.streetLine1?.split(',').slice(1).join(',') || first.streetLine1,
        area: first.streetLine2 || '',
        city: first.city,
        district: first.city,
        state: first.state,
        pincode: first.postalCode,
        landmark: first.streetLine2?.includes('Landmark:') ? first.streetLine2.split('Landmark:')[1]?.replace(')', '') : '',
      };
    }
    if (savedLocalAddress) {
      return {
        id: savedLocalAddress.id,
        name: savedLocalAddress.name,
        phone: savedLocalAddress.phone,
        houseNo: savedLocalAddress.addressLine1,
        street: savedLocalAddress.addressLine2 || '',
        area: savedLocalAddress.addressLine2 || '',
        city: savedLocalAddress.city,
        district: savedLocalAddress.city,
        state: savedLocalAddress.state,
        pincode: savedLocalAddress.pincode,
        landmark: savedLocalAddress.landmark || '',
      };
    }
    return {
      id: 'default_local',
      name: 'Aanya Sharma',
      phone: '9876543210',
      houseNo: 'Flat 402, Royal Enclave',
      street: '2nd Main Road',
      area: 'T. Nagar',
      city: 'Chennai',
      district: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600017',
      landmark: 'Near Apollo Hospital',
    };
  }, [selectedAddressId, dbAddresses, savedLocalAddress]);

  // Coupon input state
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const validateCouponMutation = useValidateCouponMutation();

  const cartList = storeItems.map((item) => ({
    id: item.id,
    slug: item.product?.slug || 'product',
    title: item.product?.title || 'Artisanal Soap',
    price: item.unitPrice || 0,
    originalPrice: (item.variant as any)?.compareAtPrice || (item.unitPrice || 0) + 100,
    quantity: item.quantity,
    badge: 'Handcrafted',
    badgeBg: '#EBF3FF',
    badgeText: '#002754',
    maxStock: Math.max(1, (item.variant as any)?.inventoryQuantity ?? (item.product as any)?.inventoryQuantity ?? 99),
    image: (() => {
      const img = item.product?.images?.[0];
      if (!img) return FALLBACK_IMAGE;
      if (typeof img === 'string') return img;
      return (img as any).url || FALLBACK_IMAGE;
    })(),
  }));

  // Total quantity and subtotal
  const totalItemsCount = cartList.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = cartList.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

  // Coupon discount (from store)
  const couponDiscount = coupon ? (coupon.discountType === 'percentage'
    ? Math.round((subtotal * coupon.discountValue) / 100)
    : Math.round(coupon.discountValue)) : 0;

  // Net product price after coupon
  const netProductPrice = Math.max(0, subtotal - couponDiscount);

  // GST 18% included in price
  const includedGst = Math.round((netProductPrice * 18) / 118);

  // Delivery using CINMAX centralized algorithm based on active address state
  const deliveryInfo = calculateDeliveryCharge(activeAddress.state, totalItemsCount);
  const shipping = deliveryInfo.deliveryCharge;

  // Grand total
  const grandTotal = Math.max(0, netProductPrice + shipping);

  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponError('');
    try {
      const result = await validateCouponMutation.mutateAsync({ code, subtotal });
      if (result.isValid && result.coupon) {
        applyCoupon({
          code: result.coupon.code,
          discountType: result.coupon.discountType as 'percentage' | 'fixed_amount' | 'free_shipping',
          discountValue: result.coupon.discountType === 'percentage'
            ? result.coupon.discountValue
            : result.coupon.discountType === 'fixed_amount'
              ? result.coupon.discountValue
              : 60,
        });
        setCouponInput('');
      } else {
        setCouponError(result.message || 'Invalid coupon code');
      }
    } catch {
      setCouponError('Could not validate coupon. Please try again.');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponError('');
    setCouponInput('');
  };

  const handleSaveAddress = () => {
    const cleanPhone = newAddress.phone.replace(/[^0-9]/g, '');
    const cleanPincode = newAddress.pincode.replace(/[^0-9]/g, '');

    if (!newAddress.name.trim()) {
      alert('Please enter Recipient Contact Name');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      alert('Please enter a valid 10-digit Indian Mobile Number starting with 6-9');
      return;
    }
    if (!newAddress.houseNo.trim()) {
      alert('Please enter House No. / Flat / Building Name');
      return;
    }
    if (!newAddress.street.trim()) {
      alert('Please enter Street / Road / Area');
      return;
    }
    if (!newAddress.city.trim()) {
      alert('Please enter City / District');
      return;
    }
    if (!newAddress.state.trim()) {
      alert('Please select State');
      return;
    }
    if (!/^\d{6}$/.test(cleanPincode)) {
      alert('Please enter a valid 6-digit Pincode');
      return;
    }

    const localObj = {
      id: `addr_${Date.now()}`,
      name: newAddress.name,
      phone: cleanPhone,
      addressLine1: `${newAddress.houseNo.trim()}, ${newAddress.street.trim()}`,
      addressLine2: `${newAddress.area.trim()}${newAddress.landmark ? ` (Landmark: ${newAddress.landmark.trim()})` : ''}`,
      city: newAddress.city.trim(),
      state: newAddress.state.trim(),
      pincode: cleanPincode,
      landmark: newAddress.landmark,
      type: newAddress.type,
    };

    setSavedLocalAddress(localObj);

    if (user?.id) {
      const nameParts = newAddress.name.trim().split(' ');
      addAddressMutation.mutate({
        userId: user.id,
        address: {
          firstName: nameParts[0] || 'Valued',
          lastName: nameParts.slice(1).join(' ') || '',
          phone: cleanPhone,
          streetLine1: `${newAddress.houseNo.trim()}, ${newAddress.street.trim()}`,
          streetLine2: `${newAddress.area.trim()}${newAddress.landmark ? ` (Landmark: ${newAddress.landmark.trim()})` : ''}`,
          city: newAddress.city.trim(),
          state: newAddress.state.trim(),
          postalCode: cleanPincode,
          country: 'India',
          isDefaultShipping: true,
          isDefaultBilling: true,
        },
      });
    }

    setIsAddingNewAddress(false);
    setIsManageAddressModalOpen(false);
    alert('Delivery address updated successfully!');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF7F2' }}>
      {/* 1. Header Bar */}
      <View style={{ paddingHorizontal: CONTAINER_PADDING, paddingTop: 14, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(247, 249, 251, 0.9)', borderBottomWidth: 1, borderBottomColor: 'rgba(195, 198, 209, 0.3)' }}>
        <TouchableOpacity onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)' as any))} style={{ padding: 4 }}>
          <ArrowLeft size={22} color="#002754" />
        </TouchableOpacity>
        <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: '#002754', letterSpacing: -0.5 }}>
          Shopping Cart
        </Text>
        <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/videos' as any)} style={{ padding: 4 }}>
            <Video size={22} color="#002754" />
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 4, position: 'relative' }}>
            <Bell size={22} color="#002754" />
            <View style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#C5A880' }} />
          </TouchableOpacity>
        </View>
      </View>

      {cartList.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#EBF3FF', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
            <ShoppingBag size={32} color="#002754" />
          </View>
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 24, color: '#002754', marginBottom: 12 }}>Your Cart is Empty</Text>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#434750', textAlign: 'center', marginBottom: 30, lineHeight: 22 }}>
            Looks like you haven't added any artisanal botanicals yet.
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/shop' as any)} style={{ backgroundColor: '#002754', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 30 }}>
            <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 14 }}>Explore Collection</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
        <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 + insets.bottom }}>

          {/* 2. Cart Summary Header Card */}
          <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 16, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.25)' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, color: '#002754', fontWeight: '700' }}>
                Items in Cart
              </Text>
              <View style={{ backgroundColor: '#EBF3FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#002754', fontSize: 11, fontWeight: '700' }}>
                  {totalItemsCount} {totalItemsCount === 1 ? 'Product' : 'Products'}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, color: '#002754', fontWeight: '700' }}>
                Subtotal: ₹{subtotal}
              </Text>
              {user && (
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, color: '#C5A880', fontWeight: '700' }}>
                  VIP Points: {user.loyaltyPoints || 0}
                </Text>
              )}
            </View>
          </View>

          {/* 3. Cart Items List */}
          <View style={{ paddingHorizontal: CONTAINER_PADDING, marginTop: 18, gap: 14 }}>
            {cartList.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
                onPressItem={(slug) => router.push(`/product/${slug}` as any)}
              />
            ))}
          </View>

          {/* 4. Coupon Code */}
          <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 18, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, gap: 10, shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.2)' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Tag size={18} color="#002754" />
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, fontWeight: '700', color: '#002754' }}>
                Coupon Code
              </Text>
            </View>

            {coupon ? (
              <View style={{ backgroundColor: '#F0FFF4', borderRadius: 14, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#059669' }}>
                <View>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#059669' }}>Applied: {coupon.code}</Text>
                  <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#059669' }}>Saving ₹{couponDiscount} on this order</Text>
                </View>
                <TouchableOpacity onPress={handleRemoveCoupon} style={{ padding: 6 }}>
                  <X size={18} color="#BA1A1A" />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TextInput
                    placeholder="Enter coupon code"
                    placeholderTextColor="#737781"
                    value={couponInput}
                    onChangeText={(t) => { setCouponInput(t.toUpperCase()); setCouponError(''); }}
                    autoCapitalize="characters"
                    style={{
                      flex: 1,
                      backgroundColor: '#F7F9FB',
                      borderWidth: 1,
                      borderColor: couponError ? '#BA1A1A' : '#C3C6D1',
                      borderRadius: 12,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      fontFamily: FONT_SANS_BOLD,
                      fontSize: 14,
                      color: '#002754',
                      letterSpacing: 1,
                    }}
                  />
                  <TouchableOpacity
                    onPress={handleApplyCoupon}
                    disabled={validateCouponMutation.isPending || !couponInput.trim()}
                    style={{
                      backgroundColor: couponInput.trim() ? '#002754' : '#C3C6D1',
                      paddingHorizontal: 16,
                      borderRadius: 12,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {validateCouponMutation.isPending ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 13 }}>Apply</Text>
                    )}
                  </TouchableOpacity>
                </View>
                {couponError ? (
                  <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#BA1A1A', marginTop: 6 }}>
                    {couponError}
                  </Text>
                ) : null}
              </>
            )}
          </View>

          {/* 5. Complete Delivery Address & Location Details Card */}
          <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 18, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, gap: 12, shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.25)' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <MapPin size={18} color="#002754" />
                <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, fontWeight: '700', color: '#002754' }}>
                  Delivery Address &amp; Location
                </Text>
              </View>
              <TouchableOpacity onPress={() => setIsManageAddressModalOpen(true)} style={{ backgroundColor: '#EBF3FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#002754', fontSize: 11 }}>Change / Add</Text>
              </TouchableOpacity>
            </View>

            {/* Complete Address Details Breakdown */}
            <View style={{ backgroundColor: '#F8FAFC', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.35)', gap: 4 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#002754' }}>{activeAddress.name}</Text>
                <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 12, color: '#002754' }}>Phone: {activeAddress.phone}</Text>
              </View>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#434750', marginTop: 2, lineHeight: 18 }}>
                {activeAddress.houseNo}, {activeAddress.street}
                {activeAddress.area ? `, ${activeAddress.area}` : ''}
              </Text>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#434750', lineHeight: 18 }}>
                {activeAddress.city}, District: {activeAddress.district || activeAddress.city}, <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#002754' }}>{activeAddress.state} - {activeAddress.pincode}</Text>
              </Text>
              {activeAddress.landmark ? (
                <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 11, color: '#64748B', marginTop: 2 }}>
                  Landmark: {activeAddress.landmark}
                </Text>
              ) : null}
            </View>

            {/* Dynamic Delivery Status */}
            <View style={{ backgroundColor: '#EBF3FF', borderRadius: 12, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#002754', fontWeight: '700' }}>
                  {totalItemsCount} Products → {activeAddress.state}
                </Text>
                <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#434750', marginTop: 2 }}>
                  {deliveryInfo.isFreeDelivery ? 'Free delivery qualifies for this order!' : `Standard shipping fee for ${activeAddress.state}`}
                </Text>
              </View>
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: deliveryInfo.isFreeDelivery ? '#059669' : '#002754', fontWeight: '700' }}>
                {deliveryInfo.isFreeDelivery ? 'FREE' : `₹${deliveryInfo.deliveryCharge}`}
              </Text>
            </View>
          </View>

          {/* 6. Order Summary */}
          <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 18, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.2)' }}>
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, fontWeight: '700', color: '#002754', marginBottom: 14 }}>
              Order Summary
            </Text>
            <View style={{ gap: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#434750' }}>Subtotal ({totalItemsCount} items)</Text>
                <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 14, color: '#191C1E' }}>₹{subtotal}</Text>
              </View>

              {couponDiscount > 0 && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#059669' }}>Coupon ({coupon?.code})</Text>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#059669' }}>-₹{couponDiscount}</Text>
                </View>
              )}

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#64748B' }}>GST (18% Included)</Text>
                <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#64748B' }}>₹{includedGst}</Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#434750' }}>Delivery ({activeAddress.state})</Text>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: deliveryInfo.isFreeDelivery ? '#059669' : '#002754' }}>
                  {deliveryInfo.isFreeDelivery ? 'FREE' : `₹${shipping}`}
                </Text>
              </View>

              <View style={{ borderTopWidth: 1, borderTopColor: '#E0E3E5', paddingTop: 12, marginTop: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, fontWeight: '700', color: '#002754' }}>Grand Total</Text>
                <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: '#002754' }}>₹{grandTotal}</Text>
              </View>
            </View>
          </View>

        </ScrollView>

        {/* Sticky Bottom Checkout CTA */}
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: CONTAINER_PADDING, paddingTop: 14, paddingBottom: Math.max(14, insets.bottom), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(195, 198, 209, 0.3)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.08, shadowRadius: 20, zIndex: 100 }}>
          <View>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#737781', textTransform: 'uppercase' }}>Total Amount</Text>
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, color: '#002754', fontWeight: '700' }}>₹{grandTotal}</Text>
          </View>

          <TouchableOpacity
            onPress={handleProceedToCheckout}
            style={{ backgroundColor: '#002754', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 8, shadowColor: '#002754', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 }}
          >
            <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Proceed to Checkout
            </Text>
          </TouchableOpacity>
        </View>
        </>
      )}

      {/* MANAGE / EDIT ADDRESS MODAL */}
      <Modal visible={isManageAddressModalOpen} animationType="slide" transparent>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, fontWeight: '700', color: '#002754' }}>
                {isAddingNewAddress ? 'Add Delivery Address' : 'Delivery Address Details'}
              </Text>
              <TouchableOpacity onPress={() => { setIsManageAddressModalOpen(false); setIsAddingNewAddress(false); }}>
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
                    {dbAddresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <TouchableOpacity
                          key={addr.id}
                          onPress={() => { setSelectedAddressId(addr.id || null); setIsManageAddressModalOpen(false); }}
                          style={{ backgroundColor: isSelected ? '#F0F5FF' : '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: isSelected ? 2 : 1, borderColor: isSelected ? '#002754' : 'rgba(195, 198, 209, 0.3)', flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}
                        >
                          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: isSelected ? '#002754' : '#ECEEF0', justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
                            {isSelected ? <Check size={16} color="white" /> : <Home size={16} color="#737781" />}
                          </View>
                          <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#191C1E' }}>{addr.firstName} {addr.lastName}</Text>
                              {isSelected && <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, color: '#002754', textTransform: 'uppercase' }}>ACTIVE</Text>}
                            </View>
                            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#434750', lineHeight: 16 }}>
                              {addr.streetLine1}, {addr.streetLine2 ? addr.streetLine2 + ', ' : ''}{addr.city}, {addr.state} - {addr.postalCode}
                            </Text>
                            <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 12, color: '#002754', marginTop: 4 }}>{addr.phone}</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="handled" keyboardDismissMode="none" contentContainerStyle={{ paddingBottom: 250 }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#002754', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>1. Recipient Contact Details</Text>
                <View style={{ marginBottom: 8 }}>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#191C1E', marginBottom: 4 }}>Full Name *</Text>
                  <TextInput placeholder="e.g. Aanya Sharma" placeholderTextColor="#737781" selectionColor="#002754" cursorColor="#002754" underlineColorAndroid="transparent" value={newAddress.name} onChangeText={(text) => setNewAddress({ ...newAddress, name: text })} style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, padding: 12, fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#191C1E' }} />
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#191C1E', marginBottom: 4 }}>10 digit mobile number *</Text>
                  <TextInput placeholder="e.g. 9876543210" placeholderTextColor="#737781" selectionColor="#002754" cursorColor="#002754" underlineColorAndroid="transparent" keyboardType="phone-pad" maxLength={10} value={newAddress.phone} onChangeText={(text) => setNewAddress({ ...newAddress, phone: text })} style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, padding: 12, fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#191C1E' }} />
                </View>

                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#002754', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>2. Location &amp; Street Address</Text>
                <View style={{ marginBottom: 8 }}>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#191C1E', marginBottom: 4 }}>House / Flat / Door No. *</Text>
                  <TextInput placeholder="e.g. Flat 402, Royal Enclave" placeholderTextColor="#737781" selectionColor="#002754" cursorColor="#002754" underlineColorAndroid="transparent" value={newAddress.houseNo} onChangeText={(text) => setNewAddress({ ...newAddress, houseNo: text })} style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, padding: 12, fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#191C1E' }} />
                </View>
                <View style={{ marginBottom: 8 }}>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#191C1E', marginBottom: 4 }}>Street / Road / Area / Locality *</Text>
                  <TextInput placeholder="e.g. 2nd Main Road, T. Nagar" placeholderTextColor="#737781" selectionColor="#002754" cursorColor="#002754" underlineColorAndroid="transparent" value={newAddress.street} onChangeText={(text) => setNewAddress({ ...newAddress, street: text })} style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, padding: 12, fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#191C1E' }} />
                </View>
                
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#191C1E', marginBottom: 4 }}>Pincode *</Text>
                    <TextInput placeholder="e.g. 600017" placeholderTextColor="#737781" selectionColor="#002754" cursorColor="#002754" underlineColorAndroid="transparent" keyboardType="number-pad" maxLength={6} value={newAddress.pincode} onChangeText={(text) => setNewAddress({ ...newAddress, pincode: text })} style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, padding: 12, fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#191C1E' }} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#191C1E', marginBottom: 4 }}>City *</Text>
                    <TextInput placeholder="e.g. Chennai" placeholderTextColor="#737781" selectionColor="#002754" cursorColor="#002754" underlineColorAndroid="transparent" value={newAddress.city} onChangeText={(text) => setNewAddress({ ...newAddress, city: text })} style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, padding: 12, fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#191C1E' }} />
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
                  <TextInput placeholder="Nearby Landmark (e.g. Near City Hospital)" placeholderTextColor="#737781" selectionColor="#002754" cursorColor="#002754" underlineColorAndroid="transparent" value={newAddress.landmark} onChangeText={(text) => setNewAddress({ ...newAddress, landmark: text })} style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, padding: 12, fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#191C1E' }} />
                </View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity onPress={() => setIsAddingNewAddress(false)} style={{ flex: 1, backgroundColor: '#ECEEF0', paddingVertical: 14, borderRadius: 16, alignItems: 'center' }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#434750', fontSize: 14 }}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSaveAddress} style={{ flex: 1, backgroundColor: '#002754', paddingVertical: 14, borderRadius: 16, alignItems: 'center' }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 14 }}>Save Address</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* LOGIN REQUIRED MODAL */}
      <Modal visible={isLoginModalOpen} animationType="fade" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <View style={{ width: '100%', maxWidth: 360, backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, alignItems: 'center', shadowColor: '#002754', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 8 }}>
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#F0F4F8', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
              <Lock size={26} color="#002754" />
            </View>

            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, color: '#002754', marginBottom: 8, textAlign: 'center' }}>
              Login Required
            </Text>

            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#434750', textAlign: 'center', marginBottom: 24, lineHeight: 20 }}>
              Please login to proceed with checkout.
            </Text>

            <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
              <TouchableOpacity
                onPress={() => setIsLoginModalOpen(false)}
                style={{ flex: 1, paddingVertical: 13, borderRadius: 14, borderWidth: 1, borderColor: '#C3C6D1', alignItems: 'center' }}
              >
                <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#434750', fontSize: 14 }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setIsLoginModalOpen(false);
                  router.push('/(auth)/login?redirect=/checkout' as any);
                }}
                style={{ flex: 1, paddingVertical: 13, borderRadius: 14, backgroundColor: '#002754', alignItems: 'center', shadowColor: '#002754', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 }}
              >
                <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#FFFFFF', fontSize: 14 }}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
