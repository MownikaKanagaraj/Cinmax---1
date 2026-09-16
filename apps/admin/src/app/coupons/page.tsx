'use client';

import * as React from 'react';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, Badge, Button } from '@cinmax/ui';
import { formatCurrency } from '@cinmax/utils';
import { useCouponsQuery, useDeactivateCouponMutation } from '@cinmax/hooks';
import type { Coupon } from '@cinmax/types';
import {
  Ticket,
  Plus,
  Percent,
  Calendar,
  CheckCircle2,
  Trash2,
  Edit2,
  Search,
  X,
  Sparkles,
  TrendingUp,
  Tag,
} from 'lucide-react';

export default function AdminCouponsPage() {
  const { data: serverCoupons = [] } = useCouponsQuery();
  const deactivateMutation = useDeactivateCouponMutation();

  const [coupons, setCoupons] = React.useState<Coupon[]>([
    {
      id: 'cpn_1',
      code: 'CINMAX100',
      title: 'Welcome First Order Discount',
      description: 'Get ₹100 flat discount on your first botanical order over ₹499.',
      discountType: 'fixed_amount',
      discountValue: 100,
      minOrderAmount: 499,
      maxDiscountAmount: 100,
      usageLimit: 500,
      usageCount: 142,
      startDate: '2026-01-01T00:00:00Z',
      endDate: '2026-12-31T23:59:59Z',
      isActive: true,
    },
    {
      id: 'cpn_2',
      code: 'BOTANICAL15',
      title: 'Monsoon Cleanse Special',
      description: '15% off across all handmade Cold Process soaps.',
      discountType: 'percentage',
      discountValue: 15,
      minOrderAmount: 799,
      maxDiscountAmount: 300,
      usageLimit: 250,
      usageCount: 88,
      startDate: '2026-08-01T00:00:00Z',
      endDate: '2026-08-31T23:59:59Z',
      isActive: true,
    },
    {
      id: 'cpn_3',
      code: 'FREESHIP',
      title: 'Complimentary Express Delivery',
      description: 'Free shipping on orders with 3 or more artisan soap bars.',
      discountType: 'free_shipping',
      discountValue: 0,
      minOrderAmount: 399,
      usageLimit: 1000,
      usageCount: 312,
      startDate: '2026-06-01T00:00:00Z',
      endDate: '2026-12-31T23:59:59Z',
      isActive: true,
    },
  ]);

  const [search, setSearch] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCoupon, setEditingCoupon] = React.useState<Coupon | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);

  // Form State
  const [formData, setFormData] = React.useState({
    code: '',
    title: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed_amount' | 'free_shipping',
    discountValue: '10',
    minOrderAmount: '499',
    maxDiscountAmount: '200',
    usageLimit: '200',
    isActive: true,
  });

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: '10',
      minOrderAmount: '499',
      maxDiscountAmount: '200',
      usageLimit: '200',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Coupon) => {
    setEditingCoupon(c);
    setFormData({
      code: c.code,
      title: (c as any).title || '',
      description: (c as any).description || '',
      discountType: c.discountType,
      discountValue: String(c.discountValue),
      minOrderAmount: String(c.minOrderAmount || 499),
      maxDiscountAmount: String((c as any).maxDiscountAmount || 200),
      usageLimit: String(c.usageLimit || 200),
      isActive: c.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) return;

    const formattedCode = formData.code.trim().toUpperCase().replace(/\s+/g, '');

    if (editingCoupon) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === editingCoupon.id
            ? {
                ...c,
                code: formattedCode,
                title: formData.title,
                description: formData.description,
                discountType: formData.discountType,
                discountValue: parseFloat(formData.discountValue) || 0,
                minOrderAmount: parseFloat(formData.minOrderAmount) || 0,
                maxDiscountAmount: parseFloat(formData.maxDiscountAmount) || 0,
                usageLimit: parseInt(formData.usageLimit, 10) || 100,
                isActive: formData.isActive,
              }
            : c
        )
      );
    } else {
      const newCpn: Coupon = {
        id: `cpn_${Date.now()}`,
        code: formattedCode,
        title: formData.title,
        description: formData.description,
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue) || 0,
        minOrderAmount: parseFloat(formData.minOrderAmount) || 0,
        maxDiscountAmount: parseFloat(formData.maxDiscountAmount) || 0,
        usageLimit: parseInt(formData.usageLimit, 10) || 100,
        usageCount: 0,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        isActive: formData.isActive,
      };
      setCoupons((prev) => [newCpn, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleToggleActive = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const handleDelete = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    setDeleteConfirmId(null);
  };

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      ((c as any).title && (c as any).title.toLowerCase().includes(search.toLowerCase()))
  );

  const activeCount = coupons.filter((c) => c.isActive !== false).length;
  const totalRedeemed = coupons.reduce((acc, c) => acc + (c.usageCount || 0), 0);

  return (
    <AdminLayout>
      <PageHeader
        badge="Promotions Engine"
        title="Discount Coupons & Promotional Passes"
        subtitle="Create discount voucher campaigns, set minimum cart requirements, cap maximum discounts, and track redemptions."
        actions={
          <Button
            variant="primary"
            size="sm"
            className="rounded-xl flex items-center gap-2 font-bold shadow-md shadow-blue-500/20"
            onClick={handleOpenAdd}
          >
            <Plus className="w-4 h-4" /> Issue New Coupon
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Promo Codes</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{activeCount} Campaigns</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
            <Ticket className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Redemptions</p>
            <p className="text-2xl font-black text-[#0F172A] dark:text-white mt-1">{totalRedeemed} Uses</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Average Patron Savings</p>
            <p className="text-2xl font-black text-amber-500 dark:text-amber-400 mt-1">₹145.00</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-500 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800">
            <Percent className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-3 mb-6 max-w-md shadow-sm">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search coupon code or campaign..."
          className="w-full text-xs bg-transparent outline-none text-[#0F172A] dark:text-white placeholder-slate-400 font-medium"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-xs text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Coupons Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="pb-3">Coupon Code &amp; Campaign</th>
                <th className="pb-3">Discount Type</th>
                <th className="pb-3">Discount Value</th>
                <th className="pb-3">Min Order</th>
                <th className="pb-3">Usage Limit</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredCoupons.map((c: Coupon) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
                        {c.code}
                      </span>
                    </div>
                    <p className="font-bold text-xs text-[#0F172A] dark:text-white mt-1">
                      {(c as any).title || 'Seasonal Promotional Pass'}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate max-w-xs">
                      {(c as any).description || 'Special store discount'}
                    </p>
                  </td>

                  <td className="py-4">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      {c.discountType === 'percentage'
                        ? 'Percentage %'
                        : c.discountType === 'fixed_amount'
                        ? 'Flat ₹ Off'
                        : 'Free Shipping'}
                    </span>
                  </td>

                  <td className="py-4 font-bold text-xs text-[#0F172A] dark:text-white">
                    {c.discountType === 'percentage'
                      ? `${c.discountValue}% OFF`
                      : c.discountType === 'fixed_amount'
                      ? `₹${c.discountValue} OFF`
                      : 'FREE DELIVERY'}
                  </td>

                  <td className="py-4 text-slate-600 dark:text-slate-300 font-medium">
                    ₹{c.minOrderAmount || 0}
                  </td>

                  <td className="py-4">
                    <p className="font-bold text-xs text-[#0F172A] dark:text-white">
                      {c.usageCount || 0} / {c.usageLimit || '∞'}
                    </p>
                    <div className="w-24 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mt-1 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            ((c.usageCount || 0) / (c.usageLimit || 100)) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </td>

                  <td className="py-4">
                    <button
                      onClick={() => handleToggleActive(c.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                        c.isActive !== false
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {c.isActive !== false ? 'Active' : 'Paused'}
                    </button>
                  </td>

                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                        title="Edit Coupon"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(c.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                  {editingCoupon ? 'Edit Coupon Voucher' : 'Issue New Coupon Code'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure discount formula, cart thresholds, and usage limits.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
                    Coupon Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., CINMAXVIP"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#0F172A] dark:text-white outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#0F172A] dark:text-white outline-none focus:border-blue-600"
                  >
                    <option value="percentage">Percentage (% Off)</option>
                    <option value="fixed_amount">Fixed Amount (₹ Off)</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
                    Discount Value ({formData.discountType === 'percentage' ? '%' : '₹'})
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    placeholder="10"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#0F172A] dark:text-white outline-none focus:border-blue-600 font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
                    Min Order Requirement (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    placeholder="499"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#0F172A] dark:text-white outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                    placeholder="200"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#0F172A] dark:text-white outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
                    Total Redemption Limit
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="200"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#0F172A] dark:text-white outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
                  Campaign Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Festive Botanical Celebration Pass"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#0F172A] dark:text-white outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
                  Terms / Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description shown to patrons at checkout..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#0F172A] dark:text-white outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="couponActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300"
                />
                <label htmlFor="couponActive" className="text-xs font-bold text-[#0F172A] dark:text-white cursor-pointer select-none">
                  Enable coupon immediately for customer checkout
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20"
                >
                  {editingCoupon ? 'Update Coupon' : 'Issue Coupon Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-[#0F172A] dark:text-white">Delete Coupon Voucher?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to permanently delete this coupon? Customers will no longer be able to redeem it.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

