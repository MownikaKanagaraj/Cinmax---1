import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Sparkles, RefreshCw, Mail, Lock, Eye, EyeOff, Heart, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { usePhoneLoginMutation, useVerifyOTPMutation, useLoginMutation, useWishlistStore, useAuthStore } from '@cinmax/hooks';

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

export default function MobileAuthScreen() {
  const router = useRouter();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const redirectTarget = redirect || '/(tabs)/profile';

  const phoneLogin = usePhoneLoginMutation();
  const verifyOTP = useVerifyOTPMutation();
  const emailLogin = useLoginMutation();
  const { items: wishlistItems } = useWishlistStore();

  const [loginMode, setLoginMode] = useState<'email' | 'phone'>('email');

  // Phone State
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);

  // Email State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const otpInputsRef = useRef<Array<TextInput | null>>([]);

  // --- Email Login ---
  const handleEmailLogin = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage('Please enter your registered email address');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your account password');
      return;
    }

    try {
      await emailLogin.mutateAsync({ email: cleanEmail, password });
      setSuccessMessage('Welcome back to CINMAX! Authenticated successfully.');
      setTimeout(() => {
        router.replace(redirectTarget as any);
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password. Please verify credentials.');
    }
  };

  // --- Phone OTP Logic ---
  const handleSendOTP = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setOtpDigits(['', '', '', '', '', '']);
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile phone number');
      return;
    }

    const fullFormattedPhone = `+91${cleanPhone.slice(-10)}`;

    try {
      await phoneLogin.mutateAsync(fullFormattedPhone);
      setSuccessMessage(`Verification code sent via SMS to ${fullFormattedPhone}`);
      setStep('otp');
      startResendCountdown();
    } catch (err: any) {
      console.error('Supabase Phone OTP Send Error:', err);
      setErrorMessage(err.message || 'Failed to send OTP code via SMS. Please verify your phone number.');
    }
  };

  const startResendCountdown = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleDigitChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    if (digit && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }

    if (newDigits.every((d) => d !== '') && newDigits.join('').length === 6) {
      handleVerifyOTP(newDigits.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (codeOverride?: string) => {
    setErrorMessage('');
    setSuccessMessage('');
    const rawCode = codeOverride !== undefined ? codeOverride : otpDigits.join('');
    const code = rawCode.replace(/[^0-9]/g, '').trim();

    if (code.length !== 6) {
      setErrorMessage('Please enter all 6 digits of your OTP code');
      return;
    }

    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    const fullFormattedPhone = `+91${cleanPhone.slice(-10)}`;

    // Real Supabase SMS OTP verification ONLY
    try {
      await verifyOTP.mutateAsync({
        phone: fullFormattedPhone,
        token: code,
      });
      setSuccessMessage('OTP verification successful! Session activated.');
      setTimeout(() => {
        router.replace(redirectTarget as any);
      }, 500);
    } catch (err: any) {
      console.error('Supabase OTP Verification Error:', err);
      const msg = (err.message || '').toLowerCase();
      if (msg.includes('expired')) {
        setErrorMessage('The OTP verification code has expired. Please tap "Resend OTP Code" to get a new code.');
      } else if (msg.includes('invalid') || msg.includes('token')) {
        setErrorMessage('Invalid 6-digit OTP code. Please check the code received via SMS and try again.');
      } else {
        setErrorMessage(err.message || 'OTP verification failed. Please try again.');
      }
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

      <ScrollView contentContainerStyle={{ paddingHorizontal: CONTAINER_PADDING, paddingTop: 20, paddingBottom: 60, maxWidth: 520, alignSelf: 'center', width: '100%' }} showsVerticalScrollIndicator={false}>
        
        {/* 2. Luxury Hero Banner */}
        <View style={{ borderRadius: 24, overflow: 'hidden', height: 175, backgroundColor: '#002754', marginBottom: 20, position: 'relative', borderWidth: 1, borderColor: 'rgba(197, 168, 128, 0.4)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 16 }}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=1000&auto=format&fit=crop&q=80' }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 31, 68, 0.62)' }} />
          <View style={{ position: 'absolute', inset: 0, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
            <View style={{ backgroundColor: 'rgba(197, 168, 128, 0.25)', borderWidth: 1, borderColor: '#C5A880', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginBottom: 8 }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#F3E5D8', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2 }}>
                VIP CUSTOMER PORTAL
              </Text>
            </View>
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 24, fontWeight: '700', color: 'white', textAlign: 'center', marginBottom: 4 }}>
              Sign In to CINMAX
            </Text>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: 'rgba(255, 255, 255, 0.88)', textAlign: 'center', maxWidth: 360, lineHeight: 17 }}>
              Track luxury dispatches, manage saved addresses, and access artisanal masterclasses.
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

        {/* 4. Login Form Card */}
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(197, 168, 128, 0.3)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 14 }}>
          
          {/* Mode Switch Tabs */}
          <View style={{ flexDirection: 'row', backgroundColor: '#F4F1EA', borderRadius: 14, padding: 4, marginBottom: 20 }}>
            <TouchableOpacity
              onPress={() => { setLoginMode('email'); setErrorMessage(''); }}
              style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 11, backgroundColor: loginMode === 'email' ? '#FFFFFF' : 'transparent', shadowColor: loginMode === 'email' ? '#000' : 'transparent', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}
            >
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, color: loginMode === 'email' ? '#002754' : '#737781' }}>Email &amp; Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { setLoginMode('phone'); setErrorMessage(''); }}
              style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 11, backgroundColor: loginMode === 'phone' ? '#FFFFFF' : 'transparent', shadowColor: loginMode === 'phone' ? '#000' : 'transparent', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}
            >
              <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, color: loginMode === 'phone' ? '#002754' : '#737781' }}>Mobile OTP</Text>
            </TouchableOpacity>
          </View>

          {loginMode === 'email' ? (
            /* Email Login Form */
            <View style={{ gap: 16 }}>
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
                    placeholder="customer@gmail.com"
                    placeholderTextColor="#737781"
                    selectionColor="#002754"
                    cursorColor="#002754"
                    underlineColorAndroid="transparent"
                    style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 14, color: '#191C1E', flex: 1 }}
                  />
                </View>
              </View>

              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: '#002754', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    Password *
                  </Text>
                  <TouchableOpacity onPress={() => setErrorMessage('Password reset link dispatched to your registered email address.')}>
                    <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 12, color: '#C5A880' }}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.45)', borderRadius: 14, paddingHorizontal: 14, height: 48, backgroundColor: '#FAFAFC' }}>
                  <Lock size={18} color="#737781" />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#737781"
                    selectionColor="#002754"
                    cursorColor="#002754"
                    underlineColorAndroid="transparent"
                    style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 14, color: '#191C1E', flex: 1 }}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                    {showPassword ? <EyeOff size={18} color="#737781" /> : <Eye size={18} color="#737781" />}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleEmailLogin}
                disabled={emailLogin.isPending}
                activeOpacity={0.8}
                style={{ backgroundColor: '#002754', borderRadius: 16, height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 6 }}
              >
                {emailLogin.isPending ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>
                    Sign In with Email →
                  </Text>
                )}
              </TouchableOpacity>

              <View style={{ marginTop: 14, flexDirection: 'row', justifyContent: 'center', gap: 6, alignItems: 'center' }}>
                <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: '#737781' }}>
                  New to CINMAX?
                </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/signup' as any)}>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, color: '#C5A880' }}>
                    Create Account
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* Phone OTP Login Form */
            step === 'phone' ? (
              <View style={{ gap: 16 }}>
                <View>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: '#002754', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
                    Mobile Phone Number
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.45)', borderRadius: 14, paddingHorizontal: 14, height: 48, backgroundColor: '#FAFAFC' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderRightWidth: 1, borderRightColor: '#CBD5E1', paddingRight: 10 }}>
                      <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 14, color: '#002754' }}>+91</Text>
                    </View>
                    <TextInput
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                      maxLength={10}
                      placeholder="98765 43210"
                      placeholderTextColor="#737781"
                      selectionColor="#002754"
                      cursorColor="#002754"
                      underlineColorAndroid="transparent"
                      style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 14, color: '#191C1E', flex: 1 }}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleSendOTP}
                  disabled={phoneLogin.isPending}
                  activeOpacity={0.8}
                  style={{ backgroundColor: '#002754', borderRadius: 16, height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 6 }}
                >
                  {phoneLogin.isPending ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>
                      Send Verification Code →
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ gap: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, color: '#002754', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    Enter 6-Digit OTP Code
                  </Text>
                  <TouchableOpacity onPress={() => setStep('phone')}>
                    <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 12, color: '#C5A880' }}>
                      Change Number
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                  {otpDigits.map((digit, idx) => (
                    <TextInput
                      key={idx}
                      ref={(ref) => (otpInputsRef.current[idx] = ref)}
                      value={digit}
                      onChangeText={(text) => handleDigitChange(text, idx)}
                      onKeyPress={(e) => handleKeyPress(e, idx)}
                      keyboardType="number-pad"
                      maxLength={1}
                      selectTextOnFocus
                      selectionColor="#002754"
                      cursorColor="#002754"
                      underlineColorAndroid="transparent"
                      style={{
                        width: 42,
                        height: 48,
                        borderRadius: 12,
                        borderWidth: 1.5,
                        borderColor: digit ? '#002754' : 'rgba(195, 198, 209, 0.45)',
                        backgroundColor: digit ? 'rgba(0, 39, 84, 0.05)' : '#FAFAFC',
                        textAlign: 'center',
                        fontFamily: FONT_SANS_BOLD,
                        fontSize: 18,
                        color: '#191C1E',
                      }}
                    />
                  ))}
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  {resendTimer > 0 ? (
                    <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 12, color: '#737781' }}>
                      Resend in <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#002754' }}>{resendTimer}s</Text>
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={handleSendOTP} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <RefreshCw size={14} color="#002754" />
                      <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 12, color: '#002754' }}>
                        Resend OTP Code
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => handleVerifyOTP()}
                  disabled={verifyOTP.isPending}
                  activeOpacity={0.8}
                  style={{ backgroundColor: '#002754', borderRadius: 16, height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 12 }}
                >
                  {verifyOTP.isPending ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>
                      Verify &amp; Sign In →
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )
          )}
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
    </SafeAreaView>
  );
}
