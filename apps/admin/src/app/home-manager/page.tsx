'use client';

import * as React from 'react';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, Button } from '@cinmax/ui';
import { useHomeMarketingQuery, useUpdateHomeMarketingMutation } from '@cinmax/hooks';
import type { HomeMarketingSettings, HeroBannerItem, WatchShopVideoItem, TransformationStoryItem, TrustBadgeItem } from '@cinmax/types';
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
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  RefreshCw,
} from 'lucide-react';

export default function AdminHomePageManager() {
  const { data: marketingData, isLoading } = useHomeMarketingQuery();
  const updateMarketingMutation = useUpdateHomeMarketingMutation();

  const [activeSection, setActiveSection] = React.useState<
    'marquee' | 'hero' | 'reals' | 'mid_banner' | 'real_results' | 'why_choose' | 'bottom_banner'
  >('hero');
  const [isSaved, setIsSaved] = React.useState(false);

  // Local state initialized from query
  const [formData, setFormData] = React.useState<Partial<HomeMarketingSettings>>({});

  React.useEffect(() => {
    if (marketingData) {
      setFormData(marketingData);
    }
  }, [marketingData]);

  if (isLoading || !formData.topOffers) {
    return (
      <AdminLayout>
        <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span>Loading Home Page Marketing Configuration...</span>
        </div>
      </AdminLayout>
    );
  }

  const handlePublishAll = async () => {
    await updateMarketingMutation.mutateAsync(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <AdminLayout>
      <PageHeader
        badge="App & Web Home Page Control"
        title="Home Page Marketing Single Window Manager"
        subtitle="Manage all 7 mobile app home page marketing sections from one central corporate window."
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={handlePublishAll}
            disabled={updateMarketingMutation.isPending}
            className="rounded-xl flex items-center gap-2 shadow-md shadow-blue-500/20"
          >
            {isSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
            {isSaved ? 'Published Live to Mobile App!' : 'Publish Home Changes'}
          </Button>
        }
      />

      {/* Corporate Single Window Sub-Nav */}
      <div className="my-6 flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'marquee', label: '1. Top Offers & Pills', icon: Tag },
          { id: 'hero', label: '2. Hero Sliders', icon: Sliders },
          { id: 'reals', label: '3. Watch & Shop', icon: Video },
          { id: 'mid_banner', label: '4. Mid-Page Banner', icon: ImageIcon },
          { id: 'real_results', label: '5. Real Results (Before & After)', icon: Star },
          { id: 'why_choose', label: '6. Why Choose Us', icon: Award },
          { id: 'bottom_banner', label: '7. Bottom Banner', icon: Sparkles },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <IconComp className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: TOP OFFERS */}
      {activeSection === 'marquee' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Top Offer Bar &amp; Announcement Pills</h3>
            <p className="text-xs text-slate-400">Add or edit promotional lines rendered at the top of the mobile app home page.</p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Offers List</p>
            {(formData.topOffers || []).map((offer, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
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
            <button
              onClick={() => {
                setFormData({
                  ...formData,
                  topOffers: [...(formData.topOffers || []), 'New Promotional Offer Line'],
                });
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 flex items-center gap-1 mt-2"
            >
              <Plus className="w-4 h-4" /> Add Offer Line
            </button>
          </div>
        </div>
      )}

      {/* SECTION 2: HERO BANNERS */}
      {activeSection === 'hero' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Hero Sliders &amp; Carousel Banners</h3>
              <p className="text-xs text-slate-400">Main sliding banners displayed at the top of the mobile home screen.</p>
            </div>
            <button
              onClick={() => {
                const newBanner: HeroBannerItem = {
                  id: `hb_${Date.now()}`,
                  title: 'New Hero Campaign',
                  subtitle: 'Special offer subtitle description',
                  imageUrl: 'https://images.unsplash.com/photo-1607006314147-759088fd21c2?w=1200',
                  buttonText: 'Shop Now',
                  linkUrl: '/shop',
                  isActive: true,
                };
                setFormData({
                  ...formData,
                  heroBanners: [...(formData.heroBanners || []), newBanner],
                });
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Hero Banner
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(formData.heroBanners || []).map((banner, idx) => (
              <div
                key={banner.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 space-y-3"
              >
                <div className="h-32 rounded-xl overflow-hidden bg-slate-200 relative">
                  <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={banner.title}
                    onChange={(e) => {
                      const updated = [...(formData.heroBanners || [])];
                      updated[idx].title = e.target.value;
                      setFormData({ ...formData, heroBanners: updated });
                    }}
                    className="w-full font-bold text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-[#0F172A] dark:text-white"
                  />
                  <input
                    type="text"
                    value={banner.subtitle}
                    onChange={(e) => {
                      const updated = [...(formData.heroBanners || [])];
                      updated[idx].subtitle = e.target.value;
                      setFormData({ ...formData, heroBanners: updated });
                    }}
                    className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-500 dark:text-slate-300"
                  />
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[10px] font-mono text-blue-600">{banner.linkUrl}</span>
                    <button
                      onClick={() => {
                        const updated = (formData.heroBanners || []).filter((_, i) => i !== idx);
                        setFormData({ ...formData, heroBanners: updated });
                      }}
                      className="text-red-500 hover:text-red-700 font-bold text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: WATCH & SHOP */}
      {activeSection === 'reals' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Watch &amp; Shop Video Reals</h3>
              <p className="text-xs text-slate-400">Interactive video reels with direct buy product overlays.</p>
            </div>
            <button
              onClick={() => {
                const newReal: WatchShopVideoItem = {
                  id: `v_${Date.now()}`,
                  slug: 'new-product',
                  title: 'New Video Reel',
                  videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-skin-care-product-routine-42901-large.mp4',
                  productName: 'Organic Cleansing Bar',
                  productPrice: '₹299',
                  productImage: 'https://images.unsplash.com/photo-1607006482140-520e7df6504a?w=200',
                  isActive: true,
                };
                setFormData({
                  ...formData,
                  watchShopVideos: [...(formData.watchShopVideos || []), newReal],
                });
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Video Reel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {(formData.watchShopVideos || []).map((real, idx) => (
              <div
                key={real.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-blue-400 flex items-center justify-center font-bold">
                    <Video className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={real.title}
                      onChange={(e) => {
                        const updated = [...(formData.watchShopVideos || [])];
                        updated[idx].title = e.target.value;
                        setFormData({ ...formData, watchShopVideos: updated });
                      }}
                      className="w-full font-bold text-xs bg-white dark:bg-slate-800 border border-slate-200 rounded p-1"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">{real.productName} ({real.productPrice})</p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">Active</span>
                  <button
                    onClick={() => {
                      const updated = (formData.watchShopVideos || []).filter((_, i) => i !== idx);
                      setFormData({ ...formData, watchShopVideos: updated });
                    }}
                    className="text-red-500 hover:text-red-700 font-bold text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: MID-PAGE BANNER */}
      {activeSection === 'mid_banner' && formData.midBanner && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Static Mid-Page Banner (Placed Below Best Sellers)</h3>
            <p className="text-xs text-slate-400">Featured promotional banner section shown right below Best Sellers on the mobile home page.</p>
          </div>

          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Banner Title</label>
              <input
                type="text"
                value={formData.midBanner.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    midBanner: { ...formData.midBanner!, title: e.target.value },
                  })
                }
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 outline-none font-bold"
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
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 outline-none"
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
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 outline-none font-bold text-blue-600"
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
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: REAL RESULTS */}
      {activeSection === 'real_results' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Real Results (Before &amp; After Transformations)</h3>
              <p className="text-xs text-slate-400">Customer transformation stories with before/after photos and testimonial quotes.</p>
            </div>
            <button
              onClick={() => {
                const newStory: TransformationStoryItem = {
                  id: `r_${Date.now()}`,
                  beforeUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5BOW-AMfn4OYmw2raRZLFjyAXl9_Og2oljlyp6Ey3blAt0F58rE21Yc2kFmrF_m8w0_bszNhtfNPcsATPHO3DTKc5-xaT7Y0ZjBW1_TNzJioa5TZURDMTRt1t9pX3z-tlGfEKQwtCCItGZeCLGFICOAr2rCVYxeE6NlxuyABQQ3_aEL3gjrXGthTSnEDu44eD7saHOsvmf4hq5dtRwLMPjiu3W-zO2yCyhMDJBYPlz9EKgQiy_WhT',
                  afterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBYYqfLzkyDJCgmUIN62zfpDnVNi80xAnbOwXMzWR_EC665r4W7a8jgxawqehE-NsGCjsao-u0awGHY1IawWevNQcSWP5uOLvmXo8iVoso9HXauK_4wWL6zedipG6xSlBnZ7PvBUQQw8SDi5OQEIzGlroqvATlo8emGKQmNpZkYbPTV5kb74HCXzfWSSdwZ-feAljIXulzIuzrRfkFuPTBDYlbTWpuPRjpYWGCmJD3d7oLoTXmRmLR',
                  quote: '"Noticeable skin improvements in 2 weeks!"',
                  userName: 'Customer Testimonial',
                  isActive: true,
                };
                setFormData({
                  ...formData,
                  realResults: [...(formData.realResults || []), newStory],
                });
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Before &amp; After Story
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(formData.realResults || []).map((story, idx) => (
              <div
                key={story.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-3"
              >
                <div className="grid grid-cols-2 gap-2 h-28">
                  <img src={story.beforeUrl} alt="Before" className="w-full h-full object-cover rounded-lg" />
                  <img src={story.afterUrl} alt="After" className="w-full h-full object-cover rounded-lg" />
                </div>
                <input
                  type="text"
                  value={story.quote}
                  onChange={(e) => {
                    const updated = [...(formData.realResults || [])];
                    updated[idx].quote = e.target.value;
                    setFormData({ ...formData, realResults: updated });
                  }}
                  className="w-full font-bold text-xs bg-white dark:bg-slate-800 border border-slate-200 rounded p-2 text-[#0F172A] dark:text-white"
                />
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400">{story.userName}</span>
                  <button
                    onClick={() => {
                      const updated = (formData.realResults || []).filter((_, i) => i !== idx);
                      setFormData({ ...formData, realResults: updated });
                    }}
                    className="text-red-500 hover:text-red-700 font-bold text-xs"
                  >
                    Delete Story
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 6: WHY CHOOSE US */}
      {activeSection === 'why_choose' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Why Choose CINMAX Feature Badges</h3>
            <p className="text-xs text-slate-400">Value proposition badges displayed to build customer trust on the mobile app home page.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(formData.trustBadges || []).map((badge, idx) => (
              <div
                key={badge.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between"
              >
                <input
                  type="text"
                  value={badge.label}
                  onChange={(e) => {
                    const updated = [...(formData.trustBadges || [])];
                    updated[idx].label = e.target.value;
                    setFormData({ ...formData, trustBadges: updated });
                  }}
                  className="font-bold text-xs bg-white dark:bg-slate-800 border border-slate-200 rounded px-2 py-1 text-[#0F172A] dark:text-white"
                />
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">Active Badge</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 7: BOTTOM BANNER */}
      {activeSection === 'bottom_banner' && formData.bottomBanner && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Bottom Home Page Manufacturing &amp; Quality Banner</h3>
            <p className="text-xs text-slate-400">Bottom promotional banner shown right before the mobile footer navigation.</p>
          </div>

          <div className="space-y-4 max-w-xl">
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
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 outline-none font-bold"
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
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Button Text</label>
              <input
                type="text"
                value={formData.bottomBanner.buttonText}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bottomBanner: { ...formData.bottomBanner!, buttonText: e.target.value },
                  })
                }
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 outline-none font-bold text-blue-600"
              />
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
