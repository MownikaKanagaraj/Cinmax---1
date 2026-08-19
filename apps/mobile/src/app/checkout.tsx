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
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCartStore, useUser, useAddressesQuery, useAddCustomerAddressMutation, useCheckoutSessionMutation } from '@cinmax/hooks';
import { calculateDeliveryCharge, ALL_INDIAN_STATES } from '@cinmax/utils';
import {
  ChevronLeft,
  Lock,
  Home,
  Check,
  ArrowRight,
  ShieldCheck,
  Truck,
  ChevronDown,
  Plus,
  MapPin,
  Edit3,
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

export interface CheckoutAddress {
  id: string;
  type: string;
  isDefault: boolean;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
}

export default function MobileCheckoutScreen() {
  const router = useRouter();
  const { items: cartStoreItems, clearCart } = useCartStore();
  const scrollViewRef = React.useRef<ScrollView>(null);

  const [activeStep, setActiveStep] = useState(1);

  React.useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, [activeStep]);

  const [selectedPayment, setSelectedPayment] = useState('razorpay');
  const [isTermsAccepted, setIsTermsAccepted] = useState(true);

  // Address Modal & Form State
  const [isManageAddressModalOpen, setIsManageAddressModalOpen] = useState(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);

  const [newAddress, setNewAddress] = useState<Partial<CheckoutAddress>>({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
    type: 'Home',
  });

  const { user } = useUser();
  const { data: dbAddresses = [] } = useAddressesQuery(user?.id);
  const addAddressMutation = useAddCustomerAddressMutation();
  const createCheckoutSession = useCheckoutSessionMutation();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  React.useEffect(() => {
    if (!selectedAddressId && dbAddresses.length > 0) {
      setSelectedAddressId(dbAddresses[0].id || null);
    }
  }, [dbAddresses, selectedAddressId]);

  const currentAddress = dbAddresses.find((a) => a.id === selectedAddressId) || dbAddresses[0] || { state: 'Tamil Nadu' };

  // Cart items from store
  const checkoutItems = cartStoreItems.map((item) => ({
    id: item.id,
    title: item.product?.title || 'Artisanal Botanical Soap',
    variant: 'Qty: ' + item.quantity,
    unitPrice: item.unitPrice || 450,
    quantity: item.quantity,
    image: item.product?.images?.[0]?.url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZHbiWzdqlWotKE_R5mRigs-k-s7pi5XBl-YdVnd9UCCnqB8eYNUzrHKUAbCfoOQrCRiBLSqfGkyKsXxcG88nWUMGwKSZBa5UmV_AlSYmElejlbwO6v1gX4RhqHCzY2Zs4ym1DzNFGvWdGwdLPXlzc_tOU2YWVAzu1Hnlpm0qMEiaLkPNtlo2SZLQrqQqmkVd0TSclg_8dWBTMCuQdIKA3T8Jd7W_9oIOrjpcrGPmFsxvw-BP9QHyG',
  }));

  // TOTAL PRODUCT QUANTITY = SUM(quantity of every item)
  const totalProducts = checkoutItems.reduce((sum, i) => sum + i.quantity, 0);

  // Centralized Delivery Charge Algorithm based on current address state
  const deliveryCalc = calculateDeliveryCharge(currentAddress.state, totalProducts);
  const deliveryCharge = deliveryCalc.deliveryCharge;

  // Order Financial Totals
  const subtotal = checkoutItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const discount = 345;
  const gst = Math.round(subtotal * 0.18);
  const grandTotal = Math.max(0, subtotal - discount + deliveryCharge + gst);

  const handleSaveNewAddress = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.addressLine1 || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      alert('Please fill in all required address fields including State.');
      return;
    }
    if (!user) {
      alert('Please log in to add an address.');
      return;
    }

    // Mapping checkout form fields to the Database Address format
    const dbAddressData = {
      firstName: newAddress.name.split(' ')[0] || newAddress.name,
      lastName: newAddress.name.split(' ').slice(1).join(' ') || '',
      phone: newAddress.phone,
      streetLine1: newAddress.addressLine1,
      streetLine2: newAddress.addressLine2 || '',
      city: newAddress.city,
      state: newAddress.state,
      postalCode: newAddress.pincode,
      country: 'India',
    };

    addAddressMutation.mutate({
      userId: user.id,
      address: dbAddressData,
    }, {
      onSuccess: () => {
        setIsAddingNewAddress(false);
        setIsManageAddressModalOpen(false);
      }
    });
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (Platform.OS !== 'web' || typeof window === 'undefined') return resolve(false);
      if ((window as any).Razorpay) return resolve(true);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        setIsProcessing(true);

        if (!currentAddress || !currentAddress.id) {
          alert('Please select or add a delivery address');
          return;
        }

        let orderData: any = null;

        // Try using the DB mutation if cart items and user exist
        if (cartStoreItems.length > 0 && user) {
          try {
            const dbAddressData = {
              firstName: currentAddress.firstName || currentAddress.name?.split(' ')[0] || 'Guest',
              lastName: currentAddress.lastName || currentAddress.name?.split(' ').slice(1).join(' ') || '',
              phone: currentAddress.phone,
              streetLine1: currentAddress.streetLine1 || currentAddress.addressLine1,
              streetLine2: currentAddress.streetLine2 || currentAddress.addressLine2 || '',
              city: currentAddress.city,
              state: currentAddress.state,
              postalCode: currentAddress.postalCode || currentAddress.pincode,
              country: 'India',
            };

            const sessionResult = await createCheckoutSession.mutateAsync({
              userIdOrAnonId: user.id,
              cart: { items: cartStoreItems, subtotal: 0, totalItemsCount: 0 }, // Engine recalculates totals
              shippingAddress: dbAddressData,
            });

            if (sessionResult.isValid) {
               orderData = sessionResult.razorpayOrder;
            }
          } catch (e) {
             console.error('Error creating session with DB', e);
          }
        }

        const isLoaded = await loadRazorpayScript();

        if (isLoaded) {
          const options: any = {
            key: orderData?.key_id || process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TND5mOhcC1aMBW',
            amount: orderData?.amount || Math.round(grandTotal * 100),
            currency: orderData?.currency || 'INR',
            name: 'CINMAX Global Products',
            description: 'Artisanal Botanicals Order',
            handler: async function (response: any) {
              // STEP 3: Verify Payment Signature via Backend
              const verifyEndpoint = typeof window !== 'undefined' && window.location.port === '3000'
                ? '/api/verify-payment'
                : 'http://localhost:3000/api/verify-payment';

              await fetch(verifyEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }).catch(() => null);

              clearCart();
              router.push({
                pathname: '/order-success',
                params: {
                  deliveryState: deliveryCalc.state,
                  totalProducts: deliveryCalc.totalProducts.toString(),
                  deliveryCharge: deliveryCalc.deliveryCharge.toString(),
                  isFree: deliveryCalc.isFreeDelivery ? 'true' : 'false',
                  paymentId: response.razorpay_payment_id || 'rzp_pay_success',
                },
              } as any);
              setIsProcessing(false);
            },
            modal: {
              ondismiss: function () {
                setIsProcessing(false);
              },
            },
            prefill: {
              name: currentAddress.name,
              contact: currentAddress.phone,
              email: 'patron@cinmax.luxury',
            },
            theme: {
              color: '#002754',
            },
          };

          if (orderData?.order_id && typeof orderData.order_id === 'string' && orderData.order_id.startsWith('order_')) {
            options.order_id = orderData.order_id;
          }

          const rzp = new (window as any).Razorpay(options);
          rzp.on('payment.failed', function (resp: any) {
            alert(`Payment Failed: ${resp.error?.description || 'Transaction declined'}`);
            setIsProcessing(false);
          });
          rzp.open();
          return;
        }
      } catch (err: any) {
        console.error('Razorpay Web Checkout error:', err);
      } finally {
        setIsProcessing(false);
      }
    }

    clearCart();
    router.push({
      pathname: '/order-success',
      params: {
        deliveryState: deliveryCalc.state,
        totalProducts: deliveryCalc.totalProducts.toString(),
        deliveryCharge: deliveryCalc.deliveryCharge.toString(),
        isFree: deliveryCalc.isFreeDelivery ? 'true' : 'false',
      },
    } as any);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FB' }}>
      {/* 1. Sticky Header */}
      <View style={{ paddingHorizontal: CONTAINER_PADDING, paddingTop: 14, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(247, 249, 251, 0.95)', borderBottomWidth: 1, borderBottomColor: 'rgba(195, 198, 209, 0.3)', zIndex: 100 }}>
        <TouchableOpacity onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)' as any))} style={{ padding: 4 }}>
          <ChevronLeft size={22} color="#002754" />
        </TouchableOpacity>
        <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: '#002754', letterSpacing: -0.5 }}>
          Checkout
        </Text>
        <View style={{ padding: 4 }}>
          <Lock size={20} color="#C5A880" />
        </View>
      </View>

      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* 2. Checkout Progress Stepper */}
        <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            <View style={{ position: 'absolute', top: 16, left: 20, right: 20, height: 2, backgroundColor: '#E0E3E5', zIndex: 0 }} />

            <TouchableOpacity onPress={() => setActiveStep(1)} style={{ alignItems: 'center', zIndex: 1, backgroundColor: '#F7F9FB', paddingHorizontal: 4 }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: activeStep >= 1 ? '#002754' : '#E0E3E5', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 13 }}>1</Text>
              </View>
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, color: activeStep >= 1 ? '#002754' : '#434750', textTransform: 'uppercase', marginTop: 4 }}>Address</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setActiveStep(2)} style={{ alignItems: 'center', zIndex: 1, backgroundColor: '#F7F9FB', paddingHorizontal: 4 }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: activeStep >= 2 ? '#002754' : '#E0E3E5', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, color: activeStep >= 2 ? 'white' : '#434750', fontSize: 13 }}>2</Text>
              </View>
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, color: activeStep >= 2 ? '#002754' : '#434750', textTransform: 'uppercase', marginTop: 4 }}>Delivery</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setActiveStep(3)} style={{ alignItems: 'center', zIndex: 1, backgroundColor: '#F7F9FB', paddingHorizontal: 4 }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: activeStep >= 3 ? '#002754' : '#E0E3E5', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, color: activeStep >= 3 ? 'white' : '#434750', fontSize: 13 }}>3</Text>
              </View>
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, color: activeStep >= 3 ? '#002754' : '#434750', textTransform: 'uppercase', marginTop: 4 }}>Payment</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setActiveStep(4)} style={{ alignItems: 'center', zIndex: 1, backgroundColor: '#F7F9FB', paddingHorizontal: 4 }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: activeStep >= 4 ? '#002754' : '#E0E3E5', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, color: activeStep >= 4 ? 'white' : '#434750', fontSize: 13 }}>4</Text>
              </View>
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, color: activeStep >= 4 ? '#002754' : '#434750', textTransform: 'uppercase', marginTop: 4 }}>Review</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Delivery Address Section (ONLY SHOWS LAST TIME USED ADDRESS) */}
        <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, fontWeight: '700', color: '#002754' }}>
              Delivery Address
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsAddingNewAddress(false);
                setIsManageAddressModalOpen(true);
              }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#EBF3FF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 }}
            >
              <Edit3 size={13} color="#002754" />
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: '#002754', textTransform: 'uppercase', fontWeight: '700' }}>
                Change / Add Address
              </Text>
            </TouchableOpacity>
          </View>

          {/* SINGLE LAST USED ADDRESS CARD */}
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: 18,
              flexDirection: 'row',
              gap: 14,
              alignItems: 'flex-start',
              borderLeftWidth: 4,
              borderLeftColor: '#002754',
              shadowColor: '#0A3D78',
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.05,
              shadowRadius: 12,
              borderWidth: 1,
              borderColor: '#002754',
            }}
          >
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(180, 205, 254, 0.35)', justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
              <MapPin size={20} color="#002754" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 16, fontWeight: '700', color: '#191C1E' }}>{currentAddress.firstName || currentAddress.name} {currentAddress.lastName}</Text>
                  <View style={{ backgroundColor: '#002754', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 9, fontWeight: '700', textTransform: 'uppercase' }}>
                      {currentAddress.state}
                    </Text>
                  </View>
                </View>
                <View style={{ backgroundColor: '#EBF3FF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#002754', fontSize: 9, fontWeight: '700', textTransform: 'uppercase' }}>
                    LAST USED
                  </Text>
                </View>
              </View>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', lineHeight: 19, marginBottom: 6 }}>
                {currentAddress.streetLine1 || currentAddress.addressLine1}, {currentAddress.streetLine2 || currentAddress.addressLine2 ? (currentAddress.streetLine2 || currentAddress.addressLine2) + ', ' : ''}{currentAddress.city}, {currentAddress.state} - {currentAddress.postalCode || currentAddress.pincode}
              </Text>
              <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 13, color: '#002754' }}>
                Phone: {currentAddress.phone}
              </Text>
            </View>
          </View>
        </View>

        {/* 4. Delivery & Tariff Engine Summary */}
        <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 24 }}>
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, fontWeight: '700', color: '#002754', marginBottom: 12 }}>
            Shipping Tariff Engine
          </Text>
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#002754', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Truck size={24} color="#002754" />
                <View>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, fontWeight: '700', color: '#191C1E' }}>
                    {deliveryCalc.state} Delivery Rule
                  </Text>
                  <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#434750' }}>
                    Total Products: {totalProducts} units
                  </Text>
                </View>
              </View>
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, color: deliveryCalc.isFreeDelivery ? '#059669' : '#002754', fontWeight: '700' }}>
                {deliveryCalc.isFreeDelivery ? 'FREE' : `₹${deliveryCalc.deliveryCharge}`}
              </Text>
            </View>

            <View style={{ borderTopWidth: 1, borderTopColor: '#F0F2F5', paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#737781' }}>Rule Basis: {currentAddress.state}</Text>
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: '#002754' }}>
                {deliveryCalc.isFreeDelivery ? 'Free Shipping Qualified' : `Standard Tariff Applies`}
              </Text>
            </View>
          </View>
        </View>

        {/* 5. Payment Options (Razorpay Only - No COD) */}
        <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 24 }}>
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, fontWeight: '700', color: '#002754', marginBottom: 12 }}>
            Payment Method
          </Text>
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, borderWidth: 1.5, borderColor: '#002754', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, gap: 14 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: '#EBF3FF', justifyContent: 'center', alignItems: 'center' }}>
                  <ShieldCheck size={24} color="#002754" />
                </View>
                <View>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 15, fontWeight: '700', color: '#191C1E' }}>Razorpay Secure Gateway</Text>
                  <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#434750', marginTop: 2 }}>UPI, Cards, Netbanking &amp; Wallets</Text>
                </View>
              </View>
              <View style={{ backgroundColor: '#002754', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 }}>ONLINE</Text>
              </View>
            </View>

            <View style={{ backgroundColor: '#F7F9FB', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#E0E3E5' }}>
              <Lock size={14} color="#059669" />
              <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 12, color: '#059669', flex: 1 }}>
                Online Payment Only • Cash on Delivery (COD) is disabled
              </Text>
            </View>
          </View>
        </View>

        {/* 6. Order Summary */}
        <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 24, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.2)' }}>
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, fontWeight: '700', color: '#002754', marginBottom: 14 }}>
            Order Summary
          </Text>
          <View style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#434750' }}>Subtotal ({totalProducts} units)</Text>
              <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 14, color: '#191C1E' }}>₹{subtotal}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#C5A880' }}>Luxe Member Discount</Text>
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#C5A880' }}>-₹{discount}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#434750' }}>Delivery Charge ({deliveryCalc.state})</Text>
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: deliveryCalc.isFreeDelivery ? '#059669' : '#002754' }}>
                {deliveryCalc.isFreeDelivery ? 'FREE' : `₹${deliveryCharge}`}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#434750' }}>Estimated GST (18%)</Text>
              <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 14, color: '#191C1E' }}>₹{gst}</Text>
            </View>
            <View style={{ borderTopWidth: 1, borderTopColor: '#E0E3E5', paddingTop: 12, marginTop: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, fontWeight: '700', color: '#002754' }}>Grand Total</Text>
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: '#002754' }}>₹{grandTotal}</Text>
            </View>
          </View>
        </View>

        {/* 7. Terms & Conditions */}
        <TouchableOpacity
          onPress={() => setIsTermsAccepted(!isTermsAccepted)}
          style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 24, flexDirection: 'row', alignItems: 'center', gap: 10 }}
        >
          <View style={{ width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: isTermsAccepted ? '#002754' : '#737781', backgroundColor: isTermsAccepted ? '#002754' : 'transparent', justifyContent: 'center', alignItems: 'center' }}>
            {isTermsAccepted && <Check size={14} color="white" />}
          </View>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', flex: 1 }}>
            I agree to the <Text style={{ color: '#002754', textDecorationLine: 'underline' }}>Terms &amp; Conditions</Text> and <Text style={{ color: '#002754', textDecorationLine: 'underline' }}>Privacy Policy</Text>.
          </Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Profile Address Management & Add Address Modal */}
      <Modal visible={isManageAddressModalOpen} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '88%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, fontWeight: '700', color: '#002754' }}>
                {isAddingNewAddress ? 'Add New Address' : 'Profile Delivery Addresses'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setIsManageAddressModalOpen(false);
                  setIsAddingNewAddress(false);
                }}
                style={{ padding: 4 }}
              >
                <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#737781' }}>Done</Text>
              </TouchableOpacity>
            </View>

            {!isAddingNewAddress ? (
              <View style={{ gap: 14 }}>
                <TouchableOpacity
                  onPress={() => setIsAddingNewAddress(true)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    backgroundColor: '#EBF3FF',
                    paddingVertical: 12,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: '#002754',
                  }}
                >
                  <Plus size={18} color="#002754" />
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#002754' }}>
                    + Add New Profile Address
                  </Text>
                </TouchableOpacity>

                <ScrollView style={{ maxHeight: 380 }}>
                  <View style={{ gap: 12 }}>
                    {dbAddresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <TouchableOpacity
                          key={addr.id}
                          onPress={() => {
                            setSelectedAddressId(addr.id || null); // updates last used address
                            setIsManageAddressModalOpen(false);
                          }}
                          style={{
                            backgroundColor: isSelected ? '#F0F5FF' : '#FFFFFF',
                            borderRadius: 16,
                            padding: 16,
                            borderWidth: isSelected ? 2 : 1,
                            borderColor: isSelected ? '#002754' : 'rgba(195, 198, 209, 0.3)',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            gap: 12,
                          }}
                        >
                          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: isSelected ? '#002754' : '#ECEEF0', justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
                            {isSelected ? <Check size={16} color="white" /> : <Home size={16} color="#737781" />}
                          </View>
                          <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#191C1E' }}>{addr.firstName} {addr.lastName}</Text>
                                <View style={{ backgroundColor: '#EBF3FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 }}>
                                  <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#002754', fontSize: 9 }}>{addr.state}</Text>
                                </View>
                              </View>
                              {isSelected && (
                                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, color: '#002754', textTransform: 'uppercase' }}>
                                  ACTIVE
                                </Text>
                              )}
                            </View>
                            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#434750', lineHeight: 16 }}>
                              {addr.streetLine1}, {addr.streetLine2 ? addr.streetLine2 + ', ' : ''}{addr.city}, {addr.state} - {addr.postalCode}
                            </Text>
                            <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 12, color: '#002754', marginTop: 4 }}>
                              {addr.phone}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            ) : (
              <ScrollView style={{ gap: 12 }}>
                <TextInput
                  placeholder="Full Name *"
                  value={newAddress.name}
                  onChangeText={(text) => setNewAddress({ ...newAddress, name: text })}
                  style={{ backgroundColor: '#F7F9FB', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, padding: 12, fontFamily: FONT_SANS_REGULAR, fontSize: 14, marginBottom: 10 }}
                />
                <TextInput
                  placeholder="Phone Number *"
                  keyboardType="phone-pad"
                  value={newAddress.phone}
                  onChangeText={(text) => setNewAddress({ ...newAddress, phone: text })}
                  style={{ backgroundColor: '#F7F9FB', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, padding: 12, fontFamily: FONT_SANS_REGULAR, fontSize: 14, marginBottom: 10 }}
                />
                <TextInput
                  placeholder="Address Line 1 *"
                  value={newAddress.addressLine1}
                  onChangeText={(text) => setNewAddress({ ...newAddress, addressLine1: text })}
                  style={{ backgroundColor: '#F7F9FB', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, padding: 12, fontFamily: FONT_SANS_REGULAR, fontSize: 14, marginBottom: 10 }}
                />
                <TextInput
                  placeholder="Address Line 2"
                  value={newAddress.addressLine2}
                  onChangeText={(text) => setNewAddress({ ...newAddress, addressLine2: text })}
                  style={{ backgroundColor: '#F7F9FB', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, padding: 12, fontFamily: FONT_SANS_REGULAR, fontSize: 14, marginBottom: 10 }}
                />
                <TextInput
                  placeholder="City *"
                  value={newAddress.city}
                  onChangeText={(text) => setNewAddress({ ...newAddress, city: text })}
                  style={{ backgroundColor: '#F7F9FB', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, padding: 12, fontFamily: FONT_SANS_REGULAR, fontSize: 14, marginBottom: 10 }}
                />

                {/* State Dropdown Selector */}
                <TouchableOpacity
                  onPress={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                  style={{ backgroundColor: '#F7F9FB', borderWidth: 1, borderColor: '#002754', borderRadius: 12, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}
                >
                  <View>
                    <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 10, color: '#737781' }}>State *</Text>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#002754' }}>{newAddress.state || 'Select State'}</Text>
                  </View>
                  <ChevronDown size={18} color="#002754" />
                </TouchableOpacity>

                {isStateDropdownOpen && (
                  <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#002754', borderRadius: 12, maxHeight: 180, marginBottom: 10 }}>
                    <ScrollView nestedScrollEnabled>
                      {ALL_INDIAN_STATES.map((st) => (
                        <TouchableOpacity
                          key={st}
                          onPress={() => {
                            setNewAddress({ ...newAddress, state: st });
                            setIsStateDropdownOpen(false);
                          }}
                          style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#F0F2F5' }}
                        >
                          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#002754' }}>{st}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}

                <TextInput
                  placeholder="Pincode *"
                  keyboardType="number-pad"
                  value={newAddress.pincode}
                  onChangeText={(text) => setNewAddress({ ...newAddress, pincode: text })}
                  style={{ backgroundColor: '#F7F9FB', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, padding: 12, fontFamily: FONT_SANS_REGULAR, fontSize: 14, marginBottom: 14 }}
                />

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity
                    onPress={() => setIsAddingNewAddress(false)}
                    style={{ flex: 1, backgroundColor: '#ECEEF0', paddingVertical: 14, borderRadius: 16, alignItems: 'center' }}
                  >
                    <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#434750', fontSize: 14 }}>Back to List</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSaveNewAddress}
                    style={{ flex: 1, backgroundColor: '#002754', paddingVertical: 14, borderRadius: 16, alignItems: 'center' }}
                  >
                    <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 14 }}>Save &amp; Select</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* 8. Sticky Bottom Action Bar */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: CONTAINER_PADDING, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(195, 198, 209, 0.3)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.08, shadowRadius: 20, zIndex: 100 }}>
        <View>
          <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, fontWeight: '700', color: '#737781', textTransform: 'uppercase', letterSpacing: 0.8 }}>Grand Total</Text>
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 24, fontWeight: '700', color: '#002754' }}>₹{grandTotal}</Text>
        </View>
        <TouchableOpacity
          onPress={handlePlaceOrder}
          disabled={isProcessing}
          style={{ flex: 1, marginLeft: 20, backgroundColor: isProcessing ? '#434750' : '#002754', paddingVertical: 14, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, shadowColor: '#002754', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 }}
        >
          <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>
            {isProcessing ? 'Processing...' : 'Pay with Razorpay'}
          </Text>
          <ArrowRight size={18} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
