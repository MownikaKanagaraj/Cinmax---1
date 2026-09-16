'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { useRegisterMutation } from '@cinmax/hooks';
import { User, Mail, Phone, Lock, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

function WebSignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/profile';

  const registerMutation = useRegisterMutation();

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const [errorMessage, setErrorMessage] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    if (!cleanFirstName) {
      setErrorMessage('Please enter your First Name.');
      return;
    }

    if (!cleanLastName) {
      setErrorMessage('Please enter your Last Name.');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
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

      setSuccessMessage('Account created successfully! Redirecting...');
      setTimeout(() => {
        router.push(redirectTarget);
      }, 600);
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Registration failed. Please verify your details or try signing in.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] dark:bg-[#040C18] flex flex-col justify-between text-[#191C1E] dark:text-white">
      <Header />

      <main className="py-14 px-4 max-w-lg mx-auto w-full">
        <div className="bg-white dark:bg-[#071324] rounded-3xl border border-[#0A3D78]/15 shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-[#002754] text-white p-8 text-center space-y-2 border-b border-[#C5A880]/30">
            <div className="w-12 h-12 rounded-full bg-[#C5A880] text-[#002754] flex items-center justify-center mx-auto mb-2 shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl font-bold tracking-tight">
              Join CINMAX Privilege Circle
            </h1>
            <p className="text-xs text-white/80 max-w-xs mx-auto">
              Create a customer account to earn loyalty points, manage saved addresses, and track orders.
            </p>
          </div>

          <div className="p-8 space-y-5">
            {/* Alerts */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase tracking-wider mb-1.5">
                    First Name *
                  </label>
                  <div className="flex items-center rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 overflow-hidden">
                    <span className="px-3 py-2.5 text-slate-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Priya"
                      className="w-full pr-3 py-2.5 text-xs font-semibold text-[#002754] dark:text-white bg-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase tracking-wider mb-1.5">
                    Last Name *
                  </label>
                  <div className="flex items-center rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 overflow-hidden">
                    <span className="px-3 py-2.5 text-slate-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Sharma"
                      className="w-full pr-3 py-2.5 text-xs font-semibold text-[#002754] dark:text-white bg-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="flex items-center rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 overflow-hidden">
                  <span className="px-3.5 py-3 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="priya.sharma@example.com"
                    className="w-full pr-4 py-3 text-xs font-semibold text-[#002754] dark:text-white bg-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase tracking-wider mb-1.5">
                  Mobile Phone (Optional)
                </label>
                <div className="flex items-center rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 overflow-hidden">
                  <span className="px-3.5 py-3 text-slate-400">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full pr-4 py-3 text-xs font-semibold text-[#002754] dark:text-white bg-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase tracking-wider mb-1.5">
                    Password *
                  </label>
                  <div className="flex items-center rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 overflow-hidden pr-2">
                    <span className="pl-3 py-2.5 text-slate-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full px-2 py-2.5 text-xs font-semibold text-[#002754] dark:text-white bg-transparent outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase tracking-wider mb-1.5">
                    Confirm Password *
                  </label>
                  <div className="flex items-center rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 overflow-hidden">
                    <span className="px-3 py-2.5 text-slate-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter"
                      className="w-full pr-3 py-2.5 text-xs font-semibold text-[#002754] dark:text-white bg-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full bg-[#002754] hover:bg-[#0A3D78] text-white font-bold text-sm py-3.5 rounded-2xl transition-all shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer"
              >
                {registerMutation.isPending ? 'Creating Account...' : 'Create VIP Account →'}
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-500">
              Already have an account?{' '}
              <Link href={`/login?redirect=${encodeURIComponent(redirectTarget)}`} className="font-bold text-[#C5A880] hover:underline">
                Sign In Here
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function WebSignupPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#F7F9FB]" />}>
      <WebSignupForm />
    </React.Suspense>
  );
}
