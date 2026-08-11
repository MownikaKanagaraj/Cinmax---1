'use client';

import * as React from 'react';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, Button, Badge } from '@cinmax/ui';
import { PlayCircle, Plus, Trash2, Edit2, Video, Image as ImageIcon, Check, X } from 'lucide-react';

export default function AdminMediaPage() {
  const [activeTab, setActiveTab] = React.useState<'videos' | 'assets'>('videos');

  const [videos, setVideos] = React.useState([
    {
      id: 'v1',
      slug: 'aloe-vera-soap',
      title: 'Aloe Vera Hydration Bar',
      price: '₹199',
      thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC85VgeJRlaGssVKe4o5MaUTzkpQWnScMZ6g9JvCSe-AhjElgCk-Yowqs1H5yrvUiFwhlWsilPdz9OOpG1Ws6cEJPX3MqFjZYdw9mFcjU-6d2GmTnneNs0Hv4b0MNq3arAlFZt4a8TD4uN0jtZdcgrqrUYi4dEkRyGZTOfAX4Yp6YgHz-xA0zhXWRpnfIk3FrKENZ9c9b6hfKS6VNogJjs5ByDdGYS0ggxXlRgx8KWscPhk-oThH0B1',
      videoBg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYWOizEZDuaWyblNqgPfFEOp2E1S7-_r3mCe31-TBndf4pZxCjh2WDz36JQXQQfn9nTUKRwkJQVEpJxhw2BTQPQxMZkK9r6if5X5njBMJSkHpNL2nwiLENqAJSO5xK6NCr0QZXwBEvffOB72Q3ibHuQm_Eqes4JwzBFp69fDYzpDWBnHA5ruI2brQhhUnpla7L_gLVYd9EmdQVK1Yg446y59Vlbvm_Lkh0HlHy4qYTJg15uGouMf4H',
      isActive: true,
    },
    {
      id: 'v2',
      slug: 'herbal-face-wash',
      title: 'Herbal Face Cleansing Gel',
      price: '₹349',
      thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHnFfmbzs4odu4hUcNbwNd-OrXTBHOw41GW-tf2Bmna5p-oJmZUFqsC1sBj8txLrKD33VBEvxYtGShx6CF-f1GbvmzwWHQ4eptdfGsDUdizSlp9go6ALz_fF1JyGAq3Lhl3sdIMZmPbM3ZF659XjIsYoQc4giS_ewhlT0DPW6sxfsMs_doKDdM-TgL3MwIfp4o7xpABiKVYy3uWo8XQj5Tk5nxnaDD9NPr7bR3OM_KyUbFqFTRxxzy',
      videoBg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4hGIPIejk60bEezIYicTQLJpMY5-qQKabcM6coMemOPeELnvU355rNxezfAka_vpZYvzKdAANiQdIfxCyWItJuApZwrQ4SUljqMS3AekmtsH56lTNrV4yW0CQvYPydHykT6-6IKpcE5uGJ20Z56o9G0C2eHNyFnuqZWAh_vJe-QW9MOs5ZoDzdwe8IaVgq9NUeT4Hqus39jZhB8kLV3Ey6_HyCuw8nlP2Tjnl01lROQmU2bmezRlX',
      isActive: true,
    },
    {
      id: 'v3',
      slug: 'body-butter',
      title: 'Shea & Cocoa Body Butter',
      price: '₹599',
      thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAC4_O-VCsUAlu719m1m0vV3KMOoUtAFzG3dkrQycKtnheA5jOA15zyNCpS17Lh9rLBJtLA7ZvuOKLRPZZhdpXFgDiYWUXF-BZ0-racDb1CIYbqiamFr6ZvwLMEGJtfvd0faHNL1BQ-pt5hzJtC2UmK-QmF8jzuIPJRDOiqvfSoEDMgZgwFiJ69FRJdGuK_ZQwvGAJAcLGKr5eC7_Mq78PJIKrkGLBPDjaE0rPxJk6R9jx6XNoMOK7g',
      videoBg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAD-2JQ6dXD42VIKrGXpTgMQTarLSKdbwD46cJkLtP_7TKmMwzx660Ighbfe8kVX9geq_iFddOwwXLrmF5IUWRmWPIceuSmb0o_ZkJXyyQI7Qx6azaAPeHi0N1E2POWR1T4ju4EMfbkFPHLRnqRvgeN4mRjqZHMuSFjQNvvKRxs6S6qMQV8oSkCP0Taxihl9ZPeMTHEHAjrc_9Rv2IjLN3zJ7xdBD68AjQX7bu18WyNBhnLFQBdVe83',
      isActive: true,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: '',
    slug: 'aloe-vera-soap',
    price: '₹299',
    thumb: 'https://images.unsplash.com/photo-1607006314147-759088fd21c2?w=200&auto=format&fit=crop&q=80',
    videoBg: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
  });

  const handleCreateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const newVideo = {
      id: `v_${Date.now()}`,
      ...formData,
      isActive: true,
    };
    setVideos([...videos, newVideo]);
    setIsModalOpen(false);
  };

  const handleDeleteVideo = (id: string) => {
    setVideos(videos.filter((v) => v.id !== id));
  };

  return (
    <AdminLayout>
      <PageHeader
        badge="Content Media Engine"
        title="Media & Shoppable Video Manager"
        subtitle="Manage Watch & Shop video reels, high-resolution photography, and editorial product media."
        actions={
          <Button variant="primary" size="sm" className="rounded-full flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" /> Add Shoppable Video Reel
          </Button>
        }
      />

      {/* Tab Navigation */}
      <div className="flex items-center gap-4 border-b border-[#0A3D78]/15 pt-4 pb-1">
        <button
          onClick={() => setActiveTab('videos')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'videos'
              ? 'border-[#002754] text-[#002754] dark:text-[#C5A880]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Video className="w-4 h-4" /> Watch &amp; Shop Video Feed ({videos.length})
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'assets'
              ? 'border-[#002754] text-[#002754] dark:text-[#C5A880]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <ImageIcon className="w-4 h-4" /> Image Assets Bucket
        </button>
      </div>

      {activeTab === 'videos' ? (
        <div className="pt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-[#C5A880]" /> Active Mobile &amp; Web Video Feed
            </h3>
            <span className="text-xs text-muted-foreground">Viewers can watch &amp; buy directly from video cards</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((vid) => (
              <div
                key={vid.id}
                className="relative rounded-2xl overflow-hidden aspect-[9/16] bg-slate-900 border border-[#0A3D78]/20 shadow-md group"
              >
                <img src={vid.videoBg} alt={vid.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                  <PlayCircle className="w-12 h-12 text-white/90 group-hover:scale-110 transition-transform" />
                </div>

                <button
                  onClick={() => handleDeleteVideo(vid.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md"
                  title="Remove Video"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Floating Shoppable Product Card */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-[#071324]/95 backdrop-blur-md rounded-xl p-2.5 flex items-center gap-2.5 border border-white/40 shadow-lg">
                  <div className="w-9 h-9 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0">
                    <img src={vid.thumb} alt={vid.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-[#002754] dark:text-white truncate">{vid.title}</p>
                    <p className="text-[10px] font-semibold text-[#0A3D78] dark:text-[#C5A880]">{vid.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6">
          {[
            { id: 'med_1', title: 'French Green Clay Bar - Hero Shot', url: 'https://images.unsplash.com/photo-1607006314147-759088fd21c2?w=400&auto=format&fit=crop&q=80', size: '2.4 MB', dimensions: '2400x3000' },
            { id: 'med_2', title: 'Artisan Wooden Curing Racks', url: 'https://images.unsplash.com/photo-1547793548-7a0e7dfdb24f?w=400&auto=format&fit=crop&q=80', size: '3.1 MB', dimensions: '2400x1800' },
            { id: 'med_3', title: 'Cold Process Botanical Pouring', url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&auto=format&fit=crop&q=80', size: '1.8 MB', dimensions: '2000x2000' },
          ].map((item) => (
            <div key={item.id} className="p-4 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm space-y-3">
              <div className="aspect-[4/3] rounded-[16px] overflow-hidden bg-slate-100 relative">
                <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-xs truncate text-[#002754] dark:text-white">{item.title}</h4>
                <p className="text-[10px] text-muted-foreground">{item.dimensions} • {item.size}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#071324] rounded-3xl p-6 max-w-lg w-full border border-[#0A3D78]/20 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
              <h3 className="font-serif text-xl font-bold text-[#002754] dark:text-white">
                Add Shoppable Video Reel
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Saffron Botanical Bar"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                    Price Tag
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="₹299"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                    Product Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="aloe-vera-soap"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                  Video Background Media URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.videoBg}
                  onChange={(e) => setFormData({ ...formData, videoBg: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                  Product Thumbnail Image URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.thumb}
                  onChange={(e) => setFormData({ ...formData, thumb: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Publish Video Reel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
