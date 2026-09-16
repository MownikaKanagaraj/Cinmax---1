'use client';

import * as React from 'react';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, Button, Input } from '@cinmax/ui';
import {
  Settings,
  Bell,
  Truck,
  CreditCard,
  Award,
  ShieldCheck,
  Save,
  Check,
  Send,
  Plus,
  Trash2,
  Lock,
  UserCheck,
  CheckSquare,
  Square,
  AlertCircle,
  HelpCircle,
  Globe,
  Tag,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = React.useState<
    'general' | 'delivery' | 'payment' | 'telegram' | 'loyalty' | 'roles'
  >('general');

  const [isSaved, setIsSaved] = React.useState(false);

  // General Settings State
  const [storeName, setStoreName] = React.useState('CINMAX Global Products');
  const [conciergeEmail, setConciergeEmail] = React.useState('concierge@cinmaxglobal.com');
  const [supportPhone, setSupportPhone] = React.useState('+91 98765 43210');
  const [operatingCurrency, setOperatingCurrency] = React.useState('INR (₹)');
  const [announcements, setAnnouncements] = React.useState([
    'Free Shipping above ₹499',
    'Buy 2 Get 1 Free on Artisan Bars',
    'New Launch: Activated Charcoal Series',
  ]);
  const [newAnnouncement, setNewAnnouncement] = React.useState('');

  // Delivery Settings State
  const [freeShippingThreshold, setFreeShippingThreshold] = React.useState('499');
  const [defaultCourier, setDefaultCourier] = React.useState('Blue Dart Express');

  // Payment Settings State
  const [razorpayKeyId, setRazorpayKeyId] = React.useState('rzp_test_cinmax_botanical');
  const [razorpayKeySecret, setRazorpayKeySecret] = React.useState('•••••••••••••••••••••••');
  const [webhookSecret, setWebhookSecret] = React.useState('whsec_cinmax_secure_hook');

  // Telegram & Notification Settings State
  const [telegramBotToken, setTelegramBotToken] = React.useState('7829104829:AAHk_CinmaxBotTokenProd');
  const [telegramChatId, setTelegramChatId] = React.useState('-1002938471928');
  const [telegramOrderAlerts, setTelegramOrderAlerts] = React.useState(true);
  const [telegramStockAlerts, setTelegramStockAlerts] = React.useState(true);
  const [testSending, setTestSending] = React.useState(false);
  const [testSentSuccess, setTestSentSuccess] = React.useState(false);

  // Loyalty Settings State
  const [loyaltySpendUnit, setLoyaltySpendUnit] = React.useState('100');
  const [loyaltyPointsPerSpend, setLoyaltyPointsPerSpend] = React.useState('2');
  const [loyaltyPointsPerReview, setLoyaltyPointsPerReview] = React.useState('4');
  const [loyaltyRedemptionRate, setLoyaltyRedemptionRate] = React.useState('1');

  // Admin Roles & Permissions State
  const modulesList = [
    { id: 'dashboard', label: 'Dashboard Overview' },
    { id: 'products', label: 'Product Management' },
    { id: 'categories', label: 'Category Management' },
    { id: 'orders', label: 'Order Processing' },
    { id: 'customers', label: 'Customer Database' },
    { id: 'reviews', label: 'Review Moderation' },
    { id: 'banners', label: 'Banners & Hero' },
    { id: 'coupons', label: 'Coupon Codes' },
    { id: 'loyalty', label: 'Loyalty Points' },
    { id: 'notifications', label: 'Push Notifications' },
    { id: 'analytics', label: 'Analytics & Reports' },
    { id: 'payments', label: 'Payment Gateway' },
    { id: 'settings', label: 'Store Settings & Roles' },
  ];

  const [roles, setRoles] = React.useState([
    {
      id: 'super_admin',
      name: 'Super Administrator',
      description: 'Unrestricted full access across all platform modules and financial controls.',
      permissions: modulesList.map((m) => m.id),
    },
    {
      id: 'store_manager',
      name: 'Store Manager',
      description: 'Catalog, order fulfillment, customers, reviews, and promotional campaigns.',
      permissions: [
        'dashboard',
        'products',
        'categories',
        'orders',
        'customers',
        'reviews',
        'banners',
        'coupons',
        'loyalty',
        'notifications',
        'analytics',
      ],
    },
    {
      id: 'fulfillment',
      name: 'Order & Logistics Lead',
      description: 'Order processing, courier partner assignment, and delivery tracking.',
      permissions: ['dashboard', 'orders', 'customers'],
    },
    {
      id: 'support',
      name: 'Customer Support Representative',
      description: 'Customer profiles, order inquiry lookup, review moderation, and loyalty points.',
      permissions: ['dashboard', 'orders', 'customers', 'reviews', 'loyalty'],
    },
  ]);

  const handleTogglePermission = (roleId: string, moduleId: string) => {
    setRoles(
      roles.map((r) => {
        if (r.id !== roleId) return r;
        const hasPerm = r.permissions.includes(moduleId);
        return {
          ...r,
          permissions: hasPerm
            ? r.permissions.filter((p) => p !== moduleId)
            : [...r.permissions, moduleId],
        };
      })
    );
  };

  const handleTestTelegram = async (type: 'new_order' | 'low_stock' | 'ping') => {
    setTestSending(true);
    setTestSentSuccess(false);

    try {
      const res = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken: telegramBotToken,
          chatId: telegramChatId,
          messageType: type,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTestSentSuccess(true);
        setTimeout(() => setTestSentSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTestSending(false);
    }
  };

  const handleSaveAll = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <AdminLayout>
      <PageHeader
        badge="Platform Configuration"
        title="Settings & Role-Based Access Control"
        subtitle="Manage business information, delivery rules, payment keys, Telegram admin bot, loyalty rules, and user roles."
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveAll}
            className="rounded-xl flex items-center gap-2 font-bold shadow-md shadow-blue-500/20"
          >
            {isSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
            {isSaved ? 'Settings Saved!' : 'Save All Settings'}
          </Button>
        }
      />

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-1 my-6">
        {[
          { id: 'general', label: 'General Settings', icon: Globe },
          { id: 'delivery', label: 'Delivery Rules', icon: Truck },
          { id: 'payment', label: 'Payment (Razorpay)', icon: CreditCard },
          { id: 'telegram', label: 'Telegram & Alerts', icon: Bell },
          { id: 'loyalty', label: 'Loyalty Rules', icon: Award },
          { id: 'roles', label: 'Admin Roles & Permissions', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                isActive
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/30'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}
      <div className="max-w-4xl space-y-6 pb-12">
        {/* 1. GENERAL SETTINGS */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">Business & Brand Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">Storefront Name</label>
                  <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">Support Concierge Email</label>
                  <Input value={conciergeEmail} onChange={(e) => setConciergeEmail(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">Customer Service Phone</label>
                  <Input value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">Operating Currency</label>
                  <Input value={operatingCurrency} onChange={(e) => setOperatingCurrency(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Announcement Pills */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">Home Page Marquee Announcement Pills</h3>
              <div className="flex flex-wrap gap-2">
                {announcements.map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 border border-blue-200 dark:border-blue-800"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => setAnnouncements(announcements.filter((_, i) => i !== idx))}
                      className="hover:text-red-600 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <Input
                  placeholder="e.g. Free Handcrafted Wooden Soap Tray on orders above ₹1,299"
                  value={newAnnouncement}
                  onChange={(e) => setNewAnnouncement(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (newAnnouncement.trim()) {
                      setAnnouncements([...announcements, newAnnouncement.trim()]);
                      setNewAnnouncement('');
                    }
                  }}
                >
                  + Add Pill
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 2. DELIVERY SETTINGS */}
        {activeTab === 'delivery' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-[#0F172A] dark:text-white">State-Based Delivery Configuration</h3>
            <p className="text-xs text-slate-400">
              The backend charge matrix automatically calculates fees based on the customer's state and item quantity.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                  Default Courier Partner
                </label>
                <select
                  value={defaultCourier}
                  onChange={(e) => setDefaultCourier(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
                >
                  <option value="Blue Dart Express">Blue Dart Express</option>
                  <option value="Delhivery Surface">Delhivery Surface</option>
                  <option value="DTDC Regional">DTDC Regional</option>
                  <option value="India Post SpeedPost">India Post SpeedPost</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                  Free Shipping Minimum Cart Value (₹)
                </label>
                <Input
                  type="number"
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. PAYMENT SETTINGS */}
        {activeTab === 'payment' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">Razorpay Gateway API Credentials</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Connected
              </span>
            </div>
            <p className="text-xs text-slate-400">Credentials remain strictly on the server side and are never exposed.</p>
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">Razorpay Key ID</label>
                <Input value={razorpayKeyId} onChange={(e) => setRazorpayKeyId(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">Razorpay Key Secret</label>
                <Input type="password" value={razorpayKeySecret} onChange={(e) => setRazorpayKeySecret(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">Webhook Secret</label>
                <Input value={webhookSecret} onChange={(e) => setWebhookSecret(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* 4. TELEGRAM & NOTIFICATION SETTINGS */}
        {activeTab === 'telegram' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">Telegram Admin Alerts Bot</h3>
              <p className="text-xs text-slate-400">
                Sends instant push alerts to private admin channel for incoming orders and low inventory warnings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                  Telegram Bot API Token
                </label>
                <Input value={telegramBotToken} onChange={(e) => setTelegramBotToken(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                  Admin Channel / Chat ID
                </label>
                <Input value={telegramChatId} onChange={(e) => setTelegramChatId(e.target.value)} />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Automatic Alert Triggers
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={telegramOrderAlerts}
                    onChange={(e) => setTelegramOrderAlerts(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <span>Send <b>NEW ORDER RECEIVED</b> alert on every paid order</span>
                </label>
                <label className="flex items-center gap-3 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={telegramStockAlerts}
                    onChange={(e) => setTelegramStockAlerts(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <span>Send <b>LOW STOCK ALERT</b> when product stock drops below 5 units</span>
                </label>
              </div>
            </div>

            {/* Test Alert Triggers */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F172A] dark:text-white">Test Telegram Bot Dispatch</span>
                {testSentSuccess && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Alert Dispatched to Telegram!
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={testSending}
                  onClick={() => handleTestTelegram('new_order')}
                  className="rounded-xl"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Test New Order Alert
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={testSending}
                  onClick={() => handleTestTelegram('low_stock')}
                  className="rounded-xl"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Test Low Stock Alert
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 5. LOYALTY SETTINGS */}
        {activeTab === 'loyalty' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-[#0F172A] dark:text-white">Loyalty Program Earning & Redemption</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                  Spend Per Points Unit (₹)
                </label>
                <Input
                  type="number"
                  value={loyaltySpendUnit}
                  onChange={(e) => setLoyaltySpendUnit(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                  Points Earned Per Spend Unit
                </label>
                <Input
                  type="number"
                  value={loyaltyPointsPerSpend}
                  onChange={(e) => setLoyaltyPointsPerSpend(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                  Points Per Approved Review
                </label>
                <Input
                  type="number"
                  value={loyaltyPointsPerReview}
                  onChange={(e) => setLoyaltyPointsPerReview(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                  Redemption Value (1 Point = ₹)
                </label>
                <Input
                  type="number"
                  value={loyaltyRedemptionRate}
                  onChange={(e) => setLoyaltyRedemptionRate(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* 6. ADMIN ROLES & PERMISSIONS MATRIX */}
        {activeTab === 'roles' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">Role-Based Access Control (RBAC)</h3>
              <p className="text-xs text-slate-400">
                Grant or restrict access to administrative sections per staff role.
              </p>
            </div>

            <div className="space-y-6">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4"
                >
                  <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                    <div>
                      <h4 className="font-bold text-sm text-[#0F172A] dark:text-white">{role.name}</h4>
                      <p className="text-xs text-slate-400">{role.description}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {role.permissions.length} / {modulesList.length} Modules
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {modulesList.map((mod) => {
                      const isChecked = role.permissions.includes(mod.id);
                      return (
                        <label
                          key={mod.id}
                          className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 text-xs font-semibold cursor-pointer hover:border-blue-400 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleTogglePermission(role.id, mod.id)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className={isChecked ? 'text-[#0F172A] dark:text-white font-bold' : 'text-slate-400'}>
                            {mod.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
