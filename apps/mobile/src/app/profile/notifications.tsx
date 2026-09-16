import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function MobileNotificationsScreen() {
  const router = useRouter();

  const notifications = [
    {
      title: 'Batch Release Alert',
      body: 'Our French Green Clay & Eucalyptus bar has completed curing and is ready.',
      time: '2 hours ago',
    },
    {
      title: 'Dispatched with Courier',
      body: 'Order CNX-20260802-8492 has been handed to Priority Air.',
      time: 'Yesterday',
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FB' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#0A3D78' }}>
            ← Back to Profile
          </Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 10, fontWeight: '800', letterSpacing: 2, color: '#C5A880', textTransform: 'uppercase' }}>
          Patron Dispatch
        </Text>
        <Text style={{ fontSize: 24, fontWeight: '900', color: '#002754', marginTop: 2, marginBottom: 20 }}>
          Notifications
        </Text>

        <View style={{ gap: 14 }}>
          {notifications.map((n, idx) => (
            <View
              key={idx}
              style={{ backgroundColor: 'white', borderRadius: 20, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, gap: 4 }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#002754' }}>
                  {n.title}
                </Text>
                <Text style={{ fontSize: 10, color: '#94A3B8' }}>{n.time}</Text>
              </View>
              <Text style={{ fontSize: 11, color: '#64748B', lineHeight: 16 }}>
                {n.body}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
