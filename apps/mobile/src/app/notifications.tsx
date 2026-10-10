import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  useUser,
  useNotificationsQuery,
  useUnreadNotificationsCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from '@cinmax/hooks';
import type { AppNotification } from '@cinmax/types';
import {
  ArrowLeft,
  Bell,
  CheckCheck,
  Package,
  Tag,
  Sparkles,
  Info,
  Gift,
  AlertCircle,
  ExternalLink,
  ShoppingBag,
} from 'lucide-react-native';

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

function formatNotificationTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  } catch {
    return 'Recent';
  }
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'order':
      return <Package size={20} color="#002754" />;
    case 'promo':
    case 'coupon':
      return <Tag size={20} color="#C5A880" />;
    case 'loyalty':
    case 'reward':
      return <Gift size={20} color="#C5A880" />;
    case 'announcement':
      return <Sparkles size={20} color="#0A3D78" />;
    default:
      return <Bell size={20} color="#002754" />;
  }
}

export default function MobileNotificationsScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useUser();

  const {
    data: notifications = [],
    isLoading,
    isRefetching,
    refetch,
    error,
  } = useNotificationsQuery(user?.id);

  const { data: unreadCount = 0 } = useUnreadNotificationsCountQuery(user?.id);
  const markReadMutation = useMarkNotificationReadMutation();
  const markAllReadMutation = useMarkAllNotificationsReadMutation();

  const handleNotificationPress = (item: AppNotification) => {
    if (!item.isRead) {
      markReadMutation.mutate(item.id);
    }
    if (item.link) {
      router.push(item.link as any);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllReadMutation.mutate(user?.id);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF7F2' }}>
      {/* 1. TOP HEADER BAR */}
      <View
        style={{
          zIndex: 100,
          elevation: 10,
          paddingHorizontal: 20,
          paddingTop: 14,
          paddingBottom: 14,
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
        }}
      >
        <TouchableOpacity
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)' as any))}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
          style={{ minWidth: 40, minHeight: 40, justifyContent: 'center', alignItems: 'flex-start' }}
        >
          <ArrowLeft size={22} color="#002754" />
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 18, fontWeight: '700', color: '#002754' }}>
            Notifications
          </Text>
          {unreadCount > 0 && (
            <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 11, color: '#C5A880', marginTop: 1 }}>
              {unreadCount} unread update{unreadCount === 1 ? '' : 's'}
            </Text>
          )}
        </View>

        {unreadCount > 0 ? (
          <TouchableOpacity
            onPress={handleMarkAllAsRead}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              backgroundColor: 'rgba(0, 39, 84, 0.06)',
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 14,
            }}
          >
            <CheckCheck size={14} color="#002754" />
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, fontWeight: '700', color: '#002754' }}>
              Read All
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {/* 2. BODY CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={['#002754']}
            tintColor="#002754"
          />
        }
      >
        {!isAuthenticated ? (
          <View
            style={{
              paddingVertical: 60,
              paddingHorizontal: 24,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              borderWidth: 1,
              borderColor: 'rgba(195, 198, 209, 0.3)',
              shadowColor: '#0A3D78',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.04,
              shadowRadius: 10,
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: 'rgba(0, 39, 84, 0.06)',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <Bell size={28} color="#002754" />
            </View>
            <Text
              style={{
                fontFamily: FONT_SERIF_BOLD,
                fontSize: 18,
                fontWeight: '700',
                color: '#002754',
                textAlign: 'center',
                marginBottom: 8,
              }}
            >
              Stay Updated on Orders & Offers
            </Text>
            <Text
              style={{
                fontFamily: FONT_SANS_REGULAR,
                fontSize: 13,
                color: '#64748B',
                textAlign: 'center',
                marginBottom: 20,
                lineHeight: 19,
              }}
            >
              Sign in to receive real-time updates regarding your dispatch status, exclusive member rewards, and luxury soap collections.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login' as any)}
              activeOpacity={0.85}
              style={{
                backgroundColor: '#002754',
                paddingHorizontal: 28,
                paddingVertical: 12,
                borderRadius: 20,
                shadowColor: '#002754',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
              }}
            >
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>
                Sign In to View Notifications
              </Text>
            </TouchableOpacity>
          </View>
        ) : isLoading ? (
          <View style={{ paddingVertical: 80, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#002754" />
            <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, color: '#465F8A', marginTop: 14, fontSize: 13 }}>
              Loading your notifications...
            </Text>
          </View>
        ) : error ? (
          <View
            style={{
              paddingVertical: 40,
              paddingHorizontal: 20,
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(239, 68, 68, 0.2)',
            }}
          >
            <AlertCircle size={32} color="#DC2626" style={{ marginBottom: 10 }} />
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 16, color: '#002754', marginBottom: 6 }}>
              Unable to load updates
            </Text>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#64748B', textAlign: 'center', marginBottom: 16 }}>
              We could not connect to the notification service. Please pull down to refresh.
            </Text>
            <TouchableOpacity
              onPress={() => refetch()}
              style={{ backgroundColor: '#002754', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 16 }}
            >
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 12 }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : notifications.length === 0 ? (
          <View
            style={{
              paddingVertical: 60,
              paddingHorizontal: 24,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              borderWidth: 1,
              borderColor: 'rgba(195, 198, 209, 0.3)',
              shadowColor: '#0A3D78',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.04,
              shadowRadius: 10,
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: 'rgba(197, 168, 128, 0.15)',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <CheckCheck size={28} color="#C5A880" />
            </View>
            <Text
              style={{
                fontFamily: FONT_SERIF_BOLD,
                fontSize: 18,
                fontWeight: '700',
                color: '#002754',
                textAlign: 'center',
                marginBottom: 8,
              }}
            >
              You're All Caught Up
            </Text>
            <Text
              style={{
                fontFamily: FONT_SANS_REGULAR,
                fontSize: 13,
                color: '#64748B',
                textAlign: 'center',
                marginBottom: 20,
                lineHeight: 18,
              }}
            >
              No new alerts or order updates right now. We will notify you whenever your orders ship or new botanical creations arrive.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/shop' as any)}
              activeOpacity={0.85}
              style={{
                backgroundColor: '#002754',
                paddingHorizontal: 22,
                paddingVertical: 10,
                borderRadius: 18,
              }}
            >
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>
                Explore Artisanal Shop
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            {notifications.map((item: AppNotification) => {
              const isUnread = !item.isRead;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleNotificationPress(item)}
                  activeOpacity={0.85}
                  style={{
                    backgroundColor: isUnread ? '#FFFFFF' : '#F8FAFC',
                    borderRadius: 20,
                    padding: 16,
                    borderWidth: 1.5,
                    borderColor: isUnread ? '#002754' : 'rgba(195, 198, 209, 0.3)',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: 14,
                    shadowColor: '#0A3D78',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isUnread ? 0.08 : 0.02,
                    shadowRadius: 6,
                    position: 'relative',
                  }}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: isUnread ? 'rgba(0, 39, 84, 0.08)' : 'rgba(100, 116, 139, 0.08)',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {getNotificationIcon(item.type)}
                  </View>

                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <Text
                        style={{
                          fontFamily: isUnread ? FONT_SANS_BOLD : FONT_SANS_SEMIBOLD,
                          fontSize: 14,
                          fontWeight: isUnread ? '700' : '600',
                          color: '#002754',
                          flex: 1,
                          marginRight: 6,
                        }}
                        numberOfLines={2}
                      >
                        {item.title}
                      </Text>
                      <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#737781' }}>
                        {formatNotificationTime(item.createdAt)}
                      </Text>
                    </View>

                    <Text
                      style={{
                        fontFamily: FONT_SANS_REGULAR,
                        fontSize: 13,
                        color: isUnread ? '#191C1E' : '#64748B',
                        lineHeight: 18,
                        marginBottom: item.link ? 8 : 0,
                      }}
                    >
                      {item.message}
                    </Text>

                    {item.link && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                        <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: '#C5A880', fontWeight: '700' }}>
                          View Details
                        </Text>
                        <ExternalLink size={12} color="#C5A880" />
                      </View>
                    )}
                  </View>

                  {isUnread && (
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#C5A880',
                        position: 'absolute',
                        top: 16,
                        right: 14,
                      }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
