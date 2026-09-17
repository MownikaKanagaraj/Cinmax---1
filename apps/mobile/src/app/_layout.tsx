import '../../global.css';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProviders, useAuthStore } from '@cinmax/hooks';
import { createCinmaxMobileClient, RepositoryProvider, getContainer } from '@cinmax/api';
import { ExpoSecureStoreAdapter } from '../storage/expoSecureStore';
import { StyleSheet } from 'react-native-css-interop';
import {
  useFonts,
  NotoSerif_400Regular,
  NotoSerif_600SemiBold,
  NotoSerif_700Bold,
} from '@expo-google-fonts/noto-serif';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';

try {
  (StyleSheet as any).setFlag?.('darkMode', 'class');
} catch (e) {
  // ignore
}

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://nthyavlzdgucrldtgjeo.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aHlhdmx6ZGd1Y3JsZHRnamVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NTU2MDAsImV4cCI6MjEwMTMzMTYwMH0.XzL0nuUOnksJLgsT9tGlsi4-adHtosCjV4fk9-MXClc';

export const mobileSupabaseClient = createCinmaxMobileClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  ExpoSecureStoreAdapter
);

export const mobileContainer = getContainer({ supabaseClient: mobileSupabaseClient as any });

function AuthInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Restore persistent session from SecureStore on mobile startup
    mobileSupabaseClient.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        const u = data.session.user;
        const rawRole = u.user_metadata?.role;
        const parsedRole = (rawRole === 'admin' || rawRole === 'super_admin') ? rawRole : 'customer';
        useAuthStore.getState().login(
          {
            id: u.id,
            authId: u.id,
            email: u.email || `${u.phone || 'customer'}@cinmax.com`,
            firstName: u.user_metadata?.first_name || u.email?.split('@')[0] || 'Valued',
            lastName: u.user_metadata?.last_name || 'Customer',
            phone: u.phone || u.user_metadata?.phone || '',
            role: parsedRole as any,
            loyaltyTier: u.user_metadata?.loyalty_tier || 'bronze',
            loyaltyPoints: Math.max(0, Number(u.user_metadata?.loyalty_points) || 0),
            savedAddresses: [],
            wishlistProductIds: [],
            createdAt: u.created_at || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          data.session.access_token
        );
      }
    }).catch((err) => {
      console.warn('Mobile session restoration warning:', err);
    });

    const { data: authListener } = mobileSupabaseClient.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        const rawRole = u.user_metadata?.role;
        const parsedRole = (rawRole === 'admin' || rawRole === 'super_admin') ? rawRole : 'customer';
        useAuthStore.getState().login(
          {
            id: u.id,
            authId: u.id,
            email: u.email || `${u.phone || 'customer'}@cinmax.com`,
            firstName: u.user_metadata?.first_name || u.email?.split('@')[0] || 'Valued',
            lastName: u.user_metadata?.last_name || 'Customer',
            phone: u.phone || u.user_metadata?.phone || '',
            role: parsedRole as any,
            loyaltyTier: u.user_metadata?.loyalty_tier || 'bronze',
            loyaltyPoints: Math.max(0, Number(u.user_metadata?.loyalty_points) || 0),
            savedAddresses: [],
            wishlistProductIds: [],
            createdAt: u.created_at || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          session.access_token
        );
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    NotoSerif_400Regular,
    NotoSerif_600SemiBold,
    NotoSerif_700Bold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const StackNavigator = Stack as any;
  return (
    <RepositoryProvider container={mobileContainer}>
      <AppProviders>
        <AuthInitializer>
          <SafeAreaProvider>
            <StatusBar style="dark" />
            <StackNavigator
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#F7F9FB' },
              }}
            />
          </SafeAreaProvider>
        </AuthInitializer>
      </AppProviders>
    </RepositoryProvider>
  );
}
