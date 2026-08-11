import * as SecureStore from 'expo-secure-store';
import type { MobileStorageAdapter } from '@cinmax/api';

/**
 * Native hardware-backed Keychain / Keystore adapter for Supabase session persistence on mobile.
 */
export const ExpoSecureStoreAdapter: MobileStorageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.warn(`SecureStore getItem error for key "${key}":`, error);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.warn(`SecureStore setItem error for key "${key}":`, error);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.warn(`SecureStore removeItem error for key "${key}":`, error);
    }
  },
};
