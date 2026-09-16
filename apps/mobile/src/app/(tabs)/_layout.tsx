import React from 'react';
import { Platform, Text } from 'react-native';
import { Tabs } from 'expo-router';
import { Home, Store, Video, Package, User } from 'lucide-react-native';

const FONT_SANS_BOLD = Platform.select({
  web: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
  default: 'PlusJakartaSans_700Bold',
});

export default function TabLayout() {
  const TabsNavigator = Tabs as any;
  return (
    <TabsNavigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: 'rgba(195, 198, 209, 0.3)',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 68,
          paddingBottom: 10,
          paddingTop: 6,
          shadowColor: '#0A3D78',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.08,
          shadowRadius: 20,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarActiveTintColor: '#002754',
        tabBarInactiveTintColor: '#737781',
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: FONT_SANS_BOLD,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: ({ color }: { color: any }) => (
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, fontWeight: '700', color: color as string, marginTop: 2 }}>
              Home
            </Text>
          ),
          tabBarIcon: ({ color, focused }: { color: any; focused: boolean }) => (
            <Home size={20} color={color as string} fill={focused ? '#002754' : 'none'} />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarLabel: ({ color }: { color: any }) => (
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, fontWeight: '700', color: color as string, marginTop: 2 }}>
              Shop
            </Text>
          ),
          tabBarIcon: ({ color, focused }: { color: any; focused: boolean }) => (
            <Store size={20} color={color as string} fill={focused ? '#002754' : 'none'} />
          ),
        }}
      />
      <Tabs.Screen
        name="videos"
        options={{
          title: 'Classes',
          tabBarLabel: ({ color }: { color: any }) => (
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, fontWeight: '700', color: color as string, marginTop: 2 }}>
              Classes
            </Text>
          ),
          tabBarIcon: ({ color, focused }: { color: any; focused: boolean }) => (
            <Video size={20} color={color as string} fill={focused ? '#002754' : 'none'} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarLabel: ({ color }: { color: any }) => (
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, fontWeight: '700', color: color as string, marginTop: 2 }}>
              Orders
            </Text>
          ),
          tabBarIcon: ({ color, focused }: { color: any; focused: boolean }) => (
            <Package size={20} color={color as string} fill={focused ? '#002754' : 'none'} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: ({ color }: { color: any }) => (
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, fontWeight: '700', color: color as string, marginTop: 2 }}>
              Profile
            </Text>
          ),
          tabBarIcon: ({ color, focused }: { color: any; focused: boolean }) => (
            <User size={20} color={color as string} fill={focused ? '#002754' : 'none'} />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          href: null,
        }}
      />
    </TabsNavigator>
  );
}
