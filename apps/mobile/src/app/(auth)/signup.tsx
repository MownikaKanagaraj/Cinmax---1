import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail, Lock, User, KeyRound } from 'lucide-react-native';
import { useRegisterMutation } from '@cinmax/hooks';

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

export default function MobileSignupScreen() {
  const router = useRouter();
  const registerMutation = useRegisterMutation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async () => {
    setErrorMessage('');
    
    if (!firstName || !lastName || !email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    try {
      await registerMutation.mutateAsync({
        firstName,
        lastName,
        email,
        password,
      });
      setSuccessMessage('Registration successful! Welcome to the Atelier.');
      setTimeout(() => {
        router.replace('/(tabs)/profile' as any);
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FB' }}>
      {/* Top Bar */}
      <View style={{ paddingHorizontal: CONTAINER_PADDING, paddingTop: 14, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: 'rgba(195, 198, 209, 0.3)' }}>
        <TouchableOpacity onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)' as any))} style={{ padding: 4 }}>
          <ArrowLeft size={22} color="#002754" />
        </TouchableOpacity>
        <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: '#002754' }}>
          Patron Registration
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: CONTAINER_PADDING, paddingTop: 28, paddingBottom: 50 }}>
        {/* Brand Hero Card */}
        <View style={{ backgroundColor: '#002754', borderRadius: 24, padding: 24, shadowColor: '#002754', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 15, borderOutset: 'none', borderWidth: 1, borderColor: 'rgba(197, 168, 128, 0.3)', marginBottom: 28, alignItems: 'center' }}>
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#C5A880', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
            <KeyRound size={26} color="#002754" />
          </View>
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' }}>
            Join the Atelier
          </Text>
          <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: 'rgba(255, 255, 255, 0.85)', textAlign: 'center', marginTop: 4, lineHeight: 18 }}>
            Create your exclusive patron profile to track orders and save your botanical favorites.
          </Text>
        </View>

        {/* Feedback Alerts */}
        {errorMessage ? (
          <View style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', borderWidth: 1, borderColor: 'rgba(220, 38, 38, 0.3)', borderRadius: 16, padding: 12, marginBottom: 18 }}>
            <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, color: '#DC2626', fontSize: 12, textAlign: 'center' }}>
              {errorMessage}
            </Text>
          </View>
        ) : null}

        {successMessage ? (
          <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.3)', borderRadius: 16, padding: 12, marginBottom: 18 }}>
            <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, color: '#059669', fontSize: 12, textAlign: 'center' }}>
              {successMessage}
            </Text>
          </View>
        ) : null}

        {/* Registration Form */}
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 22, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.35)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.04, shadowRadius: 8 }}>
          
          <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#002754', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            First Name
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.4)', borderRadius: 16, paddingHorizontal: 14, height: 50, backgroundColor: '#F8FAFC', marginBottom: 18 }}>
            <User size={18} color="#94A3B8" />
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="e.g. Aanya"
              placeholderTextColor="#94A3B8"
              style={{ fontFamily: FONT_SANS_BOLD, fontSize: 15, color: '#002754', flex: 1 }}
            />
          </View>

          <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#002754', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            Last Name
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.4)', borderRadius: 16, paddingHorizontal: 14, height: 50, backgroundColor: '#F8FAFC', marginBottom: 18 }}>
            <User size={18} color="#94A3B8" />
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="e.g. Sharma"
              placeholderTextColor="#94A3B8"
              style={{ fontFamily: FONT_SANS_BOLD, fontSize: 15, color: '#002754', flex: 1 }}
            />
          </View>

          <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#002754', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            Email Address
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.4)', borderRadius: 16, paddingHorizontal: 14, height: 50, backgroundColor: '#F8FAFC', marginBottom: 18 }}>
            <Mail size={18} color="#94A3B8" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="patron@cinmax.com"
              placeholderTextColor="#94A3B8"
              style={{ fontFamily: FONT_SANS_BOLD, fontSize: 15, color: '#002754', flex: 1 }}
            />
          </View>

          <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#002754', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            Password
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.4)', borderRadius: 16, paddingHorizontal: 14, height: 50, backgroundColor: '#F8FAFC' }}>
            <Lock size={18} color="#94A3B8" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Create a strong password"
              placeholderTextColor="#94A3B8"
              style={{ fontFamily: FONT_SANS_BOLD, fontSize: 15, color: '#002754', flex: 1 }}
            />
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            disabled={registerMutation.isPending}
            style={{ backgroundColor: '#002754', borderRadius: 18, paddingVertical: 14, alignItems: 'center', marginTop: 24 }}
          >
            {registerMutation.isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#FFFFFF', fontSize: 14 }}>
                Create Atelier Account →
              </Text>
            )}
          </TouchableOpacity>

          <View style={{ marginTop: 24, flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#64748B' }}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login' as any)}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, color: '#C5A880' }}>
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
