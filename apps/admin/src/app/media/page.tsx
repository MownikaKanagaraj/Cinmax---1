'use client';

import * as React from 'react';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, Button, Badge } from '@cinmax/ui';
import { useVideosQuery, useCreateVideoMutation, useDeleteVideoMutation } from '@cinmax/hooks';
import { getYouTubeVideoId, getYouTubeThumbnailUrl } from '@cinmax/utils';
import { PlayCircle, Plus, Trash2, Edit2, Video, Image as ImageIcon, Check, X, Youtube } from 'lucide-react';

export default function AdminMediaPage() {
  const [activeTab, setActiveTab] = React.useState<'videos' | 'assets'>('videos');
  const { data: videos = [], isLoading } = useVideosQuery(false);
  const createVideo = useCreateVideoMutation();
  const deleteVideo = useDeleteVideoMutation();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: '',
    youtubeUrl: '',
    price: 199,
    description: '',
  });

  const handleCreateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.youtubeUrl) return;
    const ytId = getYouTubeVideoId(formData.youtubeUrl) || 'dQw4w9WgXcQ';
    const thumb = getYouTubeThumbnailUrl(formData.youtubeUrl);

    createVideo.mutate({
      title: formData.title,
      description: formData.description,
      youtubeUrl: formData.youtubeUrl,
      youtubeId: ytId,
      thumbnailUrl: thumb,
      price: Number(formData.price) || 0,
      isPublished: true,
    }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setFormData({ title: '', youtubeUrl: '', price: 199, description: '' });
      }
    });
  };

  const handleDeleteVideo = (id: string) => {
    if (confirm('Are you sure you want to remove this video reel?')) {
      deleteVideo.mutate(id);
    }
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
            <span className="text-xs text-muted-foreground">Viewers can watch &amp; unlock masterclasses directly</span>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-sm text-slate-400">Loading videos...</div>
          ) : videos.length === 0 ? (
            <div className="p-12 bg-white dark:bg-[#071324] rounded-2xl border text-center space-y-3">
              <p className="text-sm font-semibold text-[#002754] dark:text-white">No videos published yet.</p>
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
                + Add Video Reel
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {videos.map((vid) => (
                <div
                  key={vid.id}
                  className="relative rounded-2xl overflow-hidden aspect-[9/16] bg-slate-900 border border-[#0A3D78]/20 shadow-md group"
                >
                  <img src={vid.thumbnailUrl || `https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`} alt={vid.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-white/90 group-hover:scale-110 transition-transform" />
                  </div>

                  <button
                    onClick={() => handleDeleteVideo(vid.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md z-10"
                    title="Remove Video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Floating Video Info Card */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-[#071324]/95 backdrop-blur-md rounded-xl p-2.5 flex items-center gap-2.5 border border-white/40 shadow-lg">
                    <div className="w-9 h-9 rounded-lg bg-slate-900 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <Youtube className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-[#002754] dark:text-white truncate">{vid.title}</p>
                      <p className="text-[10px] font-semibold text-[#0A3D78] dark:text-[#C5A880]">
                        {vid.price === 0 ? 'FREE' : `₹${vid.price}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6">
          {[
            { id: 'med_1', title: 'French Green Clay Bar - Hero Shot', url: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&auto=format&fit=crop&q=80', size: '2.4 MB', dimensions: '2400x3000' },
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
                  Video Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Saffron Botanical Masterclass"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                  YouTube Video Link / URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                  Price (₹ INR)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  placeholder="199"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
