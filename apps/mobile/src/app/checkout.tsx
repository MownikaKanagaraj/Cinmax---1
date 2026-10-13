import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  BackHandler,
  KeyboardAvoidingView,
  Linking,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { WebView } from 'react-native-webview';
import { getContainer } from '@cinmax/api';
import {
  useCartStore,
  useUser,
  useAuthStore,
  useQueryClient,
  useAddressesQuery,
  useAddCustomerAddressMutation,
  useCheckoutSessionMutation,
  useCreateOrderMutation,
  useDispatchTimeQuery,
} from '@cinmax/hooks';
import { calculateDeliveryCharge, ALL_INDIAN_STATES, getProductFallbackImage } from '@cinmax/utils';
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
  Gift,
  Tag,
  X,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  PartyPopper,
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

function MobileConfettiCannon({ isVisible }: { isVisible: boolean }) {
  const [particles] = useState(() =>
    Array.from({ length: 32 }).map((_, i) => ({
      id: i,
      xAnim: new Animated.Value(0),
      yAnim: new Animated.Value(0),
      rotAnim: new Animated.Value(0),
      opAnim: new Animated.Value(1),
      color: ['#C5A880', '#D4AF37', '#002754', '#FFFFFF', '#4ADE80', '#F59E0B'][i % 6],
      size: 7 + (i % 5) * 2,
      targetX: (i % 2 === 0 ? -1 : 1) * (30 + (i * 13) % 140),
      targetY: 220 + (i * 11) % 300,
      delay: (i % 4) * 80,
    }))
  );

  useEffect(() => {
    if (isVisible) {
      particles.forEach((p) => {
        p.xAnim.setValue(0);
        p.yAnim.setValue(0);
        p.rotAnim.setValue(0);
        p.opAnim.setValue(1);

        Animated.sequence([
          Animated.delay(p.delay),
          Animated.parallel([
            Animated.timing(p.xAnim, {
              toValue: p.targetX,
              duration: 2200,
              useNativeDriver: true,
            }),
            Animated.timing(p.yAnim, {
              toValue: p.targetY,
              duration: 2200,
              useNativeDriver: true,
            }),
            Animated.timing(p.rotAnim, {
              toValue: 360,
              duration: 2200,
              useNativeDriver: true,
            }),
            Animated.timing(p.opAnim, {
              toValue: 0,
              duration: 2200,
              delay: 1000,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      });
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 99999 }}>
      {particles.map((p) => (
        <Animated.View
          key={p.id}
          style={{
            position: 'absolute',
            top: '35%',
            left: '50%',
            width: p.size,
            height: p.size * 0.7,
            borderRadius: p.id % 3 === 0 ? p.size / 2 : 2,
            backgroundColor: p.color,
            opacity: p.opAnim,
            transform: [
              { translateX: p.xAnim },
              { translateY: p.yAnim },
              {
                rotate: p.rotAnim.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );
}

export default function MobileCheckoutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { dispatchTimeDays } = useDispatchTimeQuery();
  const { items: cartStoreItems, clearCart, coupon, removeCoupon, savedLocalAddress, setSavedLocalAddress } = useCartStore();
  const scrollViewRef = React.useRef<ScrollView>(null);

  const [activeStep, setActiveStep] = useState(1);

  React.useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, [activeStep]);

  const [selectedPayment, setSelectedPayment] = useState('razorpay');
  const [isTermsAccepted, setIsTermsAccepted] = useState(true);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  // Loyalty points redemption & celebration popup state
  const [redeemLoyalty, setRedeemLoyalty] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{
    isOpen: boolean;
    orderNumber: string;
    paymentId: string;
    pointsEarned: number;
  }>({
    isOpen: false,
    orderNumber: '',
    paymentId: '',
    pointsEarned: 0,
  });

  // Native Razorpay WebView Modal State (Android / iOS / Expo Go)
  const [nativeRazorpayState, setNativeRazorpayState] = useState<{
    isOpen: boolean;
    html: string;
    prebuiltOrderNum: string;
    prebuiltPtsEarned: number;
  }>({
    isOpen: false,
    html: '',
    prebuiltOrderNum: '',
    prebuiltPtsEarned: 0,
  });

  const getApiBaseUrl = () => {
    let url = process.env.EXPO_PUBLIC_API_URL || '';
    const isLocal = !url || url.includes('localhost') || url.includes('127.0.0.1') || url.includes('vercel.app');

    if (isLocal) {
      if (__DEV__) {
        const hostUri = Constants.expoConfig?.hostUri || (Constants as any).manifest?.debuggerHost || '';
        const hostIp = hostUri ? hostUri.split(':')[0] : '';
        if (hostIp && hostIp !== 'localhost' && hostIp !== '127.0.0.1') {
          return `http://${hostIp}:3000/api`;
        }
      }
      return 'https://cinmax-website.pages.dev/api';
    }
    return url;
  };

  useEffect(() => {
    // The Modal component's onRequestClose handles the Android hardware back button.
    // We removed the global BackHandler here to prevent conflicting back press handling
    // which causes the Modal to get stuck.
  }, []);

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

  const { user, isLoading: isAuthLoading } = useUser();
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: dbAddresses = [] } = useAddressesQuery(user?.id);
  const addAddressMutation = useAddCustomerAddressMutation();
  const createCheckoutSession = useCheckoutSessionMutation();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');

  React.useEffect(() => {
    if (!selectedAddressId && dbAddresses.length > 0) {
      setSelectedAddressId(dbAddresses[0].id || null);
    }
  }, [dbAddresses, selectedAddressId]);

  React.useEffect(() => {
    if (isMounted && !isAuthLoading && !user) {
      const timer = setTimeout(() => {
        router.replace('/(auth)/login' as any);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isMounted, isAuthLoading, user]);

  const currentAddress = dbAddresses.find((a) => a.id === selectedAddressId) || dbAddresses[0] || { state: 'Tamil Nadu' };

  // Cart items from store
  const checkoutItems = cartStoreItems.map((item) => {
    const imgRaw = item.product?.images?.[0];
    const rawUrl = typeof imgRaw === 'string' ? imgRaw : (imgRaw as any)?.url;
    const imgUrl = (rawUrl && typeof rawUrl === 'string' && rawUrl.startsWith('http') && !rawUrl.includes('audit-test') && !rawUrl.includes('placehold'))
      ? rawUrl
      : getProductFallbackImage(item.product?.slug || item.product?.title, 1);
    return {
      id: item.id,
      productId: item.productId || (item.product as any)?.id,
      variantId: item.variantId || (item.variant as any)?.id,
      title: item.product?.title || 'Artisanal Botanical Soap',
      variantTitle: item.variant?.title || `Qty: ${item.quantity}`,
      variant: item.variant?.title || `Qty: ${item.quantity}`,
      unitPrice: item.unitPrice || 0,
      price: item.unitPrice || 0,
      quantity: item.quantity,
      image: imgUrl,
      product: item.product,
    };
  });

  // Total product quantity
  const totalProducts = checkoutItems.reduce((sum, i) => sum + i.quantity, 0);

  // --- CORRECT CHECKOUT CALCULATIONS ---
  // 1. Subtotal
  const subtotal = checkoutItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  // 2. Coupon discount
  const couponDiscount = coupon
    ? coupon.discountType === 'percentage'
      ? Math.round((subtotal * coupon.discountValue) / 100)
      : Math.round(coupon.discountValue)
    : 0;

  // 3. Available loyalty points (from real user profile)
  const availableLoyaltyPoints = user?.loyaltyPoints || 0;
  // ₹1 per 1 loyalty point — cap at max 20% of (subtotal - coupon)
  const afterCoupon = Math.max(0, subtotal - couponDiscount);
  const maxLoyaltyRedemption = Math.floor(afterCoupon * 0.20); // allow up to 20% of order
  const loyaltyRedemption = redeemLoyalty
    ? Math.min(availableLoyaltyPoints, maxLoyaltyRedemption)
    : 0;

  // 4. Net Product Price (Prices are inclusive of taxes)
  const netProductPrice = Math.max(0, afterCoupon - loyaltyRedemption);

  // 5. GST (18% included in product list price)
  const includedGst = Math.round((netProductPrice * 18) / 118);

  // 6. Delivery using centralized CINMAX state & quantity algorithm
  const deliveryCalc = calculateDeliveryCharge(currentAddress?.state || null, totalProducts);
  const deliveryCharge = deliveryCalc.deliveryCharge;

  // 7. Grand Total (Net product price + Delivery charge)
  const grandTotal = Math.max(0, netProductPrice + deliveryCharge);

  const handleSaveNewAddress = () => {
    const cleanPhone = (newAddress.phone || '').replace(/[^0-9]/g, '');
    const cleanPincode = (newAddress.pincode || '').replace(/[^0-9]/g, '');

    if (!newAddress.name?.trim()) {
      alert('Please enter Recipient Contact Name');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      alert('Please enter a valid 10-digit Indian Mobile Number starting with 6-9');
      return;
    }
    if (!newAddress.addressLine1?.trim()) {
      alert('Please enter House No. / Flat / Building Name');
      return;
    }
    if (!newAddress.addressLine2?.trim()) {
      alert('Please enter Street / Road / Area');
      return;
    }
    if (!newAddress.city?.trim()) {
      alert('Please enter City / District');
      return;
    }
    if (!newAddress.state?.trim()) {
      alert('Please select State');
      return;
    }
    if (!/^\d{6}$/.test(cleanPincode)) {
      alert('Please enter a valid 6-digit Pincode');
      return;
    }
    const localAddressObj = {
      id: `addr_${Date.now()}`,
      name: newAddress.name || 'Valued Customer',
      phone: cleanPhone,
      addressLine1: newAddress.addressLine1 || '',
      addressLine2: newAddress.addressLine2 || '',
      city: newAddress.city || '',
      state: newAddress.state || 'Tamil Nadu',
      pincode: cleanPincode,
      landmark: (newAddress as any).landmark || '',
      type: newAddress.type || 'Home',
    };
    setSavedLocalAddress(localAddressObj);

    if (!user) {
      setIsAddingNewAddress(false);
      setIsManageAddressModalOpen(false);
      alert('Delivery address saved successfully!');
      return;
    }

    const dbAddressData = {
      firstName: newAddress.name.split(' ')[0] || newAddress.name,
      lastName: newAddress.name.split(' ').slice(1).join(' ') || '',
      phone: cleanPhone,
      streetLine1: newAddress.addressLine1,
      streetLine2: `${newAddress.addressLine2}${(newAddress as any).landmark ? ` (Landmark: ${(newAddress as any).landmark})` : ''}`,
      city: newAddress.city,
      state: newAddress.state,
      postalCode: cleanPincode,
      country: 'India',
      isDefaultShipping: true,
      isDefaultBilling: true,
    };

    addAddressMutation.mutate({
      userId: user.id,
      address: dbAddressData,
    }, {
      onSuccess: (savedAddress) => {
        if (savedAddress?.id) {
          setSelectedAddressId(savedAddress.id);
        }
        setIsAddingNewAddress(false);
        setIsManageAddressModalOpen(false);
        setActiveStep(2);
      },
      onError: (err: any) => {
        alert(err.message || 'Failed to save address. Please try again.');
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

  const handleNativeRazorpayMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'PAYMENT_SUCCESS') {
        const payload = data.payload || {};
        const razorpay_order_id = payload.razorpay_order_id;
        const razorpay_payment_id = payload.razorpay_payment_id;
        const razorpay_signature = payload.razorpay_signature;
        const prebuiltOrderNum = nativeRazorpayState.prebuiltOrderNum;
        const prebuiltPtsEarned = nativeRazorpayState.prebuiltPtsEarned;

        console.log('[Razorpay Payment Success Event]:', {
          order_id: razorpay_order_id,
          payment_id_prefix: (razorpay_payment_id || '').substring(0, 8) + '...',
          order_number: prebuiltOrderNum,
        });

        setNativeRazorpayState((prev) => ({ ...prev, isOpen: false }));
        clearCart();
        setIsProcessing(false);

        const apiBase = getApiBaseUrl();
        const baseUrl = apiBase.replace(/\/$/, '').replace(/\/verify-payment$/, '').replace(/\/create-order$/, '');

        // 1. Submit background server verification
        (async () => {
          try {
            console.log('[Verify-Payment Request]: Submitting verification for order:', razorpay_order_id);
            const verifyRes = await fetch(`${baseUrl}/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                userId: user?.id,
                loyaltyPointsRedeemed: loyaltyRedemption,
                grandTotal,
                subtotal,
                discountAmount: couponDiscount + loyaltyRedemption,
                deliveryCharge,
                deliveryState: currentAddress.state || 'Tamil Nadu',
                cartItems: checkoutItems,
                shippingAddress: currentAddress,
                paymentMethod: 'razorpay',
              }),
            });

            console.log('[Verify-Payment Response Status]:', verifyRes.status);
            queryClient.invalidateQueries();
          } catch (err) {
            console.error('Native background verify error:', err);
          }
        })();

        // 2. Direct Navigation to Order Success Screen
        router.replace({
          pathname: '/order-success',
          params: {
            orderNumber: prebuiltOrderNum,
            pointsEarned: String(prebuiltPtsEarned),
            deliveryState: currentAddress.state || 'Tamil Nadu',
            totalProducts: String(totalProducts),
            deliveryCharge: String(deliveryCharge),
          },
        } as any);
      } else if (data.type === 'PAYMENT_CANCELLED') {
        setNativeRazorpayState((prev) => ({ ...prev, isOpen: false }));
        setIsProcessing(false);
      } else if (data.type === 'PAYMENT_FAILED') {
        setNativeRazorpayState((prev) => ({ ...prev, isOpen: false }));
        setIsProcessing(false);
        const err = data.payload?.error || {};
        console.log('[Razorpay Payment Failed Diagnostic]:', {
          code: err.code || 'N/A',
          description: err.description || 'N/A',
          source: err.source || 'N/A',
          step: err.step || 'N/A',
          reason: err.reason || 'N/A',
          payment_id: err.metadata?.payment_id || 'N/A',
          order_id: err.metadata?.order_id || 'N/A',
        });
        const errorDesc = err.description || err.reason || 'Payment could not be completed. Please try another payment method.';
        setTimeout(() => {
          alert(`Payment Status: ${errorDesc}`);
        }, 100);
      } else if (data.type === 'GATEWAY_ERROR') {
        console.warn('Razorpay Gateway Error:', data.payload?.message);
      }
    } catch (e) {
      console.error('Error handling Native Razorpay message:', e);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      alert('Authentication Required: Please log in to your account to place an order.');
      router.push('/(auth)/login' as any);
      return;
    }

    // Enforce Minimum Order Quantity per product
    const invalidItem = checkoutItems.find((item: any) => {
      const minReq = Math.max(1, item.product?.minOrderQuantity || 1);
      return item.quantity < minReq;
    });

    if (invalidItem) {
      const minReq = Math.max(1, invalidItem.product?.minOrderQuantity || 1);
      alert(
        `Quantity Error: "${invalidItem.product?.title || 'Product'}" requires a minimum order quantity of ${minReq} units. Please adjust your cart.`
      );
      return;
    }

    setIsProcessing(true);

    const activeAddress = (dbAddresses && dbAddresses.length > 0 && currentAddress?.id)
      ? currentAddress
      : {
          id: `addr_${Date.now()}`,
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          phone: user?.phone || '',
          streetLine1: 'Main Street, Sector 4',
          streetLine2: '',
          city: 'Chennai',
          state: currentAddress?.state || 'Tamil Nadu',
          postalCode: '600001',
        };

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randNum = Math.floor(100000 + Math.random() * 900000);
    const prebuiltOrderNum = `CGP${dateStr}${randNum}`;
    const prebuiltPtsEarned = Math.round(grandTotal * 0.05);

    // 1. CASH ON DELIVERY (COD) ORDER PLACEMENT
    if (paymentMethod === 'cod') {
      try {
        const apiBase = getApiBaseUrl();
        const baseUrl = apiBase.replace(/\/$/, '').replace(/\/verify-payment$/, '').replace(/\/create-order$/, '');

        await fetch(`${baseUrl}/verify-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: `cod_${Date.now()}`,
            razorpay_payment_id: `cod_pay_${Date.now()}`,
            razorpay_signature: 'cod_verified',
            userId: user?.id,
            loyaltyPointsRedeemed: loyaltyRedemption,
            grandTotal,
            subtotal,
            discountAmount: couponDiscount + loyaltyRedemption,
            deliveryCharge,
            deliveryState: activeAddress.state || 'Tamil Nadu',
            cartItems: checkoutItems,
            shippingAddress: activeAddress,
            paymentMethod: 'cod',
          }),
        });
      } catch (codErr) {
        console.error('COD placement error:', codErr);
      }

      clearCart();
      setIsProcessing(false);
      queryClient.invalidateQueries();

      router.replace({
        pathname: '/order-success',
        params: {
          orderNumber: prebuiltOrderNum,
          pointsEarned: String(prebuiltPtsEarned),
          deliveryState: activeAddress.state || 'Tamil Nadu',
          totalProducts: String(totalProducts),
          deliveryCharge: String(deliveryCharge),
        },
      } as any);
      return;
    }

    // 2. RAZORPAY ONLINE PAYMENT
    try {
      const apiBase = getApiBaseUrl();
      const baseUrl = apiBase.replace(/\/$/, '').replace(/\/verify-payment$/, '').replace(/\/create-order$/, '');

      let orderData: any = null;
      let createOrderErrorMsg = '';

      console.log('[Create-Order Request Status]: Initiating backend order creation for grandTotal (INR):', grandTotal, 'currency: INR');

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);
        const createOrderRes = await fetch(`${baseUrl}/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            amount: grandTotal,
            currency: 'INR',
            cartItems: checkoutItems,
            couponCode: coupon?.code,
            loyaltyPointsRedeemed: loyaltyRedemption,
            deliveryState: activeAddress.state || 'Tamil Nadu',
            userId: user?.id,
          }),
        });
        clearTimeout(timeoutId);

        console.log('[Create-Order Response Status]:', createOrderRes.status, 'statusText:', createOrderRes.statusText);

        if (createOrderRes.ok) {
          orderData = await createOrderRes.json();
          console.log('[Create-Order Response Payload Summary]:', {
            order_id: orderData?.order_id || orderData?.providerOrderId,
            amount_paise: orderData?.amount,
            currency: orderData?.currency,
            key_id_prefix: (orderData?.key_id || '').substring(0, 8) + '...',
          });
        } else {
          const errJson = await createOrderRes.json().catch(() => ({}));
          createOrderErrorMsg = errJson.error || `Server returned status ${createOrderRes.status}`;
          console.warn('[Create-Order Failure]:', createOrderErrorMsg);
        }
      } catch (e: any) {
        console.warn('Backend create-order fetch error or timeout:', e);
        createOrderErrorMsg = e.name === 'AbortError'
          ? 'Connection timed out connecting to payment server.'
          : (e.message || 'Unable to reach payment server. Please check your internet connection.');
      }

      // If backend order creation failed, alert user with exact reason and STOP.
      // Never proceed with fake dummy order IDs on mobile.
      const realRazorpayOrderId = orderData?.order_id || orderData?.providerOrderId;
      if (!realRazorpayOrderId) {
        alert(`Payment Initialization Failed: ${createOrderErrorMsg || 'Could not generate Razorpay Order ID. Please check network connection.'}`);
        setIsProcessing(false);
        return;
      }

      const keyId = orderData.key_id || process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TkZfAnqVc2W9Cu';
      
      // Build clean Razorpay prefill data without dummy numbers or placeholder emails
      const prefillData: Record<string, string> = {};
      const custFullName = `${activeAddress.firstName || (activeAddress as any).name || user?.firstName || ''} ${activeAddress.lastName || user?.lastName || ''}`.trim();
      if (custFullName) {
        prefillData.name = custFullName;
      }

      // Extract phone number from activeAddress or fallback to authenticated user phone
      const rawPhone = (activeAddress.phone || user?.phone || '').toString();
      // Remove all non-digits (handles '+91', spaces, hyphens, brackets)
      const cleanDigits = rawPhone.replace(/\D/g, '');
      // Extract the final 10 digits for Indian mobile numbers
      const tenDigitContact = cleanDigits.length >= 10 ? cleanDigits.slice(-10) : '';
      if (/^[6-9]\d{9}$/.test(tenDigitContact)) {
        prefillData.contact = tenDigitContact;
      }

      // Ensure valid user email is passed as prefill.email
      const candidateEmail = (user?.email || (activeAddress as any).email || '').toString().trim();
      if (candidateEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidateEmail)) {
        prefillData.email = candidateEmail;
      }

      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randNum = Math.floor(100000 + Math.random() * 900000);
      const prebuiltOrderNum = `CGP${dateStr}${randNum}`;
      const prebuiltPtsEarned = Math.round(grandTotal * 0.05);

      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const isLoaded = await loadRazorpayScript();

        if (isLoaded && (window as any).Razorpay) {
          const options: any = {
            key: keyId,
            order_id: realRazorpayOrderId,
            amount: orderData?.amount || Math.max(100, Math.round(grandTotal * 100)),
            currency: orderData?.currency || 'INR',
            name: 'CINMAX Global Products',
            description: 'Artisanal Botanicals Order',
            handler: function (response: any) {
              const razorpay_order_id = response.razorpay_order_id;
              const razorpay_payment_id = response.razorpay_payment_id;
              const razorpay_signature = response.razorpay_signature;

              setCelebrationData({
                isOpen: true,
                orderNumber: prebuiltOrderNum,
                paymentId: razorpay_payment_id || '',
                pointsEarned: prebuiltPtsEarned,
              });

              clearCart();
              setIsProcessing(false);
              setIsVerifyingPayment(false);

              (async () => {
                try {
                  const controller = new AbortController();
                  const timeoutId = setTimeout(() => controller.abort(), 10000);
                  const verifyRes = await fetch(`${baseUrl}/verify-payment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    signal: controller.signal,
                    body: JSON.stringify({
                      razorpay_order_id,
                      razorpay_payment_id,
                      razorpay_signature,
                      userId: user?.id,
                      loyaltyPointsRedeemed: loyaltyRedemption,
                      grandTotal,
                      subtotal,
                      discountAmount: couponDiscount + loyaltyRedemption,
                      deliveryCharge,
                      deliveryState: activeAddress.state || 'Tamil Nadu',
                      cartItems: checkoutItems,
                      shippingAddress: activeAddress,
                    }),
                  });
                  clearTimeout(timeoutId);

                  const verifyData = await verifyRes.json();
                  if (verifyData.success) {
                    if (verifyData.orderNumber) {
                      setCelebrationData((prev) => ({
                        ...prev,
                        orderNumber: verifyData.orderNumber,
                        pointsEarned: verifyData.pointsEarned || prev.pointsEarned,
                      }));
                    }
                    queryClient.invalidateQueries();
                  }
                } catch (err: any) {
                  console.error('Background payment verification error:', err);
                }
              })();
            },
            modal: {
              ondismiss: function () {
                setCelebrationData({ isOpen: false, orderNumber: '', paymentId: '', pointsEarned: 0 });
                setIsProcessing(false);
                setIsVerifyingPayment(false);
              },
            },
            prefill: prefillData,
            theme: { color: '#002754' },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
          return;
        }
      } else {
        // Native (Android / iOS / Expo Go) Razorpay WebView Modal
        const razorpayOptions = {
          key: keyId,
          order_id: realRazorpayOrderId,
          amount: orderData?.amount || Math.max(100, Math.round(grandTotal * 100)),
          currency: orderData?.currency || 'INR',
          name: 'CINMAX Global Products',
          description: 'Artisanal Botanicals Order',
          prefill: prefillData,
          theme: { color: '#002754' },
          retry: {
            enabled: true,
            max_count: 4,
          },
        };

        console.log('[Razorpay Checkout Options]:', {
          key_id_prefix: (keyId || '').substring(0, 8) + '...',
          order_id: realRazorpayOrderId,
          amount_paise: razorpayOptions.amount,
          currency: razorpayOptions.currency,
          prefill_name_set: Boolean(prefillData.name),
          prefill_contact_set: Boolean(prefillData.contact),
          prefill_email_set: Boolean(prefillData.email),
        });

        const razorpayHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <style>
              * { box-sizing: border-box; }
              body {
                background-color: #040c18;
                margin: 0;
                padding: 24px 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                color: #ffffff;
                text-align: center;
              }
              .spinner {
                border: 4px solid rgba(197, 168, 128, 0.2);
                border-top-color: #C5A880;
                border-radius: 50%;
                width: 48px;
                height: 48px;
                animation: spin 0.8s linear infinite;
                margin-bottom: 20px;
              }
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
              .status-text {
                font-size: 15px;
                font-weight: 600;
                color: #C5A880;
                letter-spacing: 0.5px;
                margin-bottom: 8px;
              }
              .sub-text {
                font-size: 13px;
                color: #94A3B8;
              }
              .error-card {
                display: none;
                background: #1E293B;
                border: 1px solid #EF4444;
                border-radius: 12px;
                padding: 24px 20px;
                max-width: 320px;
                width: 100%;
              }
              .error-title {
                color: #F87171;
                font-size: 16px;
                font-weight: 700;
                margin-bottom: 8px;
              }
              .error-desc {
                color: #CBD5E1;
                font-size: 13px;
                margin-bottom: 16px;
                line-height: 1.4;
              }
              .btn-retry {
                background-color: #002754;
                color: #FFFFFF;
                border: 1px solid #C5A880;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 14px;
                cursor: pointer;
              }
            </style>
          </head>
          <body>
            <div id="loading-container">
              <div class="spinner"></div>
              <div class="status-text">Connecting to CINMAX Razorpay Gateway...</div>
              <div class="sub-text">Please do not refresh or press back</div>
            </div>

            <div id="error-card" class="error-card">
              <div class="error-title">Payment Gateway Error</div>
              <div id="error-desc" class="error-desc">Unable to load Razorpay checkout SDK. Please check your internet connection.</div>
              <button class="btn-retry" onclick="initRazorpay()">Try Again</button>
            </div>

            <script>
              var razorpayOptions = ${JSON.stringify(razorpayOptions)};
              var rzpInstance = null;

              window.onerror = function(msg, url, line, col, err) {
                postToRN({
                  type: 'GATEWAY_ERROR',
                  payload: {
                    message: typeof msg === 'string' ? msg : 'Payment Gateway Script Error',
                    line: line || 0,
                    col: col || 0
                  }
                });
                return false;
              };

              function postToRN(msg) {
                try {
                  if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                    window.ReactNativeWebView.postMessage(JSON.stringify(msg));
                  }
                } catch (e) {
                  console.error('Error posting message to React Native:', e);
                }
              }

              function showError(message) {
                document.getElementById('loading-container').style.display = 'none';
                var errCard = document.getElementById('error-card');
                document.getElementById('error-desc').innerText = message || 'Failed to initialize payment gateway.';
                errCard.style.display = 'block';
              }

              var isPaymentHandled = false;

              function openCheckout() {
                try {
                  if (typeof Razorpay === 'undefined') {
                    showError('Razorpay Checkout SDK was not found.');
                    return;
                  }

                  razorpayOptions.handler = function(response) {
                    if (isPaymentHandled) return;
                    isPaymentHandled = true;
                    postToRN({
                      type: 'PAYMENT_SUCCESS',
                      payload: {
                        razorpay_order_id: response.razorpay_order_id || '',
                        razorpay_payment_id: response.razorpay_payment_id || '',
                        razorpay_signature: response.razorpay_signature || ''
                      }
                    });
                  };

                  razorpayOptions.modal = {
                    backdropclose: false,
                    escape: false,
                    handleback: true,
                    confirm_close: true,
                    ondismiss: function() {
                      if (!isPaymentHandled) {
                        postToRN({ type: 'PAYMENT_CANCELLED' });
                      }
                    }
                  };

                  rzpInstance = new Razorpay(razorpayOptions);

                  rzpInstance.on('payment.failed', function(resp) {
                    if (isPaymentHandled) return;
                    var errObj = (resp && resp.error) || {};
                    var metaObj = (errObj && errObj.metadata) || {};
                    postToRN({
                      type: 'PAYMENT_FAILED',
                      payload: {
                        error: {
                          code: errObj.code || 'BAD_REQUEST_ERROR',
                          description: errObj.description || 'Payment was declined or failed at gateway.',
                          source: errObj.source || 'gateway',
                          step: errObj.step || 'payment_authorization',
                          reason: errObj.reason || 'payment_failed',
                          metadata: {
                            payment_id: metaObj.payment_id || '',
                            order_id: metaObj.order_id || ''
                          }
                        }
                      }
                    });
                  });

                  rzpInstance.open();
                } catch (err) {
                  showError('Razorpay Error: ' + (err.message || 'Initialization failed'));
                }
              }

              function initRazorpay() {
                document.getElementById('error-card').style.display = 'none';
                document.getElementById('loading-container').style.display = 'flex';

                if (typeof Razorpay !== 'undefined') {
                  openCheckout();
                  return;
                }

                var script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.async = true;

                var loadTimeout = setTimeout(function() {
                  if (typeof Razorpay === 'undefined') {
                    showError('Connection timeout loading Razorpay Gateway script. Please check your internet.');
                  }
                }, 15000);

                script.onload = function() {
                  clearTimeout(loadTimeout);
                  openCheckout();
                };

                script.onerror = function() {
                  clearTimeout(loadTimeout);
                  showError('Failed to load Razorpay SDK from server. Please check internet access.');
                };

                document.head.appendChild(script);
              }

              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initRazorpay);
              } else {
                initRazorpay();
              }
            </script>
          </body>
          </html>
        `;

        setNativeRazorpayState({
          isOpen: true,
          html: razorpayHtml,
          prebuiltOrderNum,
          prebuiltPtsEarned,
        });
        return;
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert(err.message || 'Payment initiation failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF7F2' }}>
      {/* GRAND PAYMENT SUCCESS EXPERIENCE MODAL (Instant In-Place Trigger with Party Poppers + Confetti) */}
      <Modal visible={celebrationData.isOpen} animationType="fade" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(4,12,24,0.92)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          {/* Party Poppers Floating Particle Confetti */}
          <MobileConfettiCannon isVisible={celebrationData.isOpen} />

          <View style={{ backgroundColor: '#0A192F', borderRadius: 32, padding: 24, width: '100%', maxWidth: 360, alignItems: 'center', borderWidth: 2, borderColor: '#C5A880', shadowColor: '#002754', shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.5, shadowRadius: 24, overflow: 'hidden', zIndex: 100000 }}>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, backgroundColor: '#C5A880' }} />
            
            {/* Corner Party Popper Cannon Badges */}
            <View style={{ position: 'absolute', top: 12, left: 14, flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              <PartyPopper size={16} color="#C5A880" />
            </View>
            <View style={{ position: 'absolute', top: 12, right: 14, flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              <PartyPopper size={16} color="#C5A880" />
            </View>

            <View style={{ width: 76, height: 76, borderRadius: 38, backgroundColor: '#002754', justifyContent: 'center', alignItems: 'center', marginTop: 12, marginBottom: 16, borderWidth: 2, borderColor: '#C5A880' }}>
              <CheckCircle2 size={40} color="#C5A880" />
            </View>

            <View style={{ backgroundColor: '#002754', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(197,168,128,0.4)', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <PartyPopper size={12} color="#C5A880" />
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#C5A880', fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase' }}>
                ORDER CONFIRMED
              </Text>
              <PartyPopper size={12} color="#C5A880" />
            </View>

            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, color: '#FFFFFF', textAlign: 'center', marginBottom: 4, fontWeight: '700' }}>
              Thank You for Choosing CINMAX
            </Text>

            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#E2E8F0', textAlign: 'center', marginBottom: 4 }}>
              Your order has been placed successfully.
            </Text>

            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 12, color: '#C5A880', fontStyle: 'italic', textAlign: 'center', marginBottom: 16 }}>
              Your CINMAX journey continues...
            </Text>

            {celebrationData.pointsEarned > 0 && (
              <View style={{ backgroundColor: '#002754', borderRadius: 16, padding: 14, width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderWidth: 1, borderColor: 'rgba(197,168,128,0.4)' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#C5A880', justifyContent: 'center', alignItems: 'center' }}>
                    <Sparkles size={18} color="#002754" />
                  </View>
                  <View>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: '#C5A880', textTransform: 'uppercase' }}>
                      Loyalty Reward Credited
                    </Text>
                    <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 10, color: '#CBD5E1' }}>
                      1 Point = ₹1 discount
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 18, color: '#4ADE80', fontWeight: '800' }}>+{celebrationData.pointsEarned}</Text>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 9, color: '#C5A880', textTransform: 'uppercase', letterSpacing: 0.8 }}>PTS EARNED</Text>
                </View>
              </View>
            )}

            <View style={{ backgroundColor: 'rgba(197,168,128,0.15)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginBottom: 4, borderWidth: 1, borderColor: 'rgba(197,168,128,0.3)' }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: '#C5A880' }}>
                Order Ref: #{celebrationData.orderNumber}
              </Text>
            </View>

            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 9, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 18, marginTop: 4 }}>
              KEEP PURCHASING WITH CINMAX
            </Text>

            <View style={{ gap: 10, width: '100%' }}>
              <TouchableOpacity
                onPress={() => { setCelebrationData((prev) => ({ ...prev, isOpen: false })); router.push('/(tabs)/orders' as any); }}
                activeOpacity={0.85}
                style={{ backgroundColor: '#C5A880', paddingVertical: 14, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
              >
                <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#002754', fontSize: 13, fontWeight: '700' }}>View Order</Text>
                <ArrowRight size={16} color="#002754" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => { setCelebrationData((prev) => ({ ...prev, isOpen: false })); router.push('/(tabs)/shop' as any); }}
                activeOpacity={0.85}
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', paddingVertical: 14, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}
              >
                <ShoppingBag size={16} color="#C5A880" />
                <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>Keep Shopping</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* 1. Sticky Header */}
      <View style={{ paddingHorizontal: CONTAINER_PADDING, paddingTop: 14, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(250, 247, 242, 0.95)', borderBottomWidth: 1, borderBottomColor: 'rgba(195, 198, 209, 0.3)', zIndex: 100, elevation: 10 }}>
        <TouchableOpacity
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)' as any))}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={{ width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
        >
          <ChevronLeft size={22} color="#002754" />
        </TouchableOpacity>
        <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: '#002754', letterSpacing: -0.5 }}>
          Checkout
        </Text>
        <View style={{ padding: 4 }}>
          <Lock size={20} color="#C5A880" />
        </View>
      </View>

      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 + insets.bottom }} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">

        {/* 2. Checkout Progress Stepper */}
        <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            <View style={{ position: 'absolute', top: 16, left: 20, right: 20, height: 2, backgroundColor: '#E0E3E5', zIndex: 0 }} />
            {['Address', 'Delivery', 'Payment', 'Review'].map((label, idx) => {
              const stepNum = idx + 1;
              const isActive = activeStep === stepNum;
              const isCompleted = activeStep > stepNum;
              return (
                <TouchableOpacity
                  key={label}
                  onPress={() => setActiveStep(stepNum)}
                  style={{ alignItems: 'center', zIndex: 1, backgroundColor: '#FAF7F2', paddingHorizontal: 6 }}
                >
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: isActive ? '#002754' : isCompleted ? '#059669' : '#E0E3E5',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    {isCompleted ? (
                      <Check size={16} color="white" />
                    ) : (
                      <Text style={{ fontFamily: FONT_SANS_BOLD, color: isActive ? 'white' : '#434750', fontSize: 13 }}>{stepNum}</Text>
                    )}
                  </View>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, color: isActive ? '#002754' : isCompleted ? '#059669' : '#434750', textTransform: 'uppercase', marginTop: 4 }}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {!user && (
          <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 18, backgroundColor: '#FFFBEB', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#F59E0B', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#B45309', fontWeight: '700' }}>🔑 Account Login Required</Text>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#B45309', marginTop: 2 }}>
                Please log in to your CINMAX account to complete your purchase and save order history.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login' as any)}
              style={{ backgroundColor: '#002754', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 }}
            >
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 12, fontWeight: '700' }}>Log In</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 1: DELIVERY ADDRESS */}
        {activeStep === 1 && (
          <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, fontWeight: '700', color: '#002754' }}>
                Delivery Address
              </Text>
              <TouchableOpacity
                onPress={() => { setIsAddingNewAddress(false); setIsManageAddressModalOpen(true); }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#EBF3FF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 }}
              >
                <Edit3 size={13} color="#002754" />
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: '#002754', textTransform: 'uppercase', fontWeight: '700' }}>
                  Change / Add
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, flexDirection: 'row', gap: 14, alignItems: 'flex-start', borderLeftWidth: 4, borderLeftColor: '#002754', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.05, shadowRadius: 12, borderWidth: 1, borderColor: '#002754' }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(180, 205, 254, 0.35)', justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
                <MapPin size={20} color="#002754" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 16, fontWeight: '700', color: '#191C1E' }}>
                    {currentAddress.firstName || (currentAddress as any).name || user?.firstName || 'Valued Customer'}{' '}
                    {currentAddress.lastName || user?.lastName || ''}
                  </Text>
                  <View style={{ backgroundColor: '#EBF3FF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#002754', fontSize: 9, fontWeight: '700', textTransform: 'uppercase' }}>
                      {dbAddresses.length > 0 ? 'SELECTED' : 'NO ADDRESS'}
                    </Text>
                  </View>
                </View>
                {dbAddresses.length > 0 ? (
                  <>
                    <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', lineHeight: 19, marginBottom: 6 }}>
                      {currentAddress.streetLine1 || (currentAddress as any).addressLine1 || ''}{(currentAddress.streetLine2 || (currentAddress as any).addressLine2) ? `, ${currentAddress.streetLine2 || (currentAddress as any).addressLine2}` : ''}{', '}
                      {currentAddress.city || ''}, {currentAddress.state} - {currentAddress.postalCode || (currentAddress as any).pincode || ''}
                    </Text>
                    <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 13, color: '#002754' }}>
                      Phone: {currentAddress.phone}
                    </Text>
                  </>
                ) : (
                  <TouchableOpacity
                    onPress={() => { setIsAddingNewAddress(true); setIsManageAddressModalOpen(true); }}
                    style={{ backgroundColor: '#EBF3FF', borderRadius: 10, padding: 10, alignItems: 'center', marginTop: 6 }}
                  >
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, color: '#002754' }}>+ Add Delivery Address</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

          </View>
        )}

        {/* STEP 2: DELIVERY TARIFF */}
        {activeStep === 2 && (
          <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 24 }}>
            {/* Address Summary */}
            <View style={{ backgroundColor: '#F0F5FF', borderRadius: 16, padding: 14, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0, 39, 84, 0.2)' }}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#002754', textTransform: 'uppercase' }}>Deliver To:</Text>
                <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#434750', marginTop: 2 }} numberOfLines={1}>
                  {currentAddress.firstName || user?.firstName} — {currentAddress.city}, {currentAddress.state} ({currentAddress.postalCode || (currentAddress as any).pincode})
                </Text>
              </View>
              <TouchableOpacity onPress={() => setActiveStep(1)} style={{ backgroundColor: '#FFFFFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#002754' }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, color: '#002754' }}>Edit</Text>
              </TouchableOpacity>
            </View>

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
                  {deliveryCalc.isFreeDelivery ? 'Free Shipping Qualified' : 'Standard Tariff Applies'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* STEP 3: PAYMENT & OFFERS */}
        {activeStep === 3 && (
          <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 24, gap: 20 }}>
            {/* Payment Method */}
            <View>
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, fontWeight: '700', color: '#002754', marginBottom: 12 }}>
                Payment Method
              </Text>

              {/* 1. Razorpay Option */}
              <TouchableOpacity
                onPress={() => setPaymentMethod('razorpay')}
                activeOpacity={0.8}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 20,
                  padding: 16,
                  borderWidth: 2,
                  borderColor: paymentMethod === 'razorpay' ? '#002754' : 'rgba(195, 198, 209, 0.4)',
                  shadowColor: '#0A3D78',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.04,
                  shadowRadius: 10,
                  marginBottom: 12,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: '#EBF3FF', justifyContent: 'center', alignItems: 'center' }}>
                      <ShieldCheck size={24} color="#002754" />
                    </View>
                    <View>
                      <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 15, fontWeight: '700', color: '#191C1E' }}>Razorpay Online Gateway</Text>
                      <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#434750', marginTop: 2 }}>UPI, Cards, Netbanking &amp; Wallets</Text>
                    </View>
                  </View>
                  <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#002754', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#002754' }} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Applied Coupon */}
            {coupon && (
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Tag size={18} color="#002754" />
                  <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, fontWeight: '700', color: '#002754' }}>Coupon Applied</Text>
                </View>
                <View style={{ backgroundColor: '#F0FFF4', borderRadius: 20, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1.5, borderColor: '#059669' }}>
                  <View>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 15, color: '#059669', fontWeight: '700' }}>
                      🎉 {coupon.code}
                    </Text>
                    <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#059669', marginTop: 2 }}>
                      You save ₹{couponDiscount} on this order
                    </Text>
                  </View>
                  <TouchableOpacity onPress={removeCoupon} style={{ padding: 6 }}>
                    <X size={18} color="#BA1A1A" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Loyalty Points */}
            {user && availableLoyaltyPoints > 0 && (
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Gift size={18} color="#C5A880" />
                  <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, fontWeight: '700', color: '#002754' }}>Loyalty Points</Text>
                </View>
                <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: 'rgba(197, 168, 128, 0.4)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <View>
                      <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#002754', fontWeight: '700' }}>
                        🏆 {availableLoyaltyPoints} Points Available
                      </Text>
                      <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#737781', marginTop: 2 }}>
                        1 point = ₹1 • Tier: {user.loyaltyTier || 'bronze'}
                      </Text>
                    </View>
                    <View style={{ backgroundColor: '#C5A880', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                      <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 11, textTransform: 'uppercase' }}>
                        {user.loyaltyTier || 'Bronze'}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => setRedeemLoyalty(!redeemLoyalty)}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: redeemLoyalty ? '#F0FFF4' : '#F7F9FB', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: redeemLoyalty ? '#059669' : '#C3C6D1' }}
                  >
                    <View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: redeemLoyalty ? '#059669' : '#737781', backgroundColor: redeemLoyalty ? '#059669' : 'transparent', justifyContent: 'center', alignItems: 'center' }}>
                      {redeemLoyalty && <Check size={14} color="white" />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: redeemLoyalty ? '#059669' : '#002754', fontWeight: '700' }}>
                        {redeemLoyalty
                          ? `Redeeming ${loyaltyRedemption} points → Save ₹${loyaltyRedemption}`
                          : `Use up to ${Math.min(availableLoyaltyPoints, maxLoyaltyRedemption)} points → Save ₹${Math.min(availableLoyaltyPoints, maxLoyaltyRedemption)}`}
                      </Text>
                      <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#737781', marginTop: 2 }}>
                        Max 20% of order value can be redeemed
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* STEP 4: REVIEW & PLACE ORDER */}
        {activeStep === 4 && (
          <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 24, gap: 20 }}>
            {/* Address & Delivery Quick Overview */}
            <View style={{ backgroundColor: '#F0F5FF', borderRadius: 16, padding: 14, gap: 8, borderWidth: 1, borderColor: 'rgba(0, 39, 84, 0.2)' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#002754', textTransform: 'uppercase' }}>Delivery Location:</Text>
                <TouchableOpacity onPress={() => setActiveStep(1)}>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: '#C5A880' }}>Change</Text>
                </TouchableOpacity>
              </View>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#434750' }}>
                {currentAddress.firstName || user?.firstName} {currentAddress.lastName || user?.lastName} — {currentAddress.streetLine1 || (currentAddress as any).addressLine1}, {currentAddress.city}, {currentAddress.state} - {currentAddress.postalCode || (currentAddress as any).pincode}
              </Text>
            </View>

            {/* Order Summary */}
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.2)' }}>
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, fontWeight: '700', color: '#002754', marginBottom: 14 }}>
                Order Summary
              </Text>
              <View style={{ gap: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#434750' }}>Subtotal ({totalProducts} units)</Text>
                  <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 14, color: '#191C1E' }}>₹{subtotal}</Text>
                </View>

                {couponDiscount > 0 && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#059669' }}>Coupon ({coupon?.code})</Text>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#059669' }}>-₹{couponDiscount}</Text>
                  </View>
                )}

                {loyaltyRedemption > 0 && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#C5A880' }}>Loyalty Points (₹{loyaltyRedemption})</Text>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#C5A880' }}>-₹{loyaltyRedemption}</Text>
                  </View>
                )}

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#434750' }}>Delivery ({deliveryCalc.state})</Text>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: deliveryCalc.isFreeDelivery ? '#059669' : '#002754' }}>
                    {deliveryCalc.isFreeDelivery ? 'FREE' : `₹${deliveryCharge}`}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#64748B' }}>GST (18% Included)</Text>
                  <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#64748B' }}>₹{includedGst}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750' }}>Dispatch Time</Text>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, color: '#002754' }}>Within {dispatchTimeDays} days</Text>
                </View>

                <View style={{ borderTopWidth: 1, borderTopColor: '#E0E3E5', paddingTop: 12, marginTop: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, fontWeight: '700', color: '#002754' }}>Grand Total</Text>
                  <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: '#002754' }}>₹{grandTotal}</Text>
                </View>
              </View>
            </View>

            {/* Policy & Terms Acknowledgement */}
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.4)', gap: 8 }}>
              <TouchableOpacity
                onPress={() => setIsTermsAccepted(!isTermsAccepted)}
                activeOpacity={0.8}
                style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}
              >
                <View style={{ width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: isTermsAccepted ? '#002754' : '#737781', backgroundColor: isTermsAccepted ? '#002754' : 'transparent', justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
                  {isTermsAccepted && <Check size={14} color="white" />}
                </View>
                <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#434750', flex: 1, lineHeight: 17 }}>
                  By placing this order, you agree to CINMAX{' '}
                  <Text onPress={() => router.push('/terms' as any)} style={{ color: '#002754', textDecorationLine: 'underline', fontFamily: FONT_SANS_BOLD }}>
                    Terms &amp; Conditions
                  </Text>
                  ,{' '}
                  <Text onPress={() => router.push('/shipping' as any)} style={{ color: '#002754', textDecorationLine: 'underline', fontFamily: FONT_SANS_BOLD }}>
                    Shipping Policy
                  </Text>
                  , and{' '}
                  <Text onPress={() => router.push('/refund' as any)} style={{ color: '#002754', textDecorationLine: 'underline', fontFamily: FONT_SANS_BOLD }}>
                    No Return / No Refund Policy
                  </Text>
                  .
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>

      {/* Address Management Modal */}
      <Modal visible={isManageAddressModalOpen} animationType="slide" transparent>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '88%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 20, fontWeight: '700', color: '#002754' }}>
                {isAddingNewAddress ? 'Add New Address' : 'Delivery Addresses'}
              </Text>
              <TouchableOpacity
                onPress={() => { setIsManageAddressModalOpen(false); setIsAddingNewAddress(false); }}
                style={{ padding: 4 }}
              >
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
                    + Add New Address
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
                  <TextInput placeholder="e.g. Aanya Sharma" placeholderTextColor="#737781" selectionColor="#002754" cursorColor="#002754" underlineColorAndroid="transparent" value={newAddress.name} onChangeText={(text: string) => setNewAddress({ ...newAddress, name: text })} style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, padding: 12, fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#191C1E' }} />
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#191C1E', marginBottom: 4 }}>10 digit mobile number *</Text>
                  <TextInput placeholder="e.g. 9876543210" placeholderTextColor="#737781" selectionColor="#002754" cursorColor="#002754" underlineColorAndroid="transparent" keyboardType="phone-pad" maxLength={10} value={newAddress.phone} onChangeText={(text: string) => setNewAddress({ ...newAddress, phone: text })} style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, padding: 12, fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#191C1E' }} />
                </View>

                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#002754', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>2. Address &amp; Location Details</Text>
                <View style={{ marginBottom: 8 }}>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#191C1E', marginBottom: 4 }}>House / Flat / Door No. *</Text>
                  <TextInput placeholder="e.g. Flat 402, Royal Enclave" placeholderTextColor="#737781" selectionColor="#002754" cursorColor="#002754" underlineColorAndroid="transparent" value={newAddress.addressLine1} onChangeText={(text: string) => setNewAddress({ ...newAddress, addressLine1: text })} style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, padding: 12, fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#191C1E' }} />
                </View>
                <View style={{ marginBottom: 8 }}>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#191C1E', marginBottom: 4 }}>Street / Road / Area / Locality *</Text>
                  <TextInput placeholder="e.g. 2nd Main Road, T. Nagar" placeholderTextColor="#737781" selectionColor="#002754" cursorColor="#002754" underlineColorAndroid="transparent" value={newAddress.addressLine2} onChangeText={(text: string) => setNewAddress({ ...newAddress, addressLine2: text })} style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, padding: 12, fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#191C1E' }} />
                </View>
                
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#191C1E', marginBottom: 4 }}>Pincode *</Text>
                    <TextInput placeholder="e.g. 600017" placeholderTextColor="#737781" selectionColor="#002754" cursorColor="#002754" underlineColorAndroid="transparent" keyboardType="number-pad" maxLength={6} value={newAddress.pincode} onChangeText={(text: string) => setNewAddress({ ...newAddress, pincode: text })} style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, padding: 12, fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#191C1E' }} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#191C1E', marginBottom: 4 }}>City *</Text>
                    <TextInput placeholder="e.g. Chennai" placeholderTextColor="#737781" selectionColor="#002754" cursorColor="#002754" underlineColorAndroid="transparent" value={newAddress.city} onChangeText={(text: string) => setNewAddress({ ...newAddress, city: text })} style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, padding: 12, fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#191C1E' }} />
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
                  <TextInput placeholder="Nearby Landmark (e.g. Near City Hospital)" placeholderTextColor="#737781" selectionColor="#002754" cursorColor="#002754" underlineColorAndroid="transparent" value={(newAddress as any).landmark || ''} onChangeText={(text: string) => setNewAddress({ ...newAddress, [ 'landmark' as any]: text })} style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 12, padding: 12, fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: '#191C1E' }} />
                </View>

                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#002754', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Save Address As</Text>
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
                  {['Home', 'Work', 'Other'].map((tag) => {
                    const isSel = (newAddress.type || 'Home') === tag;
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
                    <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 14 }}>Save &amp; Select</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Native Razorpay Checkout Modal (Android / iOS / Expo Go) */}
      {Platform.OS !== 'web' && (
        <Modal
          visible={nativeRazorpayState.isOpen}
          animationType="slide"
          onRequestClose={() => {
            setNativeRazorpayState((prev) => ({ ...prev, isOpen: false }));
            setIsProcessing(false);
          }}
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: '#040C18' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#002754', borderBottomWidth: 1, borderBottomColor: '#C5A880' }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>
                CINMAX Secure Razorpay Payment
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <TouchableOpacity
                  onPress={() => {
                    handleNativeRazorpayMessage({
                      nativeEvent: {
                        data: JSON.stringify({
                          type: 'PAYMENT_SUCCESS',
                          payload: {
                            razorpay_order_id: nativeRazorpayState.prebuiltOrderNum,
                            razorpay_payment_id: `pay_sim_${Date.now()}`,
                            razorpay_signature: 'simulated_success',
                          },
                        }),
                      },
                    });
                  }}
                  style={{ backgroundColor: '#059669', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 }}
                >
                  <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#FFFFFF', fontSize: 11 }}>Simulate Success</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setNativeRazorpayState((prev) => ({ ...prev, isOpen: false }));
                    setIsProcessing(false);
                  }}
                  style={{ padding: 4 }}
                >
                  <X size={22} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
            {(process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || '').startsWith('rzp_test_') && (
              <View style={{ backgroundColor: 'rgba(197, 168, 128, 0.15)', paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(197, 168, 128, 0.3)' }}>
                <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, color: '#F3E5D8', fontSize: 11, textAlign: 'center', lineHeight: 16 }}>
                  Test Mode: Cards (4111 1111 1111 1111, OTP: 1234) • Netbanking (Any Bank → Success) • UPI (success@razorpay)
                </Text>
              </View>
            )}
            <WebView
              key={nativeRazorpayState.isOpen ? 'webview-open' : 'webview-closed'}
              originWhitelist={['*']}
              source={{ html: nativeRazorpayState.html, baseUrl: 'https://api.razorpay.com' }}
              onMessage={handleNativeRazorpayMessage}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              thirdPartyCookiesEnabled={true}
              sharedCookiesEnabled={true}
              javaScriptCanOpenWindowsAutomatically={true}
              setSupportMultipleWindows={false}
              allowsInlineMediaPlayback={true}
              mixedContentMode="always"
              cacheEnabled={true}
              onNavigationStateChange={(navState) => {
                const url = navState.url;
                if (!url) return;

                // Intercept Razorpay payment completion callback URLs with payment parameters
                if (url.includes('razorpay_payment_id') || url.includes('payment_id')) {
                  try {
                    const payMatch = url.match(/[?&](?:razorpay_)?payment_id=([^&]+)/);
                    const orderMatch = url.match(/[?&](?:razorpay_)?order_id=([^&]+)/);
                    const sigMatch = url.match(/[?&](?:razorpay_)?signature=([^&]+)/);

                    if (payMatch && payMatch[1]) {
                      handleNativeRazorpayMessage({
                        nativeEvent: {
                          data: JSON.stringify({
                            type: 'PAYMENT_SUCCESS',
                            payload: {
                              razorpay_order_id: orderMatch ? decodeURIComponent(orderMatch[1]) : nativeRazorpayState.prebuiltOrderNum,
                              razorpay_payment_id: decodeURIComponent(payMatch[1]),
                              razorpay_signature: sigMatch ? decodeURIComponent(sigMatch[1]) : '',
                            },
                          }),
                        },
                      });
                    }
                  } catch (navErr) {
                    console.warn('Navigation state payment callback parse error:', navErr);
                  }
                }
              }}
              onShouldStartLoadWithRequest={(request) => {
                const url = request.url;
                if (!url) return false;

                // 1. Allow standard web navigation for Razorpay, Bank Gateways (Canara Bank, SBI, HDFC, ICICI, etc.) and 3DS
                if (
                  url.startsWith('http://') ||
                  url.startsWith('https://') ||
                  url.startsWith('about:') ||
                  url.startsWith('data:') ||
                  url.startsWith('blob:') ||
                  url.startsWith('javascript:')
                ) {
                  return true;
                }

                // 2. Android UPI Intent Handling (intent://pay?...)
                if (url.startsWith('intent://')) {
                  try {
                    const schemeMatch = url.match(/scheme=([^;]+)/);
                    const scheme = schemeMatch ? schemeMatch[1] : 'upi';
                    const cleanUrl = url.replace(/^intent:\/\//, `${scheme}://`).replace(/#Intent;.*$/, '');
                    Linking.openURL(cleanUrl).catch(() => {
                      const upiFallback = url.replace(/^intent:\/\//, 'upi://').replace(/#Intent;.*$/, '');
                      Linking.openURL(upiFallback).catch((err) => {
                        console.warn('Failed to open UPI intent fallback:', err);
                      });
                    });
                  } catch (err) {
                    console.warn('Could not parse intent URL:', err);
                  }
                  return false;
                }

                // 3. Native App Schemes (UPI apps, Wallets)
                if (
                  url.startsWith('upi://') ||
                  url.startsWith('phonepe://') ||
                  url.startsWith('paytmmp://') ||
                  url.startsWith('tez://') ||
                  url.startsWith('gpay://') ||
                  url.startsWith('bhim://') ||
                  url.startsWith('credpay://') ||
                  url.startsWith('whatsapp://')
                ) {
                  Linking.openURL(url).catch((err) => {
                    console.warn('Failed to open external payment app:', err);
                  });
                  return false;
                }

                return true;
              }}
              onError={(e) => {
                console.warn('Razorpay WebView error:', e.nativeEvent);
                setNativeRazorpayState((prev) => ({ ...prev, isOpen: false }));
                setIsProcessing(false);
              }}
              onHttpError={(e) => {
                console.warn('Razorpay WebView HTTP error:', e.nativeEvent);
              }}
              style={{ flex: 1 }}
            />
          </SafeAreaView>
        </Modal>
      )}

      {/* 10. Sticky Bottom Action Bar */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: CONTAINER_PADDING, paddingTop: 14, paddingBottom: Math.max(14, insets.bottom), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(195, 198, 209, 0.3)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.08, shadowRadius: 20, zIndex: 100 }}>
        <View>
          <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, fontWeight: '700', color: '#737781', textTransform: 'uppercase', letterSpacing: 0.8 }}>Grand Total</Text>
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 24, fontWeight: '700', color: '#002754' }}>₹{grandTotal}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (activeStep < 4) {
              setActiveStep(activeStep + 1);
            } else {
              handlePlaceOrder();
            }
          }}
          disabled={activeStep === 4 && (isProcessing || !isTermsAccepted)}
          style={{ flex: 1, marginLeft: 20, backgroundColor: activeStep === 4 && (isProcessing || !isTermsAccepted) ? '#434750' : '#002754', paddingVertical: 14, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, shadowColor: '#002754', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 }}
        >
          <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>
            {activeStep === 1
              ? 'Continue to Delivery'
              : activeStep === 2
              ? 'Continue to Payment'
              : activeStep === 3
              ? 'Review Order'
              : isProcessing
              ? 'Processing...'
              : 'Pay with Razorpay'}
          </Text>
          <ArrowRight size={18} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
