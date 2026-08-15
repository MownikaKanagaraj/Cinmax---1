'use client';

import * as React from 'react';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, Button, Input } from '@cinmax/ui';
import { Bell, Sparkles, ShieldCheck, Tag, Save, Check } from 'lucide-react';

export default function AdminSettingsPage() {
  const [isSaved, setIsSaved] = React.useState(false);

  const [announcements, setAnnouncements] = React.useState([
    'Free Shipping above ₹499',
    'Buy 2 Get 1 Free',
    'New Launch: Charcoal Series',
  ]);

  const [concerns, setConcerns] = React.useState([
    'Dry Skin',
    'Acne Prone',
    'Sensitive Skin',
    'Anti-Aging',
    'Glowing Skin',
  ]);

  const [trustBadges, setTrustBadges] = React.useState([
    '100% Natural',
    'Dermatologist Tested',
    'Cruelty Free',
    'No Parabens',
    'Clinically Proven',
    'Ayush Certified',
  ]);

  const [newAnnouncement, setNewAnnouncement] = React.useState('');
  const [newConcern, setNewConcern] = React.useState('');

  const handleAddAnnouncement = () => {
    if (newAnnouncement.trim()) {
      setAnnouncements([...announcements, newAnnouncement.trim()]);
      setNewAnnouncement('');
    }
  };

  const handleRemoveAnnouncement = (idx: number) => {
    setAnnouncements(announcements.filter((_, i) => i !== idx));
  };

  const handleAddConcern = () => {
    if (newConcern.trim()) {
      setConcerns([...concerns, newConcern.trim()]);
      setNewConcern('');
    }
  };

  const handleRemoveConcern = (idx: number) => {
    setConcerns(concerns.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <AdminLayout>
      <PageHeader
        badge="Store Settings"
        title="Store & App Settings"
        subtitle="Manage home announcement bars, product tags, trust badges, and store configuration."
        actions={
          <Button variant="primary" size="sm" onClick={handleSave} className="rounded-xl flex items-center gap-2">
            {isSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
            {isSaved ? 'Settings Saved!' : 'Save All Settings'}
          </Button>
        }
      />

      <div className="max-w-4xl pt-6 space-y-8">
        {/* 1. TOP ANNOUNCEMENT BAR CONTROLLER */}
        <div className="p-8 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#C5A880]" />
            <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
              Home Page Top Announcement Bar Pills
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Configure offer banners rendered in horizontal marquee bars across Mobile and Web.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {announcements.map((item, idx) => (
              <span
                key={idx}
                className="bg-[#002754]/10 text-[#002754] dark:text-[#C5A880] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 border border-[#002754]/20"
              >
                {item}
                <button
                  type="button"
                  onClick={() => handleRemoveAnnouncement(idx)}
                  className="hover:text-red-600 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <input
              type="text"
              value={newAnnouncement}
              onChange={(e) => setNewAnnouncement(e.target.value)}
              placeholder="e.g. Complimentary Saffron Sample with Orders ₹999+"
              className="flex-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
            />
            <Button variant="outline" size="sm" onClick={handleAddAnnouncement}>
              + Add Pill
            </Button>
          </div>
        </div>

        {/* 2. SHOP BY CONCERN TAGS CONTROLLER */}
        <div className="p-8 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-4">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#C5A880]" />
            <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
              Shop By Concern Filters
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Filter pills displayed on the mobile home page for customer skin concern selection.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {concerns.map((item, idx) => (
              <span
                key={idx}
                className="bg-[#C5A880]/20 text-[#002754] dark:text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 border border-[#C5A880]/30"
              >
                {item}
                <button
                  type="button"
                  onClick={() => handleRemoveConcern(idx)}
                  className="hover:text-red-600 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <input
              type="text"
              value={newConcern}
              onChange={(e) => setNewConcern(e.target.value)}
              placeholder="e.g. Hyperpigmentation"
              className="flex-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
            />
            <Button variant="outline" size="sm" onClick={handleAddConcern}>
              + Add Concern
            </Button>
          </div>
        </div>

        {/* 3. TRUST & CERTIFICATION BADGES */}
        <div className="p-8 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#C5A880]" />
            <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
              Why Choose CINMAX Trust Badges
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Certification badges displayed at the bottom of Mobile and Web Home Pages.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {trustBadges.map((badge, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#F7F9FB] dark:bg-[#0A192F] border border-[#0A3D78]/10 flex items-center gap-2 text-xs font-bold text-[#002754] dark:text-white"
              >
                <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. GENERAL STORE SETTINGS */}
        <div className="p-8 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-6">
          <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
            General Storefront Settings
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                Storefront Name
              </label>
              <Input defaultValue="CINMAX Global Products" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                Support Concierge Email
              </label>
              <Input defaultValue="concierge@cinmax.luxury" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                Operating Currency
              </label>
              <Input defaultValue="INR (₹)" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                Free Shipping Threshold (₹)
              </label>
              <Input defaultValue="499.00" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
