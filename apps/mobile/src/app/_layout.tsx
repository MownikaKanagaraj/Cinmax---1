import '../../global.css';
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProviders } from '@cinmax/hooks';
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
    <AppProviders>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <StackNavigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#F7F9FB' },
          }}
        />
      </SafeAreaProvider>
    </AppProviders>
  );
}
