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
  Radio,
  Upload,
  X,
  CheckCircle2,
} from 'lucide-react';

// Utility helper to convert user uploaded file to base64 Data URL
const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

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

  // Active Modal State
  const [activeModal, setActiveModal] = React.useState<
    'none' | 'add_offer' | 'add_hero' | 'add_real' | 'add_story' | 'add_badge'
  >('none');

  // Form states for modals
  const [newOfferText, setNewOfferText] = React.useState('');

  const [heroForm, setHeroForm] = React.useState({
    title: '',
    subtitle: '',
    badgeText: 'New Release',
    buttonText: 'Shop Collection',
    linkUrl: '/shop',
    imageUrl: '',
    isActive: true,
  });

  const [realForm, setRealForm] = React.useState({
    title: '',
    productName: '',
    productPrice: '₹199',
    productImage: '',
    videoUrl: '',
    slug: 'product',
    isActive: true,
  });

  const [storyForm, setStoryForm] = React.useState({
    quote: '',
    userName: '',
    beforeUrl: '',
    afterUrl: '',
    isActive: true,
  });

  const [badgeForm, setBadgeForm] = React.useState({
    label: '',
    iconName: 'Leaf',
    isActive: true,
  });

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

  // Submit Handlers for Modals
  const handleSaveHeroModal = () => {
    if (!heroForm.title.trim()) return;
    const newItem: HeroBannerItem = {
      id: `hb_${Date.now()}`,
      title: heroForm.title,
      subtitle: heroForm.subtitle,
      badgeText: heroForm.badgeText,
      buttonText: heroForm.buttonText,
      linkUrl: heroForm.linkUrl,
      imageUrl: heroForm.imageUrl || 'https://images.unsplash.com/photo-1607006314147-759088fd21c2?w=1200',
      isActive: heroForm.isActive,
    };
    setFormData({
      ...formData,
      heroBanners: [...(formData.heroBanners || []), newItem],
    });
    setHeroForm({
      title: '',
      subtitle: '',
      badgeText: 'New Release',
      buttonText: 'Shop Collection',
      linkUrl: '/shop',
      imageUrl: '',
      isActive: true,
    });
    setActiveModal('none');
  };

  const handleSaveRealModal = () => {
    if (!realForm.title.trim()) return;
    const newItem: WatchShopVideoItem = {
      id: `v_${Date.now()}`,
      title: realForm.title,
      productName: realForm.productName || realForm.title,
      productPrice: realForm.productPrice,
      productImage: realForm.productImage || 'https://images.unsplash.com/photo-1607006482140-520e7df6504a?w=400',
      videoUrl: realForm.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-skin-care-product-routine-42901-large.mp4',
      slug: realForm.slug || 'product',
      isActive: realForm.isActive,
    };
    setFormData({
      ...formData,
      watchShopVideos: [...(formData.watchShopVideos || []), newItem],
    });
    setRealForm({
      title: '',
      productName: '',
      productPrice: '₹199',
      productImage: '',
      videoUrl: '',
      slug: 'product',
      isActive: true,
    });
    setActiveModal('none');
  };

  const handleSaveStoryModal = () => {
    if (!storyForm.quote.trim()) return;
    const newItem: TransformationStoryItem = {
      id: `r_${Date.now()}`,
      quote: storyForm.quote,
      userName: storyForm.userName || 'Verified Buyer',
      beforeUrl: storyForm.beforeUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5BOW-AMfn4OYmw2raRZLFjyAXl9_Og2oljlyp6Ey3blAt0F58rE21Yc2kFmrF_m8w0_bszNhtfNPcsATPHO3DTKc5-xaT7Y0ZjBW1_TNzJioa5TZURDMTRt1t9pX3z-tlGfEKQwtCCItGZeCLGFICOAr2rCVYxeE6NlxuyABQQ3_aEL3gjrXGthTSnEDu44eD7saHOsvmf4hq5dtRwLMPjiu3W-zO2yCyhMDJBYPlz9EKgQiy_WhT',
      afterUrl: storyForm.afterUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBYYqfLzkyDJCgmUIN62zfpDnVNi80xAnbOwXMzWR_EC665r4W7a8jgxawqehE-NsGCjsao-u0awGHY1IawWevNQcSWP5uOLvmXo8iVoso9HXauK_4wWL6zedipG6xSlBnZ7PvBUQQw8SDi5OQEIzGlroqvATlo8emGKQmNpZkYbPTV5kb74HCXzfWSSdwZ-feAljIXulzIuzrRfkFuPTBDYlbTWpuPRjpYWGCmJD3d7oLoTXmRmLR',
      isActive: storyForm.isActive,
    };
    setFormData({
      ...formData,
      realResults: [...(formData.realResults || []), newItem],
    });
    setStoryForm({
      quote: '',
      userName: '',
      beforeUrl: '',
      afterUrl: '',
      isActive: true,
    });
    setActiveModal('none');
  };

  const handleSaveBadgeModal = () => {
    if (!badgeForm.label.trim()) return;
    const newItem: TrustBadgeItem = {
      id: `tb_${Date.now()}`,
      label: badgeForm.label,
      iconName: badgeForm.iconName,
      isActive: badgeForm.isActive,
    };
    setFormData({
      ...formData,
      trustBadges: [...(formData.trustBadges || []), newItem],
    });
    setBadgeForm({
      label: '',
      iconName: 'Leaf',
      isActive: true,
    });
    setActiveModal('none');
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
              Centralized corporate configuration panel with direct local image upload &amp; interactive form dialogs.
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

      {/* WORKSPACE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT SIDEBAR */}
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

        {/* RIGHT MAIN EDITOR PANEL */}
        <div className="lg:col-span-8 space-y-6">
          {/* SECTION 1: TOP OFFERS */}
          {activeSection === 'marquee' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-[#0F172A] dark:text-white flex items-center gap-2">
                    <Tag className="w-5 h-5 text-blue-500" />
                    <span>Section 1: Top Offer Announcement Pills</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Promotional lines rendered in the horizontal marquee offer bar.</p>
                </div>
                <button
                  onClick={() => setActiveModal('add_offer')}
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
                  onClick={() => setActiveModal('add_hero')}
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
                      {/* Image Preview & Direct Upload Button */}
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-400">Banner Image Upload</label>
                        <div className="h-36 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 relative border border-slate-300 dark:border-slate-700">
                          {banner.imageUrl ? (
                            <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No image</div>
                          )}
                        </div>
                        <label className="w-full px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer">
                          <Upload className="w-4 h-4" /> Change Image File
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              if (e.target.files?.[0]) {
                                const dataUrl = await fileToDataUrl(e.target.files[0]);
                                const updated = [...(formData.heroBanners || [])];
                                updated[idx].imageUrl = dataUrl;
                                setFormData({ ...formData, heroBanners: updated });
                              }
                            }}
                          />
                        </label>
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
                  onClick={() => setActiveModal('add_real')}
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
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Cover Image Upload</label>
                        <label className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 text-blue-600 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer">
                          <Upload className="w-3.5 h-3.5" /> Upload File
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              if (e.target.files?.[0]) {
                                const dataUrl = await fileToDataUrl(e.target.files[0]);
                                const updated = [...(formData.watchShopVideos || [])];
                                updated[idx].productImage = dataUrl;
                                setFormData({ ...formData, watchShopVideos: updated });
                              }
                            }}
                          />
                        </label>
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
                  <label className="block text-xs font-bold text-slate-400 mb-1">Banner Background Image Upload</label>
                  <div className="h-36 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 relative border border-slate-300 dark:border-slate-700 mb-2">
                    {formData.midBanner.imageUrl ? (
                      <img src={formData.midBanner.imageUrl} alt="Mid Banner" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No image uploaded</div>
                    )}
                  </div>
                  <label className="w-full px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-600 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer">
                    <Upload className="w-4 h-4" /> Upload Local Image File
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          const dataUrl = await fileToDataUrl(e.target.files[0]);
                          setFormData({
                            ...formData,
                            midBanner: { ...formData.midBanner!, imageUrl: dataUrl },
                          });
                        }
                      }}
                    />
                  </label>
                </div>

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
                  onClick={() => setActiveModal('add_story')}
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

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="relative rounded-xl overflow-hidden border border-slate-300 h-28 mb-1">
                          <img src={story.beforeUrl} alt="Before" className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">Before</span>
                        </div>
                        <label className="w-full py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 text-blue-600 font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer">
                          <Upload className="w-3 h-3" /> Change Before Image
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              if (e.target.files?.[0]) {
                                const dataUrl = await fileToDataUrl(e.target.files[0]);
                                const updated = [...(formData.realResults || [])];
                                updated[idx].beforeUrl = dataUrl;
                                setFormData({ ...formData, realResults: updated });
                              }
                            }}
                          />
                        </label>
                      </div>

                      <div>
                        <div className="relative rounded-xl overflow-hidden border border-slate-300 h-28 mb-1">
                          <img src={story.afterUrl} alt="After" className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded">After</span>
                        </div>
                        <label className="w-full py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 text-blue-600 font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer">
                          <Upload className="w-3 h-3" /> Change After Image
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              if (e.target.files?.[0]) {
                                const dataUrl = await fileToDataUrl(e.target.files[0]);
                                const updated = [...(formData.realResults || [])];
                                updated[idx].afterUrl = dataUrl;
                                setFormData({ ...formData, realResults: updated });
                              }
                            }}
                          />
                        </label>
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
                  onClick={() => setActiveModal('add_badge')}
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

      {/* =================================================================== */}
      {/* INTERACTIVE ADD ITEM MODAL DIALOGS */}
      {/* =================================================================== */}

      {/* MODAL 1: ADD OFFER PILL */}
      {activeModal === 'add_offer' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-[#0F172A] dark:text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-500" />
                Add Top Offer Announcement Pill
              </h3>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Offer Text</label>
              <input
                type="text"
                placeholder="e.g. Flat 25% OFF on Ayurvedic Soaps"
                value={newOfferText}
                onChange={(e) => setNewOfferText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 outline-none font-bold text-[#0F172A] dark:text-white"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setActiveModal('none')} className="px-4 py-2 rounded-xl border text-xs font-bold text-slate-500">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newOfferText.trim()) return;
                  setFormData({ ...formData, topOffers: [...(formData.topOffers || []), newOfferText.trim()] });
                  setNewOfferText('');
                  setActiveModal('none');
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                Add Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD HERO BANNER */}
      {activeModal === 'add_hero' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-[#0F172A] dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-500" />
                Add Hero Carousel Banner
              </h3>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Direct Local Image Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Banner Image File Upload</label>
              <div className="h-32 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 mb-2 relative flex items-center justify-center">
                {heroForm.imageUrl ? (
                  <img src={heroForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                    <span className="text-[11px] text-slate-400">Click below to upload image file from your device</span>
                  </div>
                )}
              </div>
              <label className="w-full px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-600 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" /> Select Local Image File
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      const dataUrl = await fileToDataUrl(e.target.files[0]);
                      setHeroForm({ ...heroForm, imageUrl: dataUrl });
                    }
                  }}
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Banner Title</label>
              <input
                type="text"
                placeholder="e.g. French Green Clay & Eucalyptus Bar"
                value={heroForm.title}
                onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Subtitle / Description</label>
              <input
                type="text"
                placeholder="e.g. Artisan cold-processed saponification, slow cured for 40 days"
                value={heroForm.subtitle}
                onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Badge Tag</label>
                <input
                  type="text"
                  placeholder="e.g. New Cure Release"
                  value={heroForm.badgeText}
                  onChange={(e) => setHeroForm({ ...heroForm, badgeText: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 dark:bg-slate-900 font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Button CTA Text</label>
                <input
                  type="text"
                  placeholder="e.g. Shop Collection"
                  value={heroForm.buttonText}
                  onChange={(e) => setHeroForm({ ...heroForm, buttonText: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 dark:bg-slate-900 font-bold text-blue-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button onClick={() => setActiveModal('none')} className="px-4 py-2 rounded-xl border text-xs font-bold text-slate-500">
                Cancel
              </button>
              <button onClick={handleSaveHeroModal} className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-600/20">
                Save Hero Banner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD WATCH & SHOP REAL */}
      {activeModal === 'add_real' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-[#0F172A] dark:text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-500" />
                Add Watch &amp; Shop Video Reel
              </h3>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Reel Title</label>
              <input
                type="text"
                placeholder="e.g. Aloe Vera Hydrating Bar Reel"
                value={realForm.title}
                onChange={(e) => setRealForm({ ...realForm, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border text-xs font-bold bg-slate-50 dark:bg-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aloe Vera Soap"
                  value={realForm.productName}
                  onChange={(e) => setRealForm({ ...realForm, productName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50 dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Price Tag</label>
                <input
                  type="text"
                  placeholder="e.g. ₹199"
                  value={realForm.productPrice}
                  onChange={(e) => setRealForm({ ...realForm, productPrice: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50 dark:bg-slate-900 font-bold text-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Product Thumbnail Image File Upload</label>
              <label className="w-full px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 text-blue-600 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" /> Upload Local Image File
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      const dataUrl = await fileToDataUrl(e.target.files[0]);
                      setRealForm({ ...realForm, productImage: dataUrl });
                    }
                  }}
                />
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button onClick={() => setActiveModal('none')} className="px-4 py-2 rounded-xl border text-xs font-bold text-slate-500">
                Cancel
              </button>
              <button onClick={handleSaveRealModal} className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-600/20">
                Save Video Reel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD BEFORE & AFTER STORY */}
      {activeModal === 'add_story' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-[#0F172A] dark:text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-blue-500" />
                Add Before &amp; After Transformation Story
              </h3>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Customer Quote / Testimonial</label>
              <input
                type="text"
                placeholder='e.g. "My acne cleared in 3 weeks!"'
                value={storyForm.quote}
                onChange={(e) => setStoryForm({ ...storyForm, quote: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border text-xs font-bold bg-slate-50 dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Customer Name &amp; Product Used</label>
              <input
                type="text"
                placeholder="e.g. Ananya V. used Neem & Tea Tree Soap"
                value={storyForm.userName}
                onChange={(e) => setStoryForm({ ...storyForm, userName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50 dark:bg-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Before Image Upload</label>
                <label className="w-full px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" /> Upload File
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      if (e.target.files?.[0]) {
                        const dataUrl = await fileToDataUrl(e.target.files[0]);
                        setStoryForm({ ...storyForm, beforeUrl: dataUrl });
                      }
                    }}
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">After Image Upload</label>
                <label className="w-full px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" /> Upload File
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      if (e.target.files?.[0]) {
                        const dataUrl = await fileToDataUrl(e.target.files[0]);
                        setStoryForm({ ...storyForm, afterUrl: dataUrl });
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button onClick={() => setActiveModal('none')} className="px-4 py-2 rounded-xl border text-xs font-bold text-slate-500">
                Cancel
              </button>
              <button onClick={handleSaveStoryModal} className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-600/20">
                Save Story
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD TRUST BADGE */}
      {activeModal === 'add_badge' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-[#0F172A] dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-500" />
                Add Trust Badge
              </h3>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Badge Label</label>
              <input
                type="text"
                placeholder="e.g. Dermatologist Approved"
                value={badgeForm.label}
                onChange={(e) => setBadgeForm({ ...badgeForm, label: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border text-xs font-bold bg-slate-50 dark:bg-slate-900"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button onClick={() => setActiveModal('none')} className="px-4 py-2 rounded-xl border text-xs font-bold text-slate-500">
                Cancel
              </button>
              <button onClick={handleSaveBadgeModal} className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-600/20">
                Save Badge
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
