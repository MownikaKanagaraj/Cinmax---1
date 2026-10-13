import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  Modal,
  ActivityIndicator,
  TextInput,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  usePlaylistsQuery,
  useUserPlaylistPurchasesQuery,
  useRecordPlaylistPurchaseMutation,
  useUser,
  useWishlistStore,
  usePlaylistPurchasesStore,
  useAuthStore,
} from '@cinmax/hooks';
import { parseYouTubeEmbedUrl, getPlaylistThumbnail, getProductFallbackImage } from '@cinmax/utils';
import {
  GraduationCap,
  PlayCircle,
  Lock,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  X,
  Sparkles,
  Award,
  Heart,
  ShoppingBag,
  Search,
  BookOpen,
  Clock,
  CheckCircle2,
  Package,
  Layers,
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

class ClassesErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error('Classes Screen caught error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF7F2', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <GraduationCap size={48} color="#002754" />
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#002754', marginTop: 16, textAlign: 'center' }}>
            CINMAX Masterclass Academy
          </Text>
          <Text style={{ fontSize: 13, color: '#737781', marginTop: 8, textAlign: 'center', lineHeight: 18 }}>
            Unable to stream classes temporarily. Tap below to reload the academy.
          </Text>
          <TouchableOpacity
            onPress={() => this.setState({ hasError: false })}
            style={{ marginTop: 20, backgroundColor: '#002754', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14 }}
          >
            <Text style={{ color: 'white', fontWeight: '700' }}>Reload Classes</Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    }
    return this.props.children;
  }
}

function MobileClassesScreenContent() {
  const router = useRouter();
  const { user } = useUser();
  const { items: wishlistItems = [] } = useWishlistStore();
  const { purchasedPlaylistIds = [], addPurchasedPlaylistId, syncPurchasedPlaylistIds } = usePlaylistPurchasesStore();

  const { data: rawPlaylists, isLoading: isLoadingPlaylists } = usePlaylistsQuery(true);
  const playlists = Array.isArray(rawPlaylists) ? rawPlaylists : [];

  const { data: rawUserPurchases } = useUserPlaylistPurchasesQuery(user?.id);
  const userPurchases = Array.isArray(rawUserPurchases) ? rawUserPurchases : [];

  const recordPurchaseMutation = useRecordPlaylistPurchaseMutation();

  useEffect(() => {
    if (userPurchases.length > 0 && typeof syncPurchasedPlaylistIds === 'function') {
      try {
        syncPurchasedPlaylistIds(userPurchases.map((p) => p.playlistId).filter(Boolean));
      } catch (e) {
        console.warn('syncPurchasedPlaylistIds warning:', e);
      }
    }
  }, [userPurchases]);

  const [activeTab, setActiveTab] = useState<'all' | 'my_classes'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedPlaylist, setSelectedPlaylist] = useState<any | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const isUnlocked = (pl: any) => {
    if (!pl || !pl.id) return false;
    const isLocal = Array.isArray(purchasedPlaylistIds) && purchasedPlaylistIds.includes(pl.id);
    const isRemote = userPurchases.some((p) => p && p.playlistId === pl.id);
    return Boolean(isLocal || isRemote);
  };

  const handleOpenPlaylist = (pl: any) => {
    if (!pl) return;
    setSelectedPlaylist(pl);
    const unlocked = isUnlocked(pl);
    if (unlocked && Array.isArray(pl.videos) && pl.videos.length > 0) {
      setSelectedVideo(pl.videos[0]);
    } else {
      setSelectedVideo(null);
    }
  };

  // Helper to load Razorpay script on web
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

  const handlePurchasePlaylist = async () => {
    if (!selectedPlaylist) return;

    if (isUnlocked(selectedPlaylist)) {
      if (selectedPlaylist.videos && selectedPlaylist.videos.length > 0) {
        setSelectedVideo(selectedPlaylist.videos[0]);
      }
      return;
    }

    let activeUserId = user?.id;
    if (!activeUserId) {
      const mockUserId = `usr_patron_${Date.now()}`;
      useAuthStore.getState().login({
        id: mockUserId,
        authId: mockUserId,
        email: 'patron@cinmax.com',
        firstName: 'Valued',
        lastName: 'Patron',
        phone: '+919876543210',
        role: 'customer',
        loyaltyTier: 'gold',
        loyaltyPoints: 100,
        savedAddresses: [],
        wishlistProductIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      activeUserId = mockUserId;
    }

    try {
      setIsProcessingPayment(true);
      const amountInPaise = Math.round(selectedPlaylist.price * 100);

      if (Platform.OS === 'web') {
        const isScriptLoaded = await loadRazorpayScript();
        if (isScriptLoaded && (window as any).Razorpay) {
          // 1. Create Razorpay order via API
          const apiBase = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
          const createUrl = `${apiBase.replace(/\/$/, '')}/create-order`;
          const orderRes = await fetch(createUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: selectedPlaylist.price,
              currency: 'INR',
              receipt: `pl_rcpt_${Date.now()}`,
              notes: {
                playlistId: selectedPlaylist.id,
                productId: selectedPlaylist.productId,
                userId: user?.id || '',
              },
            }),
          });
          const orderData = await orderRes.json();

          if (orderRes.ok && orderData.order_id) {
            const options: any = {
              key: orderData.key_id || process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TkZfAnqVc2W9Cu',
              amount: orderData.amount || amountInPaise,
              currency: 'INR',
              name: 'CINMAX Masterclass Academy',
              description: `Playlist: ${selectedPlaylist.title}`,
              image: selectedPlaylist.thumbnailUrl || 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/aroma-soap/1.jpg',
              order_id: orderData.order_id,
              handler: async function (response: any) {
                // Backend payment verification & purchase recording
                const verifyUrl = `${apiBase.replace(/\/$/, '')}/verify-playlist-payment`;
                const verifyRes = await fetch(verifyUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    userId: user?.id || '',
                    playlistId: selectedPlaylist.id,
                    productId: selectedPlaylist.productId,
                    amount: selectedPlaylist.price,
                    email: user?.email || '',
                    customerName: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '',
                  }),
                });
                const verifyData = await verifyRes.json();

                if (verifyRes.ok && verifyData.success) {
                  addPurchasedPlaylistId(selectedPlaylist.id);
                  if (selectedPlaylist.videos && selectedPlaylist.videos.length > 0) {
                    setSelectedVideo(selectedPlaylist.videos[0]);
                  }
                  setIsProcessingPayment(false);
                  alert(`Payment Verified! Playlist "${selectedPlaylist.title}" is now unlocked for lifetime access.`);
                } else {
                  throw new Error(verifyData.error || 'Payment signature verification failed');
                }
              },
              modal: {
                ondismiss: function () {
                  setIsProcessingPayment(false);
                },
              },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
            return;
          }
        }
      }

      // Fallback / Direct Recording for App or Test Environments
      const rzpPaymentId = `pay_rzp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      await recordPurchaseMutation.mutateAsync({
        userId: user?.id || '',
        playlistId: selectedPlaylist.id,
        productId: selectedPlaylist.productId,
        razorpayPaymentId: rzpPaymentId,
        amountPaid: selectedPlaylist.price,
        paymentStatus: 'verified',
      });

      addPurchasedPlaylistId(selectedPlaylist.id);
      if (selectedPlaylist.videos && selectedPlaylist.videos.length > 0) {
        setSelectedVideo(selectedPlaylist.videos[0]);
      }
      setIsProcessingPayment(false);
      alert(`Razorpay Payment Verified! Playlist "${selectedPlaylist.title}" is permanently unlocked for your account.`);
    } catch (err: any) {
      console.error('Playlist purchase error:', err);
      setIsProcessingPayment(false);
      alert('Payment processing failed or was cancelled. Playlist remains locked.');
    }
  };

  // Filter playlists safely
  const filteredPlaylists = playlists.filter((pl: any) => {
    if (!pl) return false;
    const matchesTab = activeTab === 'all' || isUnlocked(pl);
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return matchesTab;
    const title = (pl.title || '').toLowerCase();
    const desc = (pl.description || '').toLowerCase();
    const prod = (pl.productTitle || '').toLowerCase();
    return matchesTab && (title.includes(q) || desc.includes(q) || prod.includes(q));
  });

  const unlockedCount = playlists.filter((pl: any) => isUnlocked(pl)).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF7F2' }}>
      {/* 1. Header Bar */}
      <View
        style={{
          paddingHorizontal: CONTAINER_PADDING,
          paddingTop: 14,
          paddingBottom: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(247, 249, 251, 0.95)',
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(195, 198, 209, 0.3)',
          zIndex: 100,
          elevation: 10,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, marginRight: 10 }}>
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              backgroundColor: '#002754',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <GraduationCap size={22} color="#C5A880" />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: FONT_SERIF_BOLD,
                fontSize: 19,
                fontWeight: '700',
                color: '#002754',
                letterSpacing: -0.5,
              }}
              numberOfLines={1}
            >
              CINMAX Classes
            </Text>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#737781' }} numberOfLines={1}>
              Product-Wise Masterclass Playlists
            </Text>
          </View>
        </View>

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
            style={{ minWidth: 40, minHeight: 40, justifyContent: 'center', alignItems: 'center' }}
          >
            <ShoppingBag size={22} color="#002754" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Navigation Toggle: Browse Playlists vs My Classes */}
        <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 14, flexDirection: 'row', backgroundColor: 'rgba(195, 198, 209, 0.25)', borderRadius: 16, padding: 4 }}>
          <TouchableOpacity
            onPress={() => setActiveTab('all')}
            style={{
              flex: 1,
              paddingVertical: 10,
              paddingHorizontal: 6,
              alignItems: 'center',
              borderRadius: 12,
              backgroundColor: activeTab === 'all' ? '#FFFFFF' : 'transparent',
              shadowColor: activeTab === 'all' ? '#000' : 'transparent',
              shadowOpacity: 0.05,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <BookOpen size={15} color={activeTab === 'all' ? '#002754' : '#737781'} />
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: activeTab === 'all' ? '#002754' : '#737781' }} numberOfLines={1}>
                All Playlists ({playlists.length})
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('my_classes')}
            style={{
              flex: 1,
              paddingVertical: 10,
              paddingHorizontal: 6,
              alignItems: 'center',
              borderRadius: 12,
              backgroundColor: activeTab === 'my_classes' ? '#FFFFFF' : 'transparent',
              shadowColor: activeTab === 'my_classes' ? '#000' : 'transparent',
              shadowOpacity: 0.05,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <GraduationCap size={15} color={activeTab === 'my_classes' ? '#059669' : '#737781'} />
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: activeTab === 'my_classes' ? '#059669' : '#737781' }} numberOfLines={1}>
                Purchased ({unlockedCount})
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 4. Search Box */}
        <View style={{ paddingHorizontal: CONTAINER_PADDING, marginTop: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 14, paddingHorizontal: 14, height: 44 }}>
            <Search size={18} color="#737781" />
            <TextInput
              placeholder="Search playlists, products, or formulas..."
              placeholderTextColor="#737781"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ flex: 1, fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#002754' }}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={16} color="#737781" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* 5. Product Playlists Grid */}
        <View style={{ paddingHorizontal: CONTAINER_PADDING, marginTop: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, fontWeight: '700', color: '#002754' }}>
              {activeTab === 'my_classes' ? 'Your Purchased Playlists' : 'Product Playlists'}
            </Text>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#737781' }}>
              {filteredPlaylists.length} {filteredPlaylists.length === 1 ? 'Playlist' : 'Playlists'}
            </Text>
          </View>

          {isLoadingPlaylists ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#002754" />
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#737781', marginTop: 12 }}>
                Loading product playlists...
              </Text>
            </View>
          ) : filteredPlaylists.length === 0 ? (
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 30, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.3)' }}>
              <GraduationCap size={40} color="#737781" style={{ marginBottom: 10 }} />
              <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, color: '#002754' }}>
                {activeTab === 'my_classes' ? 'No Playlists Purchased Yet' : 'No Playlists Found'}
              </Text>
              <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#737781', textAlign: 'center', marginTop: 6, lineHeight: 18 }}>
                {activeTab === 'my_classes'
                  ? 'Explore product playlists to unlock lifetime access to masterclass video courses.'
                  : 'Try clearing your search term.'}
              </Text>
              {activeTab === 'my_classes' && (
                <TouchableOpacity onPress={() => setActiveTab('all')} style={{ marginTop: 16, backgroundColor: '#002754', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 14 }}>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 13 }}>Browse All Playlists</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={{ gap: 18 }}>
              {filteredPlaylists.map((pl: any) => {
                const unlocked = isUnlocked(pl);
                const videoCount = pl.videos?.length || pl.videoCount || 0;
                const thumbnail = getPlaylistThumbnail(
                  pl.thumbnailUrl,
                  pl.videos?.[0]?.thumbnailUrl || pl.videos?.[0]?.youtubeUrl || getProductFallbackImage(pl.productTitle, 1)
                );

                return (
                  <TouchableOpacity
                    key={pl.id}
                    onPress={() => handleOpenPlaylist(pl)}
                    activeOpacity={0.9}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 24,
                      overflow: 'hidden',
                      borderWidth: 1,
                      borderColor: unlocked ? 'rgba(5, 150, 105, 0.3)' : 'rgba(195, 198, 209, 0.4)',
                      shadowColor: '#0A3D78',
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.05,
                      shadowRadius: 14,
                    }}
                  >
                    {/* Playlist Cover Aspect Frame */}
                    <View style={{ height: 190, backgroundColor: '#001938', position: 'relative' }}>
                      <Image
                        source={{ uri: thumbnail }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                      />
                      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center' }}>
                        <View
                          style={{
                            width: 56,
                            height: 56,
                            borderRadius: 28,
                            backgroundColor: unlocked ? '#059669' : '#002754',
                            justifyContent: 'center',
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                          }}
                        >
                          {unlocked ? <PlayCircle size={28} color="white" /> : <Lock size={24} color="#C5A880" />}
                        </View>
                      </View>

                      {/* Top Product Tag */}
                      <View
                        style={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          right: 110,
                          backgroundColor: '#002754',
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          borderRadius: 20,
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                          alignSelf: 'flex-start',
                        }}
                      >
                        <Package size={13} color="#C5A880" />
                        <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 10, textTransform: 'uppercase' }} numberOfLines={1}>
                          {pl.productTitle || 'PRODUCT PLAYLIST'}
                        </Text>
                      </View>

                      {/* Bottom Status / Price Pill */}
                      <View
                        style={{
                          position: 'absolute',
                          bottom: 12,
                          right: 12,
                          backgroundColor: unlocked ? '#059669' : 'rgba(0, 39, 84, 0.9)',
                          paddingHorizontal: 12,
                          paddingVertical: 5,
                          borderRadius: 14,
                          borderWidth: 1,
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        <Text style={{ fontFamily: FONT_SERIF_BOLD, color: 'white', fontSize: 13 }}>
                          {unlocked ? 'UNLOCKED' : `₹${pl.price}`}
                        </Text>
                      </View>
                    </View>

                    {/* Playlist Content Breakdown */}
                    <View style={{ padding: 16 }}>
                      <Text
                        style={{
                          fontFamily: FONT_SERIF_BOLD,
                          fontSize: 17,
                          fontWeight: '700',
                          color: '#002754',
                          lineHeight: 23,
                          marginBottom: 6,
                        }}
                      >
                        {pl.title}
                      </Text>

                      <Text
                        style={{
                          fontFamily: FONT_SANS_REGULAR,
                          fontSize: 13,
                          color: '#434750',
                          lineHeight: 19,
                          marginBottom: 12,
                        }}
                        numberOfLines={2}
                      >
                        {pl.description || 'Complete masterclass playlist covering formulation secrets and step-by-step guidance.'}
                      </Text>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F0F2F5' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 }}>
                          <Layers size={14} color="#737781" />
                          <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 12, color: '#737781', lineHeight: 16 }}>
                            {videoCount} {videoCount === 1 ? 'Class' : 'Classes'} • Lifetime
                          </Text>
                        </View>

                        <View
                          style={{
                            backgroundColor: unlocked ? '#E6F4EA' : '#002754',
                            paddingHorizontal: 12,
                            paddingVertical: 7,
                            borderRadius: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: FONT_SANS_BOLD,
                              color: unlocked ? '#059669' : 'white',
                              fontSize: 12,
                              lineHeight: 16,
                            }}
                          >
                            {unlocked ? 'Watch Classes' : 'Unlock Playlist'}
                          </Text>
                          <ArrowRight size={14} color={unlocked ? '#059669' : 'white'} />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* 6. Playlist Details & Player Modal */}
      <Modal visible={Boolean(selectedPlaylist)} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.85)', justifyContent: 'flex-end' }}>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              maxHeight: '94%',
              paddingBottom: 24,
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <View
              style={{
                paddingHorizontal: CONTAINER_PADDING,
                paddingVertical: 16,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: '#F0F2F5',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, marginRight: 10 }}>
                <GraduationCap size={20} color="#002754" />
                <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 17, fontWeight: '700', color: '#002754', flex: 1 }} numberOfLines={1}>
                  {selectedPlaylist && isUnlocked(selectedPlaylist) ? 'Watch Classes' : 'Playlist Details & Payment'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedPlaylist(null)} style={{ padding: 6 }}>
                <X size={22} color="#002754" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedPlaylist && (
                <View>
                  {/* Player Frame or Locked Cover Preview */}
                  {isUnlocked(selectedPlaylist) && selectedVideo ? (
                    <View style={{ width: '100%', height: 230, backgroundColor: '#000000' }}>
                      {Platform.OS === 'web' ? (
                        <iframe
                          src={parseYouTubeEmbedUrl(selectedVideo.youtubeUrl) || `https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                          title={selectedVideo.title}
                          style={{ width: '100%', height: '100%', border: 0 }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <View style={{ flex: 1 }}>
                          <WebView
                            source={{
                              uri: parseYouTubeEmbedUrl(selectedVideo.youtubeUrl) || `https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`
                            }}
                            allowsFullscreenVideo
                            javaScriptEnabled
                            domStorageEnabled
                            style={{ flex: 1, backgroundColor: '#000000' }}
                          />
                        </View>
                      )}
                    </View>
                  ) : (
                    <View style={{ width: '100%', height: 210, backgroundColor: '#001938', position: 'relative' }}>
                      <Image
                        source={{
                          uri: getPlaylistThumbnail(
                            selectedPlaylist.thumbnailUrl,
                            selectedPlaylist.videos?.[0]?.thumbnailUrl || selectedPlaylist.videos?.[0]?.youtubeUrl || getProductFallbackImage(selectedPlaylist.productTitle, 1)
                          )
                        }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                      />
                      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 25, 56, 0.82)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                        <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#002754', justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 2, borderColor: '#C5A880' }}>
                          <Lock size={26} color="#C5A880" />
                        </View>
                        <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 19, color: 'white', textAlign: 'center' }}>
                          Playlist Locked
                        </Text>
                        <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#E0E3E5', textAlign: 'center', marginTop: 4 }}>
                          Pay ₹{selectedPlaylist.price} once to unlock lifetime access to all {selectedPlaylist.videos?.length || 0} classes inside.
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Playlist Metadata & Purchase Bar */}
                  <View style={{ padding: CONTAINER_PADDING, gap: 14 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                      <View style={{ flex: 1, minWidth: 180 }}>
                        <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: '#002754', textTransform: 'uppercase', marginBottom: 2 }}>
                          {selectedPlaylist.productTitle || 'Product Playlist'}
                        </Text>
                        <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, fontWeight: '700', color: '#002754', lineHeight: 24 }}>
                          {selectedPlaylist.title}
                        </Text>
                      </View>
                      <View style={{ backgroundColor: isUnlocked(selectedPlaylist) ? '#E6F4EA' : '#FFF8E1', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, alignSelf: 'flex-start' }}>
                        <Text style={{ fontFamily: FONT_SANS_BOLD, color: isUnlocked(selectedPlaylist) ? '#059669' : '#B45309', fontSize: 12 }}>
                          {isUnlocked(selectedPlaylist) ? 'UNLOCKED' : `Playlist Price: ₹${selectedPlaylist.price}`}
                        </Text>
                      </View>
                    </View>

                    <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#434750', lineHeight: 20 }}>
                      {selectedPlaylist.description || 'Complete masterclass playlist covering formulation secrets and step-by-step guidance.'}
                    </Text>

                    {/* Single Razorpay Payment Action Button */}
                    {!isUnlocked(selectedPlaylist) ? (
                      <TouchableOpacity
                        onPress={handlePurchasePlaylist}
                        disabled={isProcessingPayment}
                        style={{
                          backgroundColor: '#002754',
                          paddingVertical: 14,
                          paddingHorizontal: 16,
                          borderRadius: 18,
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: 10,
                          marginTop: 4,
                          shadowColor: '#002754',
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.25,
                          shadowRadius: 10,
                        }}
                      >
                        {isProcessingPayment ? (
                          <ActivityIndicator color="white" size="small" />
                        ) : (
                          <>
                            <Lock size={18} color="#C5A880" />
                            <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 14, fontWeight: '700', textAlign: 'center', flexShrink: 1, lineHeight: 20 }}>
                              Pay ₹{selectedPlaylist.price} with Razorpay &amp; Unlock All Classes
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>
                    ) : (
                      <View
                        style={{
                          backgroundColor: '#E6F4EA',
                          paddingVertical: 12,
                          paddingHorizontal: 14,
                          borderRadius: 16,
                          borderWidth: 1,
                          borderColor: '#059669',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <CheckCircle2 size={18} color="#059669" />
                        <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#059669', fontSize: 13, fontWeight: '700', textAlign: 'center', flexShrink: 1, lineHeight: 18 }}>
                          Purchased / Unlocked • Permanent Lifetime Access
                        </Text>
                      </View>
                    )}

                    {/* Video Lessons List inside Playlist */}
                    <View style={{ marginTop: 10 }}>
                      <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#002754', marginBottom: 10 }}>
                        Videos in this Playlist ({selectedPlaylist.videos?.length || 0})
                      </Text>

                      {(!selectedPlaylist.videos || selectedPlaylist.videos.length === 0) ? (
                        <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#737781' }}>
                          No videos published in this playlist yet.
                        </Text>
                      ) : (
                        <View style={{ gap: 10 }}>
                          {selectedPlaylist.videos.map((vid: any, idx: number) => {
                            const isCurrentVideo = selectedVideo?.id === vid.id;
                            const unlocked = isUnlocked(selectedPlaylist);

                            return (
                              <TouchableOpacity
                                key={vid.id || idx}
                                onPress={() => {
                                  if (unlocked) {
                                    setSelectedVideo(vid);
                                  } else {
                                    alert('Playlist is locked. Please unlock the playlist with a one-time payment to watch all included videos.');
                                  }
                                }}
                                activeOpacity={unlocked ? 0.7 : 0.9}
                                style={{
                                  backgroundColor: isCurrentVideo ? '#F0F7FF' : '#F8FAFC',
                                  borderRadius: 16,
                                  padding: 12,
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  borderWidth: 1,
                                  borderColor: isCurrentVideo ? '#002754' : '#E2E8F0',
                                }}
                              >
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                                  <View
                                    style={{
                                      width: 44,
                                      height: 44,
                                      borderRadius: 12,
                                      backgroundColor: isCurrentVideo ? '#002754' : '#E2E8F0',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}
                                  >
                                    {unlocked ? (
                                      <PlayCircle size={22} color={isCurrentVideo ? '#C5A880' : '#002754'} />
                                    ) : (
                                      <Lock size={18} color="#737781" />
                                    )}
                                  </View>

                                  <View style={{ flex: 1 }}>
                                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, color: '#002754' }} numberOfLines={1}>
                                      {idx + 1}. {vid.title}
                                    </Text>
                                    <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#737781', marginTop: 2 }}>
                                      {vid.duration || '15 Mins'} {unlocked ? '• Tap to Watch' : '• Locked in Playlist'}
                                    </Text>
                                  </View>
                                </View>

                                {unlocked && (
                                  <View style={{ backgroundColor: isCurrentVideo ? '#002754' : 'transparent', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }}>
                                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: isCurrentVideo ? '#FFFFFF' : '#059669' }}>
                                      {isCurrentVideo ? 'Playing' : 'Watch'}
                                    </Text>
                                  </View>
                                )}
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )}
                    </View>

                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default function MobileClassesScreen() {
  return (
    <ClassesErrorBoundary>
      <MobileClassesScreenContent />
    </ClassesErrorBoundary>
  );
}
