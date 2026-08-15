'use client';

import * as React from 'react';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, Button } from '@cinmax/ui';
import {
  Sliders,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  Award,
  Plus,
  Trash2,
  Edit2,
  Save,
  Check,
  Eye,
  Tag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
} from 'lucide-react';

export default function AdminHomePageManager() {
  const [activeSection, setActiveSection] = React.useState<
    'marquee' | 'hero' | 'reals' | 'mid_banner' | 'why_choose' | 'bottom_banner'
  >('hero');
  const [isSaved, setIsSaved] = React.useState(false);

  // 1. TOP OFFER MARQUEE & CATEGORY PILLS STATE
  const [topOffers, setTopOffers] = React.useState([
    '🔥 Flash Sale: Flat 20% OFF on all soaps',
    '🚚 Free Express Shipping on orders over ₹499',
    '🎁 Buy 2 Get 1 Free on Neem Herbal Range',
  ]);
  const [newOfferText, setNewOfferText] = React.useState('');

  // 2. HERO BANNERS & SLIDERS STATE
  const [heroBanners, setHeroBanners] = React.useState([
    {
      id: 'hb_1',
      title: 'Artisanal Cold-Process Soaps',
      subtitle: 'Handcrafted with organic botanical oils & raw honey',
      imageUrl: 'https://images.unsplash.com/photo-1607006482140-520e7df6504a?w=1200',
      buttonText: 'Shop Collection',
      linkUrl: '/products',
      isActive: true,
    },
    {
      id: 'hb_2',
      title: 'Natural Glow Serum & Oils',
      subtitle: 'Pure sandalwood & saffron extract for radiant skin',
      imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=1200',
      buttonText: 'Explore Serums',
      linkUrl: '/products?category=serums',
      isActive: true,
    },
  ]);

  // 3. WATCH & SHOP REALS STATE
  const [videoReals, setVideoReals] = React.useState([
    {
      id: 'vr_1',
      title: 'Daily Cleansing Routine',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-skin-care-product-routine-42901-large.mp4',
      productName: 'French Green Clay Bar',
      productPrice: '₹349',
      productImage: 'https://images.unsplash.com/photo-1607006482140-520e7df6504a?w=200',
      isActive: true,
    },
    {
      id: 'vr_2',
      title: 'Glowing Skin Transformation',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-applying-facial-cream-42900-large.mp4',
      productName: 'Kumkumadi Glow Oil',
      productPrice: '₹899',
      productImage: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=200',
      isActive: true,
    },
  ]);

  // 4. STATIC MID-PAGE BANNER STATE (Below Best Sellers)
  const [midBanner, setMidBanner] = React.useState({
    title: 'Mid-Season Botanical Sale',
    subtitle: 'Get up to 30% OFF on all handcrafted wellness bundles',
    badgeText: 'LIMITED PERIOD OFFER',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200',
    buttonText: 'Claim Offer Now',
    linkUrl: '/products?sale=true',
    isActive: true,
  });

  // 5. WHY CHOOSE CINMAX STATE
  const [whyChooseFeatures, setWhyChooseFeatures] = React.useState([
    {
      id: 'wc_1',
      title: '100% Organic Ingredients',
      subtitle: 'Pure cold-pressed botanical oils without synthetic chemicals',
      iconName: 'ShieldCheck',
      isActive: true,
    },
    {
      id: 'wc_2',
      title: 'Free Express Shipping',
      subtitle: 'Fast dispatch within 24 hours across India',
      iconName: 'Truck',
      isActive: true,
    },
    {
      id: 'wc_3',
      title: 'Dermatologist Approved',
      subtitle: 'Safe for sensitive skin & allergy tested',
      iconName: 'Award',
      isActive: true,
    },
    {
      id: 'wc_4',
      title: 'Easy 7-Day Returns',
      subtitle: 'Hassle-free replacement policy',
      iconName: 'RotateCcw',
      isActive: true,
    },
  ]);

  // 6. BOTTOM BANNER STATE (Footer Promo Banner)
  const [bottomBanner, setBottomBanner] = React.useState({
    title: 'Join the CINMAX Wellness Club',
    subtitle: 'Subscribe now and receive 15% OFF your first order + free gift',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200',
    buttonText: 'Join Now & Save',
    linkUrl: '/register',
    isActive: true,
  });

  const handleGlobalSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <AdminLayout>
      <PageHeader
        badge="App & Web Home Page Control"
        title="Home Page Marketing Manager"
        subtitle="Manage all 6 mobile app home page marketing sections from one central dashboard."
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={handleGlobalSave}
            className="rounded-xl flex items-center gap-2 shadow-md shadow-blue-500/20"
          >
            {isSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
            {isSaved ? 'All Changes Live!' : 'Publish Home Changes'}
          </Button>
        }
      />

      {/* Internal Admin UX: Sub-Nav Bar for 6 Home Page Sections */}
      <div className="my-6 flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'marquee', label: '1. Top Offers & Pills', icon: Tag },
          { id: 'hero', label: '2. Hero Banners', icon: Sliders },
          { id: 'reals', label: '3. Watch & Shop', icon: Video },
          { id: 'mid_banner', label: '4. Mid-Page Banner', icon: ImageIcon },
          { id: 'why_choose', label: '5. Why Choose Us', icon: Award },
          { id: 'bottom_banner', label: '6. Bottom Banner', icon: Sparkles },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
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

      {/* SECTION 1: TOP OFFERS & MARQUEE PILLS */}
      {activeSection === 'marquee' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Top Offer Bar & Announcement Pills</h3>
            <p className="text-xs text-slate-400">Add or edit promotional lines rendered at the top of the mobile app home page.</p>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={newOfferText}
              onChange={(e) => setNewOfferText(e.target.value)}
              placeholder="Type new offer text (e.g. Flat 15% OFF on orders over ₹999)..."
              className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 outline-none"
            />
            <button
              onClick={() => {
                if (newOfferText.trim()) {
                  setTopOffers([...topOffers, newOfferText.trim()]);
                  setNewOfferText('');
                }
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Offer
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Offers List</p>
            {topOffers.map((offer, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <span className="text-xs font-bold text-[#0F172A] dark:text-white">{offer}</span>
                <button
                  onClick={() => setTopOffers(topOffers.filter((_, i) => i !== idx))}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: HERO BANNERS & SLIDERS */}
      {activeSection === 'hero' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Hero Sliders & Carousel Banners</h3>
              <p className="text-xs text-slate-400">Main sliding banners displayed at the top of the home screen.</p>
            </div>
            <button
              onClick={() => {
                const newBanner = {
                  id: `hb_${Date.now()}`,
                  title: 'New Promotional Campaign',
                  subtitle: 'Special offer description',
                  imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200',
                  buttonText: 'Shop Now',
                  linkUrl: '/products',
                  isActive: true,
                };
                setHeroBanners([...heroBanners, newBanner]);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Hero Banner
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {heroBanners.map((banner) => (
              <div
                key={banner.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="h-40 relative overflow-hidden bg-slate-200">
                  <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                    Active
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-sm text-[#0F172A] dark:text-white">{banner.title}</h4>
                  <p className="text-xs text-slate-400">{banner.subtitle}</p>
                  <div className="pt-2 flex justify-between items-center text-xs">
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{banner.buttonText} → {banner.linkUrl}</span>
                    <button
                      onClick={() => setHeroBanners(heroBanners.filter((b) => b.id !== banner.id))}
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

      {/* SECTION 3: WATCH & SHOP REALS */}
      {activeSection === 'reals' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Watch &amp; Shop Video Reals</h3>
              <p className="text-xs text-slate-400">Short video reels with direct product buy overlays.</p>
            </div>
            <button
              onClick={() => {
                const newReal = {
                  id: `vr_${Date.now()}`,
                  title: 'New Product Review Reel',
                  videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-skin-care-product-routine-42901-large.mp4',
                  productName: 'Organic Soap Bar',
                  productPrice: '₹299',
                  productImage: 'https://images.unsplash.com/photo-1607006482140-520e7df6504a?w=200',
                  isActive: true,
                };
                setVideoReals([...videoReals, newReal]);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Video Reel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {videoReals.map((real) => (
              <div
                key={real.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 text-blue-400 flex items-center justify-center font-bold">
                    <Video className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#0F172A] dark:text-white">{real.title}</h4>
                    <p className="text-[10px] text-slate-400">Linked: {real.productName} ({real.productPrice})</p>
                  </div>
                </div>
                <div className="pt-2 flex justify-between items-center text-xs">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700">Live</span>
                  <button
                    onClick={() => setVideoReals(videoReals.filter((r) => r.id !== real.id))}
                    className="text-red-500 hover:text-red-700 font-bold text-xs"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: STATIC MID-PAGE BANNER (Below Best Sellers) */}
      {activeSection === 'mid_banner' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Static Mid-Page Banner (Placed Below Best Sellers)</h3>
            <p className="text-xs text-slate-400">Edit the prominent promotional section shown right after the Best Seller section.</p>
          </div>

          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Banner Title</label>
              <input
                type="text"
                value={midBanner.title}
                onChange={(e) => setMidBanner({ ...midBanner, title: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Subtitle / Sub-Heading</label>
              <input
                type="text"
                value={midBanner.subtitle}
                onChange={(e) => setMidBanner({ ...midBanner, subtitle: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Badge Text</label>
                <input
                  type="text"
                  value={midBanner.badgeText}
                  onChange={(e) => setMidBanner({ ...midBanner, badgeText: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Button Text</label>
                <input
                  type="text"
                  value={midBanner.buttonText}
                  onChange={(e) => setMidBanner({ ...midBanner, buttonText: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: WHY CHOOSE CINMAX */}
      {activeSection === 'why_choose' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Why Choose CINMAX Feature Cards</h3>
            <p className="text-xs text-slate-400">Value proposition badges displayed to build customer trust on the home page.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {whyChooseFeatures.map((feat) => (
              <div
                key={feat.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-xs text-[#0F172A] dark:text-white">{feat.title}</h4>
                  <p className="text-[10px] text-slate-400">{feat.subtitle}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">Active</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 6: BOTTOM BANNER */}
      {activeSection === 'bottom_banner' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Bottom Home Page Banner</h3>
            <p className="text-xs text-slate-400">Footer call-to-action banner shown right before the mobile navigation footer.</p>
          </div>

          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Bottom Banner Headline</label>
              <input
                type="text"
                value={bottomBanner.title}
                onChange={(e) => setBottomBanner({ ...bottomBanner, title: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Sub-heading</label>
              <input
                type="text"
                value={bottomBanner.subtitle}
                onChange={(e) => setBottomBanner({ ...bottomBanner, subtitle: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Button Call-To-Action</label>
              <input
                type="text"
                value={bottomBanner.buttonText}
                onChange={(e) => setBottomBanner({ ...bottomBanner, buttonText: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 outline-none font-bold text-blue-600"
              />
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
