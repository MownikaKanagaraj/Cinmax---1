'use client';

import * as React from 'react';
import { AdminLayout } from '../../components/admin-layout';
import { Button } from '@cinmax/ui';
import { useHomeMarketingQuery, useUpdateHomeMarketingMutation } from '@cinmax/hooks';
import type {
  HomeMarketingSettings,
  HeroBannerItem,
  WatchShopVideoItem,
  TransformationStoryItem,
  TrustBadgeItem,
} from '@cinmax/types';
import {
  Sliders,
  Video,
  Image as ImageIcon,
  Award,
  Plus,
  Trash2,
  Save,
  Check,
  Tag,
  Sparkles,
  Star,
  RefreshCw,
  Eye,
  Link,
  Layers,
  CheckCircle2,
  Globe,
  Radio,
  ArrowRight,
} from 'lucide-react';

export default function AdminHomePageManager() {
  const { data: marketingData, isLoading } = useHomeMarketingQuery();
  const updateMarketingMutation = useUpdateHomeMarketingMutation();

  const [activeSection, setActiveSection] = React.useState<
    'marquee' | 'hero' | 'reals' | 'mid_banner' | 'real_results' | 'why_choose' | 'bottom_banner'
  >('hero');
  const [isSaved, setIsSaved] = React.useState(false);
  const [showLivePreview, setShowLivePreview] = React.useState(false);

  // Local form state
  const [formData, setFormData] = React.useState<Partial<HomeMarketingSettings>>({});
  const [newOfferText, setNewOfferText] = React.useState('');

  React.useEffect(() => {
    if (marketingData) {
      setFormData(marketingData);
    }
  }, [marketingData]);

  if (isLoading || !formData.topOffers) {
    return (
      <AdminLayout>
        <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          <span className="font-semibold text-sm tracking-wide">Initializing Corporate Home Page Control Center...</span>
        </div>
      </AdminLayout>
    );
  }

  const handlePublishAll = async () => {
    await updateMarketingMutation.mutateAsync(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Item Addition Handlers
  const handleAddHeroBanner = () => {
    const newItem: HeroBannerItem = {
      id: `hb_${Date.now()}`,
      title: 'New Executive Promo Campaign',
      subtitle: 'Artisan hand-crafted soaps & botanical skin wellness.',
      imageUrl: 'https://images.unsplash.com/photo-1607006314147-759088fd21c2?w=1200&auto=format&fit=crop&q=80',
      badgeText: 'New Cure Release',
      buttonText: 'Shop Collection',
      linkUrl: '/shop',
      isActive: true,
    };
    setFormData({
      ...formData,
      heroBanners: [...(formData.heroBanners || []), newItem],
    });
  };

  const handleAddWatchReal = () => {
    const newItem: WatchShopVideoItem = {
      id: `v_${Date.now()}`,
      slug: 'herbal-soap',
      title: 'Herbal Soap Reel',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-skin-care-product-routine-42901-large.mp4',
      productName: 'Organic Herbal Soap',
      productPrice: '₹249',
      productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC85VgeJRlaGssVKe4o5MaUTzkpQWnScMZ6g9JvCSe-AhjElgCk-Yowqs1H5yrvUiFwhlWsilPdz9OOpG1Ws6cEJPX3MqFjZYdw9mFcjU-6d2GmTnneNs0Hv4b0MNq3arAlFZt4a8TD4uN0jtZdcgrqrUYi4dEkRyGZTOfAX4Yp6YgHz-xA0zhXWRpnfIk3FrKENZ9c9b6hfKS6VNogJjs5ByDdGYS0ggxXlRgx8KWscPhk-oThH0B1',
      isActive: true,
    };
    setFormData({
      ...formData,
      watchShopVideos: [...(formData.watchShopVideos || []), newItem],
    });
  };

  const handleAddTransformationStory = () => {
    const newItem: TransformationStoryItem = {
      id: `r_${Date.now()}`,
      beforeUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5BOW-AMfn4OYmw2raRZLFjyAXl9_Og2oljlyp6Ey3blAt0F58rE21Yc2kFmrF_m8w0_bszNhtfNPcsATPHO3DTKc5-xaT7Y0ZjBW1_TNzJioa5TZURDMTRt1t9pX3z-tlGfEKQwtCCItGZeCLGFICOAr2rCVYxeE6NlxuyABQQ3_aEL3gjrXGthTSnEDu44eD7saHOsvmf4hq5dtRwLMPjiu3W-zO2yCyhMDJBYPlz9EKgQiy_WhT',
      afterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBYYqfLzkyDJCgmUIN62zfpDnVNi80xAnbOwXMzWR_EC665r4W7a8jgxawqehE-NsGCjsao-u0awGHY1IawWevNQcSWP5uOLvmXo8iVoso9HXauK_4wWL6zedipG6xSlBnZ7PvBUQQw8SDi5OQEIzGlroqvATlo8emGKQmNpZkYbPTV5kb74HCXzfWSSdwZ-feAljIXulzIuzrRfkFuPTBDYlbTWpuPRjpYWGCmJD3d7oLoTXmRmLR',
      quote: '"Visible glow and clear skin in just 2 weeks!"',
      userName: 'Satisfied Customer',
      isActive: true,
    };
    setFormData({
      ...formData,
      realResults: [...(formData.realResults || []), newItem],
    });
  };

  const handleAddTrustBadge = () => {
    const newItem: TrustBadgeItem = {
      id: `tb_${Date.now()}`,
      label: '100% Organic',
      iconName: 'Leaf',
      isActive: true,
    };
    setFormData({
      ...formData,
      trustBadges: [...(formData.trustBadges || []), newItem],
    });
  };

  const sectionsList = [
    { id: 'marquee', label: 'Top Offers & Pills', count: formData.topOffers?.length || 0, icon: Tag },
    { id: 'hero', label: 'Hero Banner Sliders', count: formData.heroBanners?.length || 0, icon: Sliders },
    { id: 'reals', label: 'Watch & Shop Reals', count: formData.watchShopVideos?.length || 0, icon: Video },
    { id: 'mid_banner', label: 'Mid-Page Promo Banner', count: 1, icon: ImageIcon },
    { id: 'real_results', label: 'Before & After Results', count: formData.realResults?.length || 0, icon: Star },
    { id: 'why_choose', label: 'Why Choose Us Badges', count: formData.trustBadges?.length || 0, icon: Award },
    { id: 'bottom_banner', label: 'Bottom Footer Banner', count: 1, icon: Sparkles },
  ];

  return (
    <AdminLayout>
      {/* CORPORATE EXECUTIVE HEADER BAR */}
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-slate-800 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                Live Mobile App Control Center
              </span>
              <span className="text-slate-400 text-xs font-mono">
                Updated: {formData.updatedAt ? new Date(formData.updatedAt).toLocaleTimeString() : 'Just now'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Home Page Marketing Command Manager
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              Centralized corporate configuration panel controlling all 7 mobile app &amp; web marketing sections in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLivePreview(!showLivePreview)}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-2 transition"
            >
              <Eye className="w-4 h-4 text-blue-400" />
              <span>{showLivePreview ? 'Hide Screen Preview' : 'Mobile Screen Preview'}</span>
            </button>
            <Button
              variant="primary"
              size="md"
              onClick={handlePublishAll}
              disabled={updateMarketingMutation.isPending}
              className="rounded-xl px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30"
            >
              {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{isSaved ? 'Published Live to Mobile App!' : 'Publish Live Changes'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* WORKSPACE LAYOUT (2 COLUMNS: NAV SIDEBAR + MAIN EDITOR FORM) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT SUB-NAVIGATION SIDEBAR */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex justify-between items-center">
              <span>Marketing Sections (7)</span>
              <span className="text-blue-500">All Live</span>
            </div>
            {sectionsList.map((sec, idx) => {
              const IconComp = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id as any)}
                  className={`w-full p-3.5 rounded-xl text-left font-bold text-xs transition-all flex items-center justify-between border ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20'
                      : 'bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-blue-500'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="leading-tight">{sec.label}</div>
                      <div className={`text-[10px] font-normal ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                        Section #{idx + 1}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive ? 'bg-white text-blue-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {sec.count} items
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT MAIN CORPORATE EDITOR PANEL */}
        <div className="lg:col-span-8 space-y-6">
          {/* SECTION 1: TOP OFFERS */}
          {activeSection === 'marquee' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <h3 className="text-base font-extrabold text-[#0F172A] dark:text-white flex items-center gap-2">
                  <Tag className="w-5 h-5 text-blue-500" />
                  <span>Section 1: Top Offer Announcement Pills</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">Promotional lines rendered in the horizontal top offer marquee bar.</p>
              </div>

              {/* Creator Form */}
              <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/60 flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Enter new offer line (e.g. Free Express Shipping on orders over ₹499)..."
                  value={newOfferText}
                  onChange={(e) => setNewOfferText(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-[#0F172A] dark:text-white focus:border-blue-500"
                />
                <button
                  onClick={() => {
                    if (!newOfferText.trim()) return;
                    setFormData({
                      ...formData,
                      topOffers: [...(formData.topOffers || []), newOfferText.trim()],
                    });
                    setNewOfferText('');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                >
                  <Plus className="w-4 h-4" /> Add Offer Pill
                </button>
              </div>

              <div className="space-y-3">
                {(formData.topOffers || []).map((offer, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                  >
                    <input
                      type="text"
                      value={offer}
                      onChange={(e) => {
                        const updated = [...(formData.topOffers || [])];
                        updated[idx] = e.target.value;
                        setFormData({ ...formData, topOffers: updated });
                      }}
                      className="flex-1 bg-transparent text-xs font-bold text-[#0F172A] dark:text-white outline-none"
                    />
                    <button
                      onClick={() => {
                        const updated = (formData.topOffers || []).filter((_, i) => i !== idx);
                        setFormData({ ...formData, topOffers: updated });
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 2: HERO SLIDERS */}
          {activeSection === 'hero' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-[#0F172A] dark:text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-blue-500" />
                    <span>Section 2: Hero Sliders &amp; Carousel Banners</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Main sliding banners displayed at the top of the mobile home screen.</p>
                </div>
                <button
                  onClick={handleAddHeroBanner}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                >
                  <Plus className="w-4 h-4" /> Add Hero Banner
                </button>
              </div>

              <div className="space-y-6">
                {(formData.heroBanners || []).map((banner, idx) => (
                  <div
                    key={banner.id}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-5 space-y-4 shadow-sm"
                  >
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-extrabold">
                          SLIDE #{idx + 1}
                        </span>
                        <span className="font-bold text-xs text-[#0F172A] dark:text-white">{banner.title || 'Untitled Banner'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={banner.isActive}
                            onChange={(e) => {
                              const updated = [...(formData.heroBanners || [])];
                              updated[idx].isActive = e.target.checked;
                              setFormData({ ...formData, heroBanners: updated });
                            }}
                            className="rounded border-slate-300 text-blue-600"
                          />
                          <span className="font-bold">Active</span>
                        </label>
                        <button
                          onClick={() => {
                            const updated = (formData.heroBanners || []).filter((_, i) => i !== idx);
                            setFormData({ ...formData, heroBanners: updated });
                          }}
                          className="text-red-500 hover:text-red-700 font-bold text-xs flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Image Preview & Input */}
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-400">Banner Image Preview &amp; URL</label>
                        <div className="h-36 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 relative border border-slate-300 dark:border-slate-700">
                          <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                        </div>
                        <input
                          type="text"
                          placeholder="Image URL (https://...)"
                          value={banner.imageUrl}
                          onChange={(e) => {
                            const updated = [...(formData.heroBanners || [])];
                            updated[idx].imageUrl = e.target.value;
                            setFormData({ ...formData, heroBanners: updated });
                          }}
                          className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none font-mono text-[#0F172A] dark:text-white"
                        />
                      </div>

                      {/* Text Fields */}
                      <div className="space-y-3 md:col-span-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-400 mb-1">Banner Title</label>
                            <input
                              type="text"
                              value={banner.title}
                              onChange={(e) => {
                                const updated = [...(formData.heroBanners || [])];
                                updated[idx].title = e.target.value;
                                setFormData({ ...formData, heroBanners: updated });
                              }}
                              className="w-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none text-[#0F172A] dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-400 mb-1">Badge Tag Text</label>
                            <input
                              type="text"
                              value={banner.badgeText || ''}
                              onChange={(e) => {
                                const updated = [...(formData.heroBanners || [])];
                                updated[idx].badgeText = e.target.value;
                                setFormData({ ...formData, heroBanners: updated });
                              }}
                              className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none text-[#0F172A] dark:text-white font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">Subtitle / Short Description</label>
                          <input
                            type="text"
                            value={banner.subtitle}
                            onChange={(e) => {
                              const updated = [...(formData.heroBanners || [])];
                              updated[idx].subtitle = e.target.value;
                              setFormData({ ...formData, heroBanners: updated });
                            }}
                            className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none text-[#0F172A] dark:text-white"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-400 mb-1">Button CTA Label</label>
                            <input
                              type="text"
                              value={banner.buttonText}
                              onChange={(e) => {
                                const updated = [...(formData.heroBanners || [])];
                                updated[idx].buttonText = e.target.value;
                                setFormData({ ...formData, heroBanners: updated });
                              }}
                              className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none text-blue-600 font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-400 mb-1">Target Link URL</label>
                            <input
                              type="text"
                              value={banner.linkUrl}
                              onChange={(e) => {
                                const updated = [...(formData.heroBanners || [])];
                                updated[idx].linkUrl = e.target.value;
                                setFormData({ ...formData, heroBanners: updated });
                              }}
                              className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none font-mono text-[#0F172A] dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: WATCH & SHOP */}
          {activeSection === 'reals' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-[#0F172A] dark:text-white flex items-center gap-2">
                    <Video className="w-5 h-5 text-blue-500" />
                    <span>Section 3: Watch &amp; Shop Video Reals</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Interactive video reels with direct buy product overlays.</p>
                </div>
                <button
                  onClick={handleAddWatchReal}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                >
                  <Plus className="w-4 h-4" /> Add Video Reel
                </button>
              </div>

              <div className="space-y-5">
                {(formData.watchShopVideos || []).map((real, idx) => (
                  <div
                    key={real.id}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-5 space-y-4"
                  >
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                      <span className="font-bold text-xs text-[#0F172A] dark:text-white">Video Reel #{idx + 1}: {real.title}</span>
                      <button
                        onClick={() => {
                          const updated = (formData.watchShopVideos || []).filter((_, i) => i !== idx);
                          setFormData({ ...formData, watchShopVideos: updated });
                        }}
                        className="text-red-500 hover:text-red-700 font-bold text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Delete Reel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Reel Title</label>
                        <input
                          type="text"
                          value={real.title}
                          onChange={(e) => {
                            const updated = [...(formData.watchShopVideos || [])];
                            updated[idx].title = e.target.value;
                            setFormData({ ...formData, watchShopVideos: updated });
                          }}
                          className="w-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 rounded-xl p-2.5 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Product Name</label>
                        <input
                          type="text"
                          value={real.productName}
                          onChange={(e) => {
                            const updated = [...(formData.watchShopVideos || [])];
                            updated[idx].productName = e.target.value;
                            setFormData({ ...formData, watchShopVideos: updated });
                          }}
                          className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 rounded-xl p-2.5 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Price Tag</label>
                        <input
                          type="text"
                          value={real.productPrice}
                          onChange={(e) => {
                            const updated = [...(formData.watchShopVideos || [])];
                            updated[idx].productPrice = e.target.value;
                            setFormData({ ...formData, watchShopVideos: updated });
                          }}
                          className="w-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 rounded-xl p-2.5 outline-none text-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Thumbnail Cover Image</label>
                        <input
                          type="text"
                          value={real.productImage}
                          onChange={(e) => {
                            const updated = [...(formData.watchShopVideos || [])];
                            updated[idx].productImage = e.target.value;
                            setFormData({ ...formData, watchShopVideos: updated });
                          }}
                          className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 rounded-xl p-2.5 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: MID-PAGE BANNER */}
          {activeSection === 'mid_banner' && formData.midBanner && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <h3 className="text-base font-extrabold text-[#0F172A] dark:text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue-500" />
                  <span>Section 4: Static Mid-Page Promo Banner (Placed Below Best Sellers)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">Featured promotional banner section shown right below Best Sellers on the mobile home page.</p>
              </div>

              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Banner Title / Headline</label>
                  <input
                    type="text"
                    value={formData.midBanner.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        midBanner: { ...formData.midBanner!, title: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Sub-heading</label>
                  <input
                    type="text"
                    value={formData.midBanner.subtitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        midBanner: { ...formData.midBanner!, subtitle: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Button Call-To-Action</label>
                    <input
                      type="text"
                      value={formData.midBanner.buttonText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          midBanner: { ...formData.midBanner!, buttonText: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 outline-none font-bold text-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Target Link URL</label>
                    <input
                      type="text"
                      value={formData.midBanner.linkUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          midBanner: { ...formData.midBanner!, linkUrl: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: REAL RESULTS */}
          {activeSection === 'real_results' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-[#0F172A] dark:text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-blue-500" />
                    <span>Section 5: Real Results (Before &amp; After Transformations)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Customer transformation stories with before/after photos and testimonial quotes.</p>
                </div>
                <button
                  onClick={handleAddTransformationStory}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                >
                  <Plus className="w-4 h-4" /> Add Story
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {(formData.realResults || []).map((story, idx) => (
                  <div
                    key={story.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs">Story #{idx + 1}</span>
                      <button
                        onClick={() => {
                          const updated = (formData.realResults || []).filter((_, i) => i !== idx);
                          setFormData({ ...formData, realResults: updated });
                        }}
                        className="text-red-500 hover:text-red-700 font-bold text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 h-28">
                      <div className="relative rounded-xl overflow-hidden border border-slate-300">
                        <img src={story.beforeUrl} alt="Before" className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">Before</span>
                      </div>
                      <div className="relative rounded-xl overflow-hidden border border-slate-300">
                        <img src={story.afterUrl} alt="After" className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded">After</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Customer Quote / Feedback</label>
                      <input
                        type="text"
                        value={story.quote}
                        onChange={(e) => {
                          const updated = [...(formData.realResults || [])];
                          updated[idx].quote = e.target.value;
                          setFormData({ ...formData, realResults: updated });
                        }}
                        className="w-full font-bold text-xs bg-white dark:bg-slate-800 border border-slate-200 rounded-xl p-2.5 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Customer Name &amp; Product Used</label>
                      <input
                        type="text"
                        value={story.userName}
                        onChange={(e) => {
                          const updated = [...(formData.realResults || [])];
                          updated[idx].userName = e.target.value;
                          setFormData({ ...formData, realResults: updated });
                        }}
                        className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 rounded-xl p-2.5 outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 6: WHY CHOOSE US */}
          {activeSection === 'why_choose' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-[#0F172A] dark:text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-500" />
                    <span>Section 6: Why Choose CINMAX Feature Badges</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Value proposition badges displayed to build customer trust on the mobile app home page.</p>
                </div>
                <button
                  onClick={handleAddTrustBadge}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                >
                  <Plus className="w-4 h-4" /> Add Trust Badge
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(formData.trustBadges || []).map((badge, idx) => (
                  <div
                    key={badge.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-3"
                  >
                    <input
                      type="text"
                      value={badge.label}
                      onChange={(e) => {
                        const updated = [...(formData.trustBadges || [])];
                        updated[idx].label = e.target.value;
                        setFormData({ ...formData, trustBadges: updated });
                      }}
                      className="font-bold text-xs bg-white dark:bg-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[#0F172A] dark:text-white flex-1"
                    />
                    <button
                      onClick={() => {
                        const updated = (formData.trustBadges || []).filter((_, i) => i !== idx);
                        setFormData({ ...formData, trustBadges: updated });
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 7: BOTTOM BANNER */}
          {activeSection === 'bottom_banner' && formData.bottomBanner && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <h3 className="text-base font-extrabold text-[#0F172A] dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  <span>Section 7: Bottom Home Page Manufacturing &amp; Quality Banner</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">Bottom promotional banner shown right before the mobile footer navigation.</p>
              </div>

              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Headline</label>
                  <input
                    type="text"
                    value={formData.bottomBanner.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bottomBanner: { ...formData.bottomBanner!, title: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Sub-heading</label>
                  <input
                    type="text"
                    value={formData.bottomBanner.subtitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bottomBanner: { ...formData.bottomBanner!, subtitle: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Button CTA Text</label>
                  <input
                    type="text"
                    value={formData.bottomBanner.buttonText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bottomBanner: { ...formData.bottomBanner!, buttonText: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 outline-none font-bold text-blue-600"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
