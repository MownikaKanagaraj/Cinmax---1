import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Store, Heart, Package, User } from 'lucide-react-native';

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
          fontSize: 10,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Home size={20} color={color} fill={focused ? '#002754' : 'none'} />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Store size={20} color={color} fill={focused ? '#002754' : 'none'} />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Wishlist',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Heart size={20} color={color} fill={focused ? '#002754' : 'none'} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Package size={20} color={color} fill={focused ? '#002754' : 'none'} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <User size={20} color={color} fill={focused ? '#002754' : 'none'} />
          ),
        }}
      />
    </TabsNavigator>
  );
}
