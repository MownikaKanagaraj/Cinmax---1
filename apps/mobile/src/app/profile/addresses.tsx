import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function MobileAddressesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FB' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#0A3D78' }}>
            ← Back to Profile
          </Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 10, fontWeight: '800', letterSpacing: 2, color: '#C5A880', textTransform: 'uppercase' }}>
          Patron Profile
        </Text>
        <Text style={{ fontSize: 24, fontWeight: '900', color: '#002754', marginTop: 2, marginBottom: 20 }}>
          Saved Shipping Addresses
        </Text>

        <View style={{ backgroundColor: 'white', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, gap: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#002754' }}>Primary Sanctuary</Text>
            <View style={{ backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 }}>
              <Text style={{ color: '#059669', fontSize: 10, fontWeight: '800' }}>DEFAULT</Text>
            </View>
          </View>
          <Text style={{ fontSize: 12, color: '#64748B', lineHeight: 18 }}>
            Aurora Vance{'\n'}
            742 Evergreen Botanical Way{'\n'}
            Portland, OR 97201, United States
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
