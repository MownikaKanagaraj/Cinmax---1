'use client';

import * as React from 'react';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, Button, Badge } from '@cinmax/ui';
import {
  useBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} from '@cinmax/hooks';
import { Sliders, Plus, Edit2, Trash2, Eye, EyeOff, Check, X, ArrowUp, ArrowDown } from 'lucide-react';

export default function AdminBannersPage() {
  const { data: banners = [], isLoading } = useBannersQuery(false);
  const createBanner = useCreateBannerMutation();
  const updateBanner = useUpdateBannerMutation();
  const deleteBanner = useDeleteBannerMutation();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    title: '',
    subtitle: '',
    badgeText: 'Special Release',
    imageUrl: 'https://images.unsplash.com/photo-1607006314147-759088fd21c2?w=1600&auto=format&fit=crop&q=80',
    ctaText: 'Shop Collection',
    ctaLink: '/shop',
    backgroundColor: '#002754',
    isActive: true,
    sortOrder: 1,
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      subtitle: '',
      badgeText: 'New Cure Release',
      imageUrl: 'https://images.unsplash.com/photo-1607006314147-759088fd21c2?w=1600&auto=format&fit=crop&q=80',
      ctaText: 'Explore Saponified Bars',
      ctaLink: '/shop',
      backgroundColor: '#002754',
      isActive: true,
      sortOrder: banners.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: any) => {
    setEditingId(b.id);
    setFormData({
      title: b.title || '',
      subtitle: b.subtitle || '',
      badgeText: b.badgeText || '',
      imageUrl: b.imageUrl || '',
      ctaText: b.ctaText || 'Shop Now',
      ctaLink: b.ctaLink || '/shop',
      backgroundColor: b.backgroundColor || '#002754',
      isActive: b.isActive ?? true,
      sortOrder: b.sortOrder || 1,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateBanner.mutate({ id: editingId, updates: formData }, {
        onSuccess: () => setIsModalOpen(false),
      });
    } else {
      createBanner.mutate(formData, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    updateBanner.mutate({ id, updates: { isActive: !currentStatus } });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this hero banner?')) {
      deleteBanner.mutate(id);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        badge="Storefront Marketing"
        title="Hero Banner & Slider Controller"
        subtitle="Configure auto-sliding promotional hero banners rendered across Mobile and Web Storefronts."
        actions={
          <Button variant="primary" size="sm" className="rounded-full flex items-center gap-2" onClick={handleOpenCreate}>
            <Plus className="w-4 h-4" /> Add Hero Banner
          </Button>
        }
      />

      {/* Main Grid: Left Banner List & Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
        
        {/* Left 2 Cols: Banners List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#C5A880]" /> Active Slider Sequence ({banners.length})
            </h3>
            <span className="text-xs text-muted-foreground">Auto-slides every 4 seconds on frontend</span>
          </div>

          {isLoading ? (
            <div className="p-8 bg-white dark:bg-[#071324] rounded-2xl border border-[#0A3D78]/10 text-center text-sm text-slate-500">
              Loading hero banner sequence...
            </div>
          ) : banners.length === 0 ? (
            <div className="p-12 bg-white dark:bg-[#071324] rounded-2xl border border-[#0A3D78]/10 text-center space-y-3">
              <p className="text-sm font-semibold text-[#002754]">No hero banners configured yet.</p>
              <Button variant="outline" size="sm" onClick={handleOpenCreate}>
                + Add Your First Hero Banner
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {banners.map((banner, idx) => (
                <div
                  key={banner.id}
                  className={`p-4 rounded-2xl bg-white dark:bg-[#071324] border transition-all flex flex-col sm:flex-row items-center gap-4 shadow-sm ${
                    banner.isActive ? 'border-[#002754]/20' : 'border-slate-200 opacity-60'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="w-full sm:w-28 h-20 rounded-xl overflow-hidden bg-slate-100 relative flex-shrink-0">
                    <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                    <span className="absolute top-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Info Details */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                      {banner.badgeText && (
                        <span className="bg-[#C5A880]/20 text-[#002754] dark:text-[#C5A880] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {banner.badgeText}
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${banner.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {banner.isActive ? 'Active Slide' : 'Hidden'}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-[#002754] dark:text-white truncate">
                      {banner.title}
                    </h4>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {banner.subtitle}
                    </p>
                    <p className="text-[11px] text-[#0A3D78] font-semibold mt-1">
                      CTA: {banner.ctaText} → <span className="font-mono text-slate-400">{banner.ctaLink}</span>
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleToggleActive(banner.id, banner.isActive)}
                      className={`p-2 rounded-xl border transition-colors ${
                        banner.isActive
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                      }`}
                      title={banner.isActive ? 'Hide Banner' : 'Activate Banner'}
                    >
                      {banner.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleOpenEdit(banner)}
                      className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 dark:text-white"
                      title="Edit Banner"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="p-2 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                      title="Delete Banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Live Banner Mobile/Web Mock Preview */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
            📱 Live Slider Preview
          </h3>
          
          <div className="p-4 rounded-3xl bg-[#002754] border border-[#C5A880]/40 text-white shadow-xl space-y-4 relative overflow-hidden">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900">
              <img
                src={banners[0]?.imageUrl || 'https://images.unsplash.com/photo-1607006314147-759088fd21c2?w=1600&auto=format&fit=crop&q=80'}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002754]/90 via-[#002754]/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-4 text-center space-y-2">
                <span className="bg-[#C5A880] text-[#002754] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {banners[0]?.badgeText || 'SPECIAL RELEASE'}
                </span>
                <h4 className="font-serif font-bold text-base text-white leading-tight">
                  {banners[0]?.title || 'French Green Clay & Eucalyptus'}
                </h4>
                <p className="text-[11px] text-white/80 line-clamp-2">
                  {banners[0]?.subtitle || 'Artisan slow-cured saponification with wild ingredients.'}
                </p>
                <div className="pt-1">
                  <span className="inline-block bg-[#0A3D78] border border-white/20 text-white text-[11px] font-semibold px-4 py-1.5 rounded-full">
                    {banners[0]?.ctaText || 'Shop Collection'}
                  </span>
                </div>
                {/* Dots indicator */}
                <div className="flex justify-center gap-1.5 pt-2">
                  <div className="w-4 h-1 rounded-full bg-white" />
                  <div className="w-1 h-1 rounded-full bg-white/40" />
                  <div className="w-1 h-1 rounded-full bg-white/40" />
                </div>
              </div>
            </div>

            <div className="bg-white/10 p-3 rounded-xl text-center space-y-1">
              <p className="text-xs font-semibold text-[#C5A880]">Real-Time Sync Active</p>
              <p className="text-[10px] text-white/70">
                Any modifications saved here immediately slide automatically on the storefront &amp; mobile app.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Edit / Create Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#071324] rounded-3xl p-6 max-w-xl w-full border border-[#0A3D78]/20 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
              <h3 className="font-serif text-xl font-bold text-[#002754] dark:text-white">
                {editingId ? 'Edit Hero Banner' : 'Add New Hero Banner'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                    Banner Main Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. French Green Clay & Eucalyptus Bar"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                    Subtitle Description
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g. 40-Day Slow Cured Artisan Saponification"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                    Badge Pill Text
                  </label>
                  <input
                    type="text"
                    value={formData.badgeText}
                    onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                    placeholder="e.g. New Cure Release"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    placeholder="e.g. Discover Blend"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                    CTA Target Link
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ctaLink}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    placeholder="e.g. /shop or /product/slug"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                    Sort Sequence Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                    Background High-Res Image URL
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <label className="flex items-center gap-2 text-sm font-semibold text-[#002754] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-[#002754]"
                  />
                  Activate Slide in Carousel Immediately
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  {editingId ? 'Save Changes' : 'Publish Banner Slide'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
