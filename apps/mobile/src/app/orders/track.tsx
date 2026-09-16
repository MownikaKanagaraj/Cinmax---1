import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';

export default function MobileTrackOrderScreen() {
  const router = useRouter();

  const steps = [
    { title: 'Cold-Process Formulation & Saponification', date: 'July 28', done: true },
    { title: 'Artisan Cedar Curing Inspection Passed', date: 'July 31', done: true },
    { title: 'Hand-Wrapped & Dispatched with Courier', date: 'August 02', done: true },
    { title: 'In Transit to Destination Sanctuary', date: 'August 03', done: false },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FB' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'center' }}>
          <ArrowLeft size={16} color="#0A3D78" />
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#0A3D78', marginLeft: 4 }}>
            Back
          </Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 10, fontWeight: '800', letterSpacing: 2, color: '#C5A880', textTransform: 'uppercase' }}>
          Live Telemetry
        </Text>
        <Text style={{ fontSize: 24, fontWeight: '900', color: '#002754', marginTop: 2, marginBottom: 20 }}>
          Package Tracking
        </Text>

        <View style={{ backgroundColor: 'white', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, gap: 16 }}>
          <View style={{ backgroundColor: '#F7F9FB', padding: 12, borderRadius: 16 }}>
            <Text style={{ fontSize: 11, color: '#64748B' }}>Courier Tracking Air Bill</Text>
            <Text style={{ fontSize: 13, fontWeight: '800', color: '#002754', marginTop: 2 }}>
              CNX-TRACK-849201 (Priority Air)
            </Text>
          </View>

          <View style={{ gap: 16, marginTop: 8 }}>
            {steps.map((step, idx) => (
              <View key={idx} style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: step.done ? '#002754' : '#E2E8F0', justifyContent: 'center', alignItems: 'center' }}>
                  {step.done && <Check size={12} color="white" />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: step.done ? '#002754' : '#94A3B8' }}>
                    {step.title}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#64748B' }}>{step.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
