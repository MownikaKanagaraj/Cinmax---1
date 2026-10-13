import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Sparkles, Mail, Lock, Eye, EyeOff, User, Phone, CheckCircle2, AlertCircle, Heart, ShieldCheck } from 'lucide-react-native';
import { useRegisterMutation, useWishlistStore } from '@cinmax/hooks';
import { LOCAL_SOAP_ASSETS } from '../../constants/soapAssets';

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

export default function MobileRegisterScreen() {
  const router = useRouter();
  const registerMutation = useRegisterMutation();
  const { items: wishlistItems } = useWishlistStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    if (!cleanFirstName) {
      setErrorMessage('Please enter your First Name');
      return;
    }

    if (!cleanLastName) {
      setErrorMessage('Please enter your Last Name');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter confirm password.');
      return;
    }

    try {
      await registerMutation.mutateAsync({
        firstName: cleanFirstName,
        lastName: cleanLastName,
        email: cleanEmail,
        phone: cleanPhone || undefined,
        password,
      });

      setSuccessMessage('Account created successfully! Redirecting to profile...');
      setTimeout(() => {
        router.replace('/(tabs)/profile' as any);
      }, 600);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please verify your details or try signing in.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF7F2' }}>
      {/* 1. Header Bar */}
      <View style={{ paddingHorizontal: CONTAINER_PADDING, paddingTop: 14, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: 'rgba(197, 168, 128, 0.25)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, zIndex: 10 }}>
        <TouchableOpacity onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)' as any))} style={{ padding: 6 }}>
          <ArrowLeft size={22} color="#002754" />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: '#002754', letterSpacing: -0.3 }}>
            CINMAX
          </Text>
          <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 9, color: '#C5A880', textTransform: 'uppercase', letterSpacing: 1 }}>
            Artisanal Botanical Beauty
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/wishlist' as any)} style={{ padding: 6, position: 'relative' }}>
          <Heart size={20} color={wishlistItems.length > 0 ? '#DC2626' : '#002754'} fill={wishlistItems.length > 0 ? '#DC2626' : 'none'} />
          {wishlistItems.length > 0 && (
            <View style={{ position: 'absolute', top: 2, right: 2, backgroundColor: '#DC2626', borderRadius: 8, width: 14, height: 14, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 9, fontWeight: '700' }}>{wishlistItems.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: CONTAINER_PADDING,
              paddingTop: 16,
              paddingBottom: 380,
              maxWidth: 540,
              alignSelf: 'center',
              width: '100%',
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            {/* 2. Luxury Hero Banner */}
            <View style={{ borderRadius: 20, overflow: 'hidden', height: 130, backgroundColor: '#002754', marginBottom: 16, position: 'relative', borderWidth: 1, borderColor: 'rgba(197, 168, 128, 0.4)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 12 }}>
              <Image
                source={LOCAL_SOAP_ASSETS['rose-soap']}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 31, 68, 0.65)' }} />
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
                <View style={{ backgroundColor: 'rgba(197, 168, 128, 0.25)', borderWidth: 1, borderColor: '#C5A880', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 16, marginBottom: 4 }}>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#F3E5D8', fontSize: 9.5, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2 }}>
                    JOIN CINMAX VIP CIRCLE
                  </Text>
                </View>
                <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 21, fontWeight: '700', color: 'white', textAlign: 'center', marginBottom: 2 }}>
                  Create Customer Account
                </Text>
                <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11.5, color: 'rgba(255, 255, 255, 0.9)', textAlign: 'center', maxWidth: 380, lineHeight: 15 }}>
                  Unlock reward points, masterclass access, and priority dispatches.
                </Text>
              </View>
            </View>

        {/* 3. Feedback Banners */}
        {errorMessage ? (
          <View style={{ backgroundColor: 'rgba(220, 38, 38, 0.08)', borderWidth: 1, borderColor: 'rgba(220, 38, 38, 0.3)', borderRadius: 16, padding: 14, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <AlertCircle size={20} color="#DC2626" />
            <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, color: '#DC2626', fontSize: 13, flex: 1, lineHeight: 18 }}>
              {errorMessage}
            </Text>
          </View>
        ) : null}

        {successMessage ? (
          <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.3)', borderRadius: 16, padding: 14, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <CheckCircle2 size={20} color="#059669" />
            <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, color: '#059669', fontSize: 13, flex: 1, lineHeight: 18 }}>
              {successMessage}
            </Text>
          </View>
        ) : null}

        {/* 4. Registration Form Card */}
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(197, 168, 128, 0.3)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 14, gap: 16 }}>
          
          {/* First Name & Last Name */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: '#002754', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
                First Name *
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.45)', borderRadius: 14, paddingHorizontal: 12, height: 48, backgroundColor: '#FAFAFC' }}>
                <User size={16} color="#737781" />
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Priya"
                  placeholderTextColor="#94A3B8"
                  style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 14, color: '#002754', flex: 1 }}
                />
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: '#002754', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
                Last Name *
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.45)', borderRadius: 14, paddingHorizontal: 12, height: 48, backgroundColor: '#FAFAFC' }}>
                <User size={16} color="#737781" />
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Sharma"
                  placeholderTextColor="#94A3B8"
                  style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 14, color: '#002754', flex: 1 }}
                />
              </View>
            </View>
          </View>

          {/* Email Address */}
          <View>
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: '#002754', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
              Email Address *
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.45)', borderRadius: 14, paddingHorizontal: 14, height: 48, backgroundColor: '#FAFAFC' }}>
              <Mail size={18} color="#737781" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="priya.sharma@example.com"
                placeholderTextColor="#94A3B8"
                style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 14, color: '#002754', flex: 1 }}
              />
            </View>
          </View>

          {/* Mobile Phone (Optional) */}
          <View>
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: '#002754', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
              Mobile Phone (Optional)
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.45)', borderRadius: 14, paddingHorizontal: 14, height: 48, backgroundColor: '#FAFAFC' }}>
              <Phone size={18} color="#737781" />
              <TextInput
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="98765 43210"
                placeholderTextColor="#94A3B8"
                style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 14, color: '#002754', flex: 1 }}
              />
            </View>
          </View>

          {/* Password & Confirm Password */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: '#002754', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
                Password *
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.45)', borderRadius: 14, paddingHorizontal: 10, height: 48, backgroundColor: '#FAFAFC' }}>
                <Lock size={16} color="#737781" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="Min 6 chars"
                  placeholderTextColor="#94A3B8"
                  style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 13, color: '#002754', flex: 1 }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 2 }}>
                  {showPassword ? <EyeOff size={16} color="#737781" /> : <Eye size={16} color="#737781" />}
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: '#002754', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
                Confirm Password *
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.45)', borderRadius: 14, paddingHorizontal: 10, height: 48, backgroundColor: '#FAFAFC' }}>
                <Lock size={16} color="#737781" />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  placeholder="Re-enter"
                  placeholderTextColor="#94A3B8"
                  style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 13, color: '#002754', flex: 1 }}
                />
              </View>
            </View>
          </View>

          {/* Submit CTA */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={registerMutation.isPending}
            activeOpacity={0.8}
            style={{ backgroundColor: '#002754', borderRadius: 16, height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 8, shadowColor: '#002754', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 }}
          >
            {registerMutation.isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>
                Create CINMAX VIP Account →
              </Text>
            )}
          </TouchableOpacity>

          <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'center', gap: 6, alignItems: 'center' }}>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#737781' }}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login' as any)}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, color: '#C5A880' }}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 5. Trust Badges */}
        <View style={{ marginTop: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={16} color="#C5A880" />
            <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 11, color: '#64748B' }}>Secure Connection</Text>
          </View>
          <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1' }} />
          <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 11, color: '#64748B' }}>Official CINMAX Authenticated</Text>
        </View>
      </ScrollView>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
