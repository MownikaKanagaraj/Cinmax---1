'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { GrandPaymentSuccessModal } from '../../components/grand-payment-success-modal';
import { Container, PageHeader, Breadcrumb, Button, Input } from '@cinmax/ui';
import { useCartStore, useUser, useAddressesQuery } from '@cinmax/hooks';
import { formatCurrency, calculateDeliveryCharge } from '@cinmax/utils';
import { MapPin, Plus, Check } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotals, clearCart } = useCartStore();
  const { user } = useUser();

  const [paymentMethod, setPaymentMethod] = React.useState('razorpay');
  const [deliveryState, setDeliveryState] = React.useState('Tamil Nadu');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const [isVerifyingPayment, setIsVerifyingPayment] = React.useState(false);

  // Grand Thank You Celebration Popup State (Immediate In-Place Trigger)
  const [celebrationData, setCelebrationData] = React.useState<{
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

  // Address State
  const [savedAddresses, setSavedAddresses] = React.useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = React.useState<string | null>(null);
  const [isCustomAddressMode, setIsCustomAddressMode] = React.useState(false);
  const [customAddress, setCustomAddress] = React.useState({
    firstName: '',
    lastName: '',
    phone: '',
    streetLine1: '',
    streetLine2: '',
    city: '',
    state: 'Tamil Nadu',
    postalCode: '',
  });

  // Loyalty Points & Policy Acceptance State
  const [redeemLoyalty, setRedeemLoyalty] = React.useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = React.useState(true);

  const { data: addrs = [], isLoading: isAddrsLoading } = useAddressesQuery(user?.id, {
    enabled: Boolean(user?.id),
  });

  React.useEffect(() => {
    if (addrs && addrs.length > 0) {
      setSavedAddresses(addrs);
      const def = addrs.find((a: any) => a.isDefaultShipping || a.is_default_shipping) || addrs[0];
      setSelectedAddressId((prev) => prev || def.id);
      if (def.state) setDeliveryState(def.state);
      setIsCustomAddressMode(false);
    } else if (!isAddrsLoading && user?.id) {
      setIsCustomAddressMode(true);
    }
  }, [addrs, isAddrsLoading, user?.id]);

  const totals = getTotals();

  // Total Product Quantity
  const totalProducts = (items && items.length > 0)
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  // Delivery charge algorithm
  const deliveryCalc = calculateDeliveryCharge(deliveryState, totalProducts);
  const deliveryCharge = deliveryCalc.deliveryCharge;
  const subtotal = totals.subtotal;
  const couponDiscount = totals.discount;

  // Loyalty calculation (Cap at max 20% of net product price after coupon)
  const availablePoints = Math.max(0, Number(user?.loyaltyPoints) || 0);
  const afterCoupon = Math.max(0, subtotal - couponDiscount);
  const maxLoyaltyRedemption = Math.floor(afterCoupon * 0.20);
  const loyaltyPointsRedeemed = redeemLoyalty
    ? Math.min(availablePoints, maxLoyaltyRedemption)
    : 0;
  const loyaltyDiscount = loyaltyPointsRedeemed; // 1 Point = ₹1

  const netProductPrice = Math.max(0, afterCoupon - loyaltyDiscount);
  const includedGst = Math.round((netProductPrice * 18) / 118);
  const grandTotal = Math.max(0, netProductPrice + deliveryCharge);

  // Load Razorpay Standard Checkout Script
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if ((window as any).Razorpay) return resolve(true);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // STEP 2: FRONTEND - Razorpay Standard Web Checkout Handler
  const handleRazorpayCheckout = async () => {
    if (!user) {
      alert('Authentication Required: Please log in to your account to place an order.');
      router.push('/login');
      return;
    }

    if (!isTermsAccepted) {
      alert('Policy Error: You must accept CINMAX Terms & Conditions, Shipping Policy, and Return Policy to place an order.');
      return;
    }

    if (!deliveryState || deliveryState.trim() === '' || deliveryState === 'Unselected') {
      alert('Address Error: Please select a valid delivery state before proceeding to payment.');
      return;
    }

    // Build final shipping address
    const selectedAddrObj = savedAddresses.find((a) => a.id === selectedAddressId);
    const finalShippingAddress = selectedAddrObj
      ? {
          firstName: selectedAddrObj.firstName || selectedAddrObj.first_name || user?.firstName || 'Valued',
          lastName: selectedAddrObj.lastName || selectedAddrObj.last_name || user?.lastName || 'Customer',
          phone: selectedAddrObj.phone || user?.phone || '+919876543210',
          street: selectedAddrObj.streetLine1 || selectedAddrObj.street_line1 || 'Main Street',
          landmark: selectedAddrObj.streetLine2 || selectedAddrObj.street_line2 || '',
          city: selectedAddrObj.city || 'Chennai',
          state: selectedAddrObj.state || deliveryState,
          postalCode: selectedAddrObj.postalCode || selectedAddrObj.postal_code || '600001',
          country: 'India',
        }
      : {
          firstName: customAddress.firstName || user?.firstName || 'Valued',
          lastName: customAddress.lastName || user?.lastName || 'Customer',
          phone: customAddress.phone || user?.phone || '+919876543210',
          street: customAddress.streetLine1 || 'Main Street',
          landmark: customAddress.streetLine2 || '',
          city: customAddress.city || 'Chennai',
          state: deliveryState,
          postalCode: customAddress.postalCode || '600001',
          country: 'India',
        };

    try {
      setIsProcessing(true);

      // 1. Ensure checkout.js is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert('Failed to load Razorpay SDK. Please check your network connection.');
        setIsProcessing(false);
        return;
      }

      // 2. Call backend create-order endpoint (STEP 1 BACKEND)
      const createRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: grandTotal,
          currency: 'INR',
          cartItems: items,
          deliveryState,
          userId: user?.id,
          loyaltyPointsRedeemed,
          receipt: `rcpt_${Date.now()}`,
          notes: {
            deliveryState,
            totalProducts: totalProducts.toString(),
            loyaltyPointsRedeemed: loyaltyPointsRedeemed.toString(),
          },
        }),
      });

      const orderData = await createRes.json();

      if (!createRes.ok || !orderData.order_id) {
        alert(`Order Creation Error: ${orderData.error || 'Failed to initialize payment'}`);
        setIsProcessing(false);
        return;
      }

      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randNum = Math.floor(100000 + Math.random() * 900000);
      const prebuiltOrderNum = `CGP${dateStr}${randNum}`;
      const prebuiltPtsEarned = Math.round(grandTotal * 0.05);

      // 3. Configure Razorpay Standard Modal Options
      const options: any = {
        key: orderData?.key_id || orderData?.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TX6kmNNGbn83QI',
        order_id: orderData?.order_id || orderData?.providerOrderId,
        amount: orderData?.amount || Math.round(grandTotal * 100),
        currency: orderData?.currency || 'INR',
        name: 'CINMAX Global Products',
        description: 'Artisanal Botanicals Order',
        handler: function (response: any) {
          // 1. UPDATE CELEBRATION DATA WITH CONFIRMED PAYMENT ID
          setCelebrationData({
            isOpen: true,
            orderNumber: prebuiltOrderNum,
            paymentId: response.razorpay_payment_id || '',
            pointsEarned: prebuiltPtsEarned,
          });

          // 2. IMMEDIATELY CLEAR CART & RESET LOADERS
          clearCart();
          setIsProcessing(false);
          setIsVerifyingPayment(false);

          // 3. CONCURRENTLY VERIFY PAYMENT & RECORD ORDER IN SUPABASE IN BACKGROUND
          (async () => {
            try {
              const verifyRes = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  userId: user?.id,
                  grandTotal,
                  subtotal,
                  discountAmount: couponDiscount + loyaltyDiscount,
                  loyaltyPointsRedeemed,
                  deliveryCharge,
                  deliveryState,
                  cartItems: items,
                  shippingAddress: finalShippingAddress,
                }),
              });

              const verifyData = await verifyRes.json();

              if (verifyData.success && verifyData.orderNumber) {
                setCelebrationData((prev) => ({
                  ...prev,
                  orderNumber: verifyData.orderNumber,
                  pointsEarned: verifyData.pointsEarned || prev.pointsEarned,
                }));
              }
            } catch (err: any) {
              console.error('Background payment verification error:', err);
            }
          })();
        },
        modal: {
          ondismiss: function () {
            console.log('Razorpay modal dismissed by user');
            alert('Payment Cancelled: You closed the Razorpay checkout modal. No order was created.');
            setCelebrationData({ isOpen: false, orderNumber: '', paymentId: '', pointsEarned: 0 });
            setIsProcessing(false);
            setIsVerifyingPayment(false);
          },
        },
        prefill: {
          name: `${user?.firstName || 'Valued'} ${user?.lastName || 'Customer'}`,
          email: user?.email || 'patron@cinmax.com',
          contact: user?.phone || '9876543210',
        },
        theme: {
          color: '#002754',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        console.error('Razorpay Payment Failed:', resp.error);
        alert(`Payment Failed: ${resp.error?.description || 'Transaction declined'}`);
        setCelebrationData({ isOpen: false, orderNumber: '', paymentId: '', pointsEarned: 0 });
        setIsProcessing(false);
        setIsVerifyingPayment(false);
      });

      // PRE-MOUNT CELEBRATION MODAL BEHIND RAZORPAY SO WHEN RAZORPAY CLOSES, CUSTOMER SEES GRAND CELEBRATION INSTANTLY WITH 0MS FLASH
      setCelebrationData({
        isOpen: true,
        orderNumber: prebuiltOrderNum,
        paymentId: '',
        pointsEarned: prebuiltPtsEarned,
      });

      rzp.open();
    } catch (err: any) {
      console.error('Checkout Exception:', err);
      alert(`Payment Exception: ${err.message}`);
      setCelebrationData({ isOpen: false, orderNumber: '', paymentId: '', pointsEarned: 0 });
      setIsProcessing(false);
      setIsVerifyingPayment(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />

      {/* GRAND CINMAX THANK YOU POPUP (Triggered in-place instantly with party popper confetti) */}
      <GrandPaymentSuccessModal
        isOpen={celebrationData.isOpen}
        onClose={() => {
          setCelebrationData((prev) => ({ ...prev, isOpen: false }));
          setIsVerifyingPayment(false);
        }}
        orderNumber={celebrationData.orderNumber}
        pointsEarned={celebrationData.pointsEarned}
      />

      <main className="flex-1 py-10">
        <Container size="xl">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Shopping Bag', href: '/cart' },
              { label: 'Razorpay Checkout', isCurrent: true },
            ]}
          />

          <PageHeader
            badge="Encrypted 256-Bit SSL Checkout"
            title="Razorpay Standard Web Checkout"
            subtitle="Complete your shipping destination and pay securely via Razorpay Online Gateway."
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-6">
            {/* Checkout Multi-Step Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Step 1: Shipping Destination */}
              <div className="p-6 sm:p-8 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#002754] text-white flex items-center justify-center font-bold text-sm">
                      1
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#002754] dark:text-white">
                      Shipping Destination
                    </h3>
                  </div>
                  {savedAddresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsCustomAddressMode(!isCustomAddressMode)}
                      className="text-xs font-bold text-[#C5A880] hover:underline flex items-center gap-1"
                    >
                      {isCustomAddressMode ? 'Use Saved Address' : '+ New Address'}
                    </button>
                  )}
                </div>

                {/* Saved Address Cards */}
                {!isCustomAddressMode && savedAddresses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedAddresses.map((addr: any) => {
                      const isSelected = selectedAddressId === addr.id;
                      const fName = addr.firstName || addr.first_name || user?.firstName || 'Valued';
                      const lName = addr.lastName || addr.last_name || user?.lastName || 'Customer';
                      const street1 = addr.streetLine1 || addr.street_line1 || '';
                      const street2 = addr.streetLine2 || addr.street_line2 || '';
                      const city = addr.city || '';
                      const state = addr.state || 'Tamil Nadu';
                      const postal = addr.postalCode || addr.postal_code || '';

                      return (
                        <div
                          key={addr.id}
                          onClick={() => {
                            setSelectedAddressId(addr.id);
                            if (state) setDeliveryState(state);
                          }}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 relative ${
                            isSelected
                              ? 'border-[#002754] bg-[#002754]/5 dark:bg-[#002754]/20 shadow-md'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-[#002754] dark:text-[#C5A880]" />
                              <span className="font-bold text-xs text-[#002754] dark:text-white">
                                {fName} {lName}
                              </span>
                            </div>
                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-[#002754] text-white flex items-center justify-center">
                                <Check className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {street1} {street2 ? `, ${street2}` : ''}<br />
                            {city}, {state} - {postal}
                          </p>
                          <p className="text-[11px] font-semibold text-[#002754] dark:text-[#C5A880]">
                            State Tariff: {state}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Custom Address Inputs */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
                        First Name
                      </label>
                      <Input
                        value={customAddress.firstName || user?.firstName || ''}
                        onChange={(e) => setCustomAddress({ ...customAddress, firstName: e.target.value })}
                        placeholder="First Name"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
                        Last Name
                      </label>
                      <Input
                        value={customAddress.lastName || user?.lastName || ''}
                        onChange={(e) => setCustomAddress({ ...customAddress, lastName: e.target.value })}
                        placeholder="Last Name"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
                        Street Address
                      </label>
                      <Input
                        value={customAddress.streetLine1}
                        onChange={(e) => setCustomAddress({ ...customAddress, streetLine1: e.target.value })}
                        placeholder="Door No, Street Name, Area"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
                        City
                      </label>
                      <Input
                        value={customAddress.city}
                        onChange={(e) => setCustomAddress({ ...customAddress, city: e.target.value })}
                        placeholder="Chennai"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
                        State (Tariff Rule)
                      </label>
                      <select
                        value={deliveryState}
                        onChange={(e) => {
                          setDeliveryState(e.target.value);
                          setCustomAddress({ ...customAddress, state: e.target.value });
                        }}
                        className="w-full px-3.5 py-2.5 rounded-[12px] text-xs bg-[#F7F9FB] dark:bg-[#0A192F] border border-[#0A3D78]/20 font-bold"
                      >
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Puducherry">Puducherry</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Other States">Other States</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Loyalty Points Redemption */}
              <div className="p-6 sm:p-8 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#002754] text-white flex items-center justify-center font-bold text-sm">
                      2
                    </span>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#002754] dark:text-white">
                        Botanical Loyalty Rewards
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Redeem available points for instant store discounts (1 Pt = ₹1, Max 20% cap)
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-extrabold rounded-full">
                    {availablePoints} Pts Available
                  </span>
                </div>

                <div className="p-4 rounded-[16px] bg-[#F7F9FB] dark:bg-[#0A192F] border border-[#0A3D78]/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={redeemLoyalty}
                        disabled={availablePoints <= 0 || maxLoyaltyRedemption <= 0}
                        onChange={(e) => setRedeemLoyalty(e.target.checked)}
                        className="w-4 h-4 rounded text-[#002754] focus:ring-[#002754] cursor-pointer"
                      />
                      <span className="text-xs font-bold text-[#002754] dark:text-white">
                        Redeem Loyalty Points at Checkout
                      </span>
                    </label>
                    {redeemLoyalty && (
                      <span className="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                        -₹{loyaltyPointsRedeemed}
                      </span>
                    )}
                  </div>

                  {availablePoints > 0 ? (
                    <div className="text-[11px] text-muted-foreground flex justify-between pt-1 border-t border-[#0A3D78]/10">
                      <span>Max 20% Subtotal Cap: <strong>₹{maxLoyaltyRedemption}</strong></span>
                      <span>Redeeming: <strong>{loyaltyPointsRedeemed} points</strong></span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 italic">
                      You currently have 0 points. Place orders or leave approved reviews to earn points!
                    </p>
                  )}
                </div>
              </div>

              {/* Step 3: Payment Method (Razorpay Only) */}
              <div className="p-6 sm:p-8 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#002754] text-white flex items-center justify-center font-bold text-sm">
                    3
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#002754] dark:text-white">
                    Razorpay Online Payment Gateway
                  </h3>
                </div>

                <div className="p-5 rounded-[20px] border-2 border-[#002754] bg-[#002754]/5 flex items-center justify-between">
                  <div>
                    <p className="font-serif font-bold text-base text-[#002754] dark:text-white">
                      Razorpay Standard Checkout
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Pay via UPI, Credit/Debit Cards, Netbanking &amp; Wallets
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-[#002754] text-white font-bold text-xs rounded-full">
                    ONLINE ONLY
                  </span>
                </div>
              </div>
            </div>

            {/* Sidebar Summary & Razorpay Checkout Trigger */}
            <div className="space-y-6">
              <div className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-xl space-y-6">
                <h3 className="font-serif text-xl font-bold text-[#002754] dark:text-white">
                  Order Review
                </h3>

                <div className="space-y-3 text-sm border-t border-[#0A3D78]/10 pt-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({totalProducts} units)</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Coupon Discount</span>
                      <span>-{formatCurrency(couponDiscount)}</span>
                    </div>
                  )}
                  {loyaltyDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Loyalty Points ({loyaltyPointsRedeemed} pts)</span>
                      <span>-{formatCurrency(loyaltyDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery Charge ({deliveryCalc.state})</span>
                    <span className={deliveryCalc.isFreeDelivery ? 'font-bold text-emerald-600' : ''}>
                      {deliveryCalc.isFreeDelivery ? 'FREE' : formatCurrency(deliveryCharge)}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>GST (18% Included)</span>
                    <span>{formatCurrency(includedGst)}</span>
                  </div>
                  <div className="flex justify-between font-serif text-xl font-bold text-[#002754] dark:text-white pt-3 border-t border-[#0A3D78]/10">
                    <span>Grand Total</span>
                    <span>{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                {/* Policy Acknowledgement Disclaimer */}
                <div className="p-3.5 rounded-xl bg-[#F7F9FB] dark:bg-[#0A192F] border border-[#0A3D78]/15 text-[11px] text-muted-foreground leading-snug">
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="checkout-terms-checkbox"
                      checked={isTermsAccepted}
                      onChange={(e) => setIsTermsAccepted(e.target.checked)}
                      className="mt-0.5 rounded text-[#002754] focus:ring-[#002754] cursor-pointer"
                    />
                    <label htmlFor="checkout-terms-checkbox" className="cursor-pointer">
                      By placing this order, you agree to CINMAX{' '}
                      <Link href="/terms" target="_blank" className="underline text-[#002754] dark:text-[#C5A880] font-bold">
                        Terms &amp; Conditions
                      </Link>
                      ,{' '}
                      <Link href="/shipping" target="_blank" className="underline text-[#002754] dark:text-[#C5A880] font-bold">
                        Shipping Policy
                      </Link>
                      , and{' '}
                      <Link href="/refund" target="_blank" className="underline text-[#002754] dark:text-[#C5A880] font-bold">
                        No Return / No Refund Policy
                      </Link>
                      .
                    </label>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  disabled={isProcessing}
                  onClick={handleRazorpayCheckout}
                  className="w-full rounded-full text-base font-bold shadow-2xl py-4 bg-[#002754] hover:bg-[#001d3f] text-white"
                >
                  {isProcessing ? 'Initializing Razorpay...' : `Pay ₹${grandTotal} with Razorpay`}
                </Button>

                <p className="text-[11px] text-center text-muted-foreground">
                  Encrypted 256-bit SSL connection via Razorpay. Your payment credentials are never stored on our servers.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
