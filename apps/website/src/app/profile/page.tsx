'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { CartDrawer } from '../../components/cart-drawer';
import { Container, PageHeader, Breadcrumb, Badge, Button } from '@cinmax/ui';
import {
  useUser,
  useLogout,
  useOrdersQuery,
  useAddressesQuery,
  useCouponsQuery,
  useUserLoyaltySummaryQuery,
} from '@cinmax/hooks';
import { Package, MapPin, Ticket, Bell, Sparkles, ArrowRight, ShieldCheck, LogOut } from 'lucide-react';
import { LuxuryUserIcon } from '../../components/luxury-icons';

import { calculateLoyaltyProgress, formatCurrency } from '@cinmax/utils';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useUser();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  React.useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  // Real Supabase Domain Queries with React Query caching
  const { data: ordersData, isLoading: isOrdersLoading } = useOrdersQuery(undefined, undefined, {
    enabled: Boolean(user?.id),
  });
  const { data: addresses = [], isLoading: isAddressesLoading } = useAddressesQuery(user?.id, {
    enabled: Boolean(user?.id),
  });
  const { data: coupons = [] } = useCouponsQuery();
  const { data: loyaltySummary, isLoading: isTxLoading } = useUserLoyaltySummaryQuery(user?.id);

  const transactions = loyaltySummary?.transactions || [];
  const orders = ordersData?.items || [];
  const pointsBalance = loyaltySummary?.pointsBalance ?? (user?.loyaltyPoints ?? 0);

  const loyaltyDetails = calculateLoyaltyProgress(pointsBalance);
  const userTier = loyaltyDetails.tierLabel;

  // Derived notification alerts based on real order status changes
  const activeOrderAlerts = orders.filter((o) => {
    const s = String(o.status || '').toLowerCase();
    return s === 'processing' || s === 'shipped' || s === 'confirmed' || s === 'in_transit' || s === 'packed' || s === 'out_for_delivery' || s === 'paid' || s === 'pending';
  }).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />
      <CartDrawer />

      <main className="flex-1 py-10">
        <Container size="xl">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Customer Account', isCurrent: true },
            ]}
          />

          <PageHeader
            badge="CINMAX VIP Atelier"
            title={`Welcome back, ${user?.firstName || 'Valued Customer'}`}
            subtitle="Manage your profile, active order dispatches, saved addresses, and botanical privilege rewards."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {/* Account Card */}
            <div className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-16 rounded-full bg-[#002754] text-[#C5A880] flex items-center justify-center font-serif text-2xl font-bold shadow-md border border-[#C5A880]/30 shrink-0">
                    {user?.firstName?.[0] || 'C'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif font-bold text-lg text-[#002754] dark:text-white truncate">
                      {user?.firstName || 'Valued'} {user?.lastName || 'Customer'}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                      {user?.email || 'customer@cinmax.com'}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                      <Badge variant="gold" className="font-extrabold text-[10px] tracking-wider uppercase">
                        {userTier}
                      </Badge>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-all disabled:opacity-50 shrink-0"
                  title="Check-Out / Sign Out of website session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{logoutMutation.isPending ? 'Signing Out...' : 'Check-Out'}</span>
                </button>
              </div>

              {/* Smart Loyalty Rewards Display */}
              <div className="pt-4 border-t border-[#0A3D78]/10 space-y-3 bg-[#F7F9FB] dark:bg-[#0A192F]/60 p-4 rounded-2xl">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#002754] dark:text-[#C5A880] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                    Smart Loyalty Rewards
                  </span>
                  <span className="font-extrabold text-sm text-[#002754] dark:text-[#C5A880]">
                    {pointsBalance} Pts
                  </span>
                </div>

                {/* Tier Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                    <span>{loyaltyDetails.tierLabel} ({loyaltyDetails.multiplier}x)</span>
                    <span>{loyaltyDetails.nextTierLabel ? `${loyaltyDetails.progressPercent}%` : 'Apex Tier'}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#002754] via-[#C5A880] to-emerald-500 transition-all duration-500 rounded-full"
                      style={{ width: `${loyaltyDetails.progressPercent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 pt-0.5">
                    {loyaltyDetails.nextTierLabel
                      ? `${loyaltyDetails.pointsToNextTier} pts remaining to reach ${loyaltyDetails.nextTierLabel}`
                      : 'You have reached the highest tier!'}
                  </p>
                </div>

                {/* Redeemable Value & CTA */}
                <div className="pt-2 border-t border-[#0A3D78]/10 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground font-medium">
                    Value: <strong className="text-emerald-600 dark:text-emerald-400">₹{loyaltyDetails.redeemableValueRupees}</strong> (1 Pt = ₹1)
                  </span>
                  <Link
                    href="/shop"
                    className="text-[11px] font-bold text-[#002754] dark:text-[#C5A880] hover:underline flex items-center gap-1"
                  >
                    Redeem at Checkout →
                  </Link>
                </div>
              </div>
            </div>


            {/* Quick Navigation Cards Grid */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Orders & Receipts */}
              <Link
                href="/orders"
                className="group p-6 rounded-[22px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 hover:border-[#002754] dark:hover:border-[#C5A880] transition-all space-y-3 block shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-[#002754]/8 dark:bg-white/10 text-[#002754] dark:text-[#C5A880] flex items-center justify-center group-hover:bg-[#002754] group-hover:text-white transition-all">
                    <Package className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#002754] text-white font-mono font-bold text-xs">
                    {isOrdersLoading ? '...' : `${orders.length} ${orders.length === 1 ? 'Order' : 'Orders'}`}
                  </span>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#002754] dark:text-white flex items-center justify-between">
                    Orders &amp; Receipts
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#002754] dark:group-hover:text-[#C5A880] group-hover:translate-x-1 transition-all" />
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Track real-time dispatches, AWB numbers, and historical invoices.
                  </p>
                </div>
              </Link>

              {/* 2. Saved Addresses */}
              <Link
                href="/profile/addresses"
                className="group p-6 rounded-[22px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 hover:border-[#002754] dark:hover:border-[#C5A880] transition-all space-y-3 block shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-[#002754]/8 dark:bg-white/10 text-[#002754] dark:text-[#C5A880] flex items-center justify-center group-hover:bg-[#002754] group-hover:text-white transition-all">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#002754] text-white font-mono font-bold text-xs">
                    {isAddressesLoading ? '...' : `${addresses.length} ${addresses.length === 1 ? 'Address' : 'Addresses'}`}
                  </span>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#002754] dark:text-white flex items-center justify-between">
                    Saved Addresses
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#002754] dark:group-hover:text-[#C5A880] group-hover:translate-x-1 transition-all" />
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Manage primary shipping destinations for rapid one-click checkout.
                  </p>
                </div>
              </Link>

              {/* 3. Coupons & Passes */}
              <Link
                href="/profile/coupons"
                className="group p-6 rounded-[22px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 hover:border-[#002754] dark:hover:border-[#C5A880] transition-all space-y-3 block shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-[#002754]/8 dark:bg-white/10 text-[#002754] dark:text-[#C5A880] flex items-center justify-center group-hover:bg-[#002754] group-hover:text-white transition-all">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#C5A880] text-[#002754] font-mono font-bold text-xs">
                    {coupons.length} Active Codes
                  </span>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#002754] dark:text-white flex items-center justify-between">
                    Coupons &amp; Passes
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#002754] dark:group-hover:text-[#C5A880] group-hover:translate-x-1 transition-all" />
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Access privilege promo codes and copy discounts for checkout.
                  </p>
                </div>
              </Link>

              {/* 4. Notifications */}
              <Link
                href="/profile/notifications"
                className="group p-6 rounded-[22px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 hover:border-[#002754] dark:hover:border-[#C5A880] transition-all space-y-3 block shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-[#002754]/8 dark:bg-white/10 text-[#002754] dark:text-[#C5A880] flex items-center justify-center group-hover:bg-[#002754] group-hover:text-white transition-all">
                    <Bell className="w-5 h-5" />
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full font-mono font-bold text-xs ${
                      activeOrderAlerts > 0
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {activeOrderAlerts > 0 ? `${activeOrderAlerts} In-Transit` : 'All Clear'}
                  </span>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#002754] dark:text-white flex items-center justify-between">
                    Notifications
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#002754] dark:group-hover:text-[#C5A880] group-hover:translate-x-1 transition-all" />
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Real-time alerts on dispatch milestones and courier tracking.
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Loyalty Points Transaction History Ledger */}
          <div className="mt-10 p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-4 border-[#0A3D78]/10">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#002754] dark:text-white">
                  Loyalty Points Transaction History
                </h3>
                <p className="text-xs text-muted-foreground">
                  Detailed ledger of all points earned, redeemed, and rewarded
                </p>
              </div>
              <div className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-bold border border-amber-500/20">
                1 Point = ₹1 Discount
              </div>
            </div>

            {isTxLoading ? (
              <p className="text-xs text-muted-foreground py-4 text-center">Loading loyalty transactions history...</p>
            ) : transactions.length === 0 ? (
              <div className="py-8 text-center space-y-1">
                <p className="text-sm font-semibold text-muted-foreground">No loyalty transactions recorded yet.</p>
                <p className="text-xs text-muted-foreground">Complete orders or leave approved product reviews to start earning points!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#0A3D78]/10 text-muted-foreground uppercase tracking-wider font-bold">
                    <tr>
                      <th className="pb-3">Event Type</th>
                      <th className="pb-3">Description</th>
                      <th className="pb-3">Points Delta</th>
                      <th className="pb-3">Balance After</th>
                      <th className="pb-3 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0A3D78]/10">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-[#0A192F]/50 transition-colors">
                        <td className="py-3 font-bold">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                              tx.transactionType === 'EARN' || tx.transactionType === 'REVIEW' || tx.transactionType === 'REFUND_RESTORE'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                                : 'bg-red-50 text-red-700 dark:bg-red-950/80 dark:text-red-300'
                            }`}
                          >
                            {tx.transactionType.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 text-muted-foreground font-medium">{tx.description}</td>
                        <td className="py-3 font-mono font-bold">
                          <span className={tx.points > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                            {tx.points > 0 ? `+${tx.points}` : tx.points} Pts
                          </span>
                        </td>
                        <td className="py-3 font-mono font-bold">{tx.balanceAfter} Pts</td>
                        <td className="py-3 text-right text-muted-foreground">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}

