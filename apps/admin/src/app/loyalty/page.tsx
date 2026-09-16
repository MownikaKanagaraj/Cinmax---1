'use client';

import * as React from 'react';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, Button, Input } from '@cinmax/ui';
import { formatCurrency } from '@cinmax/utils';
import { useAdminLoyaltyLedgerQuery } from '@cinmax/hooks';
import {
  Award,
  TrendingUp,
  ShoppingBag,
  Star,
  Coins,
  ShieldCheck,
  Check,
  Save,
  Users,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  AlertCircle,
  Plus,
} from 'lucide-react';

interface LoyaltyTransaction {
  id: string;
  customerName: string;
  customerEmail: string;
  type: 'ORDER_EARNED' | 'REVIEW_EARNED' | 'REDEMPTION' | 'ADMIN_BONUS';
  points: number;
  referenceId: string;
  date: string;
  status: 'COMPLETED' | 'DUPLICATE_PREVENTED';
}

interface TopCustomer {
  id: string;
  name: string;
  email: string;
  balance: number;
  lifetimeEarned: number;
  totalSpent: number;
  tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
}

export default function LoyaltyManagementPage() {
  const { data: ledgerData, isLoading } = useAdminLoyaltyLedgerQuery();

  // State for Master Controls & Rules
  const [programEnabled, setProgramEnabled] = React.useState(true);
  const [purchaseEarnEnabled, setPurchaseEarnEnabled] = React.useState(true);
  const [reviewEarnEnabled, setReviewEarnEnabled] = React.useState(true);
  const [redemptionEnabled, setRedemptionEnabled] = React.useState(true);

  // Earning Values
  const [spendPerPointUnit, setSpendPerPointUnit] = React.useState('1');
  const [pointsPerSpendUnit, setPointsPerSpendUnit] = React.useState('1');
  const [pointsPerReview, setPointsPerReview] = React.useState('4');
  const [rupeesPerPoint, setRupeesPerPoint] = React.useState('1');

  const [isSaved, setIsSaved] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterType, setFilterType] = React.useState('ALL');

  const transactions = ledgerData?.transactions || [];
  const topCustomers = ledgerData?.topCustomers || [];

  // Summary Metrics
  const totalEarnedPoints = transactions
    .filter((t: any) => t.points > 0)
    .reduce((sum: number, t: any) => sum + t.points, 0);

  const totalRedeemedPoints = Math.abs(
    transactions
      .filter((t: any) => t.points < 0)
      .reduce((sum: number, t: any) => sum + t.points, 0)
  );

  const totalActiveBalance = topCustomers.reduce((sum: number, c: any) => sum + c.balance, 0);

  const handleSaveRules = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const filteredTransactions = transactions.filter((tx: any) => {
    const matchesSearch =
      (tx.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.customerEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.referenceId || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'ALL' || tx.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout>
      <PageHeader
        badge="Marketing & Retention"
        title="Loyalty Points Program"
        subtitle="Manage customer reward points earning rules, redemption values, automatic event processing, and live ledger."
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveRules}
            className="rounded-xl flex items-center gap-2 font-bold shadow-md shadow-blue-500/20"
          >
            {isSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
            {isSaved ? 'Rules Saved!' : 'Save Loyalty Rules'}
          </Button>
        }
      />

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Points Earned</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white">{totalEarnedPoints.toLocaleString()} pts</h3>
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Live ledger tracked
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Points Redeemed</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white">{totalRedeemedPoints.toLocaleString()} pts</h3>
          <p className="text-[11px] font-semibold text-slate-500">₹{totalRedeemedPoints.toLocaleString()} store discounts given</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Point Balance</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white">{totalActiveBalance.toLocaleString()} pts</h3>
          <p className="text-[11px] font-semibold text-slate-500">In customer digital wallets</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Loyalty Members</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200 dark:border-purple-800">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white">{topCustomers.length} Customers</h3>
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Registered member profiles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
        {/* Master Program Controls & Rules (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Rules Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Loyalty Rules & Earning Engine</h3>
                  <p className="text-xs text-slate-400">Configure spend-to-points ratio and review rewards</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={programEnabled}
                  onChange={(e) => setProgramEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                <span className="ml-2 text-xs font-bold text-[#0F172A] dark:text-white">
                  {programEnabled ? 'Program Active' : 'Program Paused'}
                </span>
              </label>
            </div>

            {/* Rule 1: Order Purchase Earning */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold text-[#0F172A] dark:text-white">1. Order Purchase Points</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={purchaseEarnEnabled}
                    onChange={(e) => setPurchaseEarnEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className="text-[11px] text-slate-500">
                Triggered automatically when an order status reaches <b>Delivered</b>.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">For Every Amount Spent (₹)</label>
                  <Input
                    value={spendPerPointUnit}
                    onChange={(e) => setSpendPerPointUnit(e.target.value)}
                    type="number"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Customer Earns (Points)</label>
                  <Input
                    value={pointsPerSpendUnit}
                    onChange={(e) => setPointsPerSpendUnit(e.target.value)}
                    type="number"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/40 text-[11px] font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <span>Example: ₹{spendPerPointUnit} spent → {pointsPerSpendUnit} loyalty points awarded. (Order ₹1,000 → {Number(spendPerPointUnit) > 0 ? (1000 / Number(spendPerPointUnit)) * Number(pointsPerSpendUnit) : 0} pts)</span>
              </div>
            </div>

            {/* Rule 2: Review Approval Earning */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-[#0F172A] dark:text-white">2. Product Review Points</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reviewEarnEnabled}
                    onChange={(e) => setReviewEarnEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className="text-[11px] text-slate-500">
                Triggered when admin <b>Approves</b> a verified product review. Duplicate awards are automatically blocked.
              </p>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Points Awarded Per Approved Review</label>
                <Input
                  value={pointsPerReview}
                  onChange={(e) => setPointsPerReview(e.target.value)}
                  type="number"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Rule 3: Redemption Value */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-[#0F172A] dark:text-white">3. Checkout Point Redemption</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={redemptionEnabled}
                    onChange={(e) => setRedemptionEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className="text-[11px] text-slate-500">
                Determines how much discount in Rupees 1 point is worth at checkout.
              </p>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Redemption Value (1 Point = ₹)</label>
                <Input
                  value={rupeesPerPoint}
                  onChange={(e) => setRupeesPerPoint(e.target.value)}
                  type="number"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top Loyalty Customers (1 col) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">Top Loyalty Customers</h3>
              <p className="text-[11px] text-slate-400">High-value brand advocates</p>
            </div>
            <Award className="w-4 h-4 text-amber-500" />
          </div>

          <div className="space-y-3">
            {topCustomers.map((cust: any) => (
              <div
                key={cust.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-[#0F172A] dark:text-white truncate">{cust.name}</p>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {cust.tier}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">{cust.email}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-[#0F172A] dark:text-white">{cust.balance}</span>
                  <span className="text-[10px] font-bold text-slate-400 block">points</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2 text-[11px] text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Points expire 12 months after earning date by default.</span>
          </div>
        </div>
      </div>

      {/* Real-time Loyalty Transactions Ledger */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Loyalty Transactions Ledger</h3>
            <p className="text-xs text-slate-400">Audit trail of all points awarded, redeemed, and duplicate checks</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search customer / order..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-300"
            >
              <option value="ALL">All Types</option>
              <option value="ORDER_EARNED">Order Purchases</option>
              <option value="REVIEW_EARNED">Product Reviews</option>
              <option value="REDEMPTION">Redemptions</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="pb-3">Transaction ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Event Type</th>
                <th className="pb-3">Reference</th>
                <th className="pb-3">Points Delta</th>
                <th className="pb-3">Timestamp</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredTransactions.map((tx: any) => (
                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 font-mono font-bold text-slate-600 dark:text-slate-300">{tx.id}</td>
                  <td className="py-3">
                    <p className="font-bold text-[#0F172A] dark:text-white">{tx.customerName}</p>
                    <p className="text-[10px] text-slate-400">{tx.customerEmail}</p>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {tx.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 font-mono font-bold text-blue-600 dark:text-blue-400">{tx.referenceId}</td>
                  <td className="py-3 font-mono font-bold">
                    <span
                      className={
                        tx.points > 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : tx.points < 0
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-slate-400'
                      }
                    >
                      {tx.points > 0 ? `+${tx.points}` : tx.points} pts
                    </span>
                  </td>
                  <td className="py-3 text-slate-500 font-medium">{tx.date}</td>
                  <td className="py-3 text-right">
                    {tx.status === 'COMPLETED' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        Credited
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        Duplicate Blocked
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
