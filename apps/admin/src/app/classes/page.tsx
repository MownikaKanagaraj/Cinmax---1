'use client';

import * as React from 'react';
import {
  usePlaylistsQuery,
  useCreatePlaylistMutation,
  useUpdatePlaylistMutation,
  useDeletePlaylistMutation,
  useAddVideoToPlaylistMutation,
  useUpdatePlaylistVideoMutation,
  useDeletePlaylistVideoMutation,
  useProductsQuery,
} from '@cinmax/hooks';
import { parseYouTubeEmbedUrl, formatCurrency } from '@cinmax/utils';
import {
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  Eye,
  Video,
  PlayCircle,
  CheckCircle,
  XCircle,
  X,
  Search,
  Check,
  Layers,
  Link as LinkIcon,
  Sparkles,
  Clock,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export default function AdminClassesPage() {
  const { data: playlists = [], isLoading, refetch } = usePlaylistsQuery(false);
  const { data: productsData } = useProductsQuery({});
  const products = productsData?.items || [];

  const createPlaylistMutation = useCreatePlaylistMutation();
  const updatePlaylistMutation = useUpdatePlaylistMutation();
  const deletePlaylistMutation = useDeletePlaylistMutation();
  const addVideoMutation = useAddVideoToPlaylistMutation();
  const updateVideoMutation = useUpdatePlaylistVideoMutation();
  const deleteVideoMutation = useDeletePlaylistVideoMutation();

  // Search & Filters
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'published' | 'draft'>('all');

  // Modals
  const [isClassModalOpen, setIsClassModalOpen] = React.useState(false);
  const [editingClass, setEditingClass] = React.useState<any | null>(null);

  const [isVideoModalOpen, setIsVideoModalOpen] = React.useState(false);
  const [selectedClassForVideo, setSelectedClassForVideo] = React.useState<any | null>(null);
  const [editingVideo, setEditingVideo] = React.useState<any | null>(null);

  const [previewVideoUrl, setPreviewVideoUrl] = React.useState<string | null>(null);
  const [previewVideoTitle, setPreviewVideoTitle] = React.useState<string>('');

  // Class Form State
  const [classForm, setClassForm] = React.useState({
    title: '',
    description: '',
    category: 'Botanical Craftsmanship',
    productId: '',
    price: 499,
    thumbnailUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800',
    isPublished: true,
  });

  // Video Form State
  const [videoForm, setVideoForm] = React.useState({
    title: '',
    youtubeUrl: '',
    duration: '15 Mins',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600',
  });

  const resetClassForm = () => {
    setClassForm({
      title: '',
      description: '',
      category: 'Botanical Craftsmanship',
      productId: '',
      price: 499,
      thumbnailUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800',
      isPublished: true,
    });
    setEditingClass(null);
  };

  const resetVideoForm = () => {
    setVideoForm({
      title: '',
      youtubeUrl: '',
      duration: '15 Mins',
      thumbnailUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600',
    });
    setEditingVideo(null);
  };

  const handleOpenCreateClass = () => {
    resetClassForm();
    setIsClassModalOpen(true);
  };

  const handleOpenEditClass = (pl: any) => {
    setEditingClass(pl);
    setClassForm({
      title: pl.title || '',
      description: pl.description || '',
      category: pl.category || 'Botanical Craftsmanship',
      productId: pl.productId || '',
      price: pl.price || 499,
      thumbnailUrl: pl.thumbnailUrl || 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800',
      isPublished: Boolean(pl.isPublished),
    });
    setIsClassModalOpen(true);
  };

  const handleSaveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classForm.title.trim()) {
      alert('Please enter a class title.');
      return;
    }

    const payload = {
      title: classForm.title.trim(),
      description: classForm.description.trim(),
      category: classForm.category,
      productId: classForm.productId || '',
      price: Number(classForm.price) || 0,
      thumbnailUrl: classForm.thumbnailUrl.trim(),
      isPublished: classForm.isPublished,
    };

    try {
      if (editingClass) {
        await updatePlaylistMutation.mutateAsync({ id: editingClass.id, payload });
      } else {
        await createPlaylistMutation.mutateAsync(payload);
      }
      setIsClassModalOpen(false);
      resetClassForm();
      refetch();
    } catch (err: any) {
      console.error('Error saving class:', err);
      alert(err.message || 'Failed to save class.');
    }
  };

  const handleDeleteClass = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the class "${title}"?`)) return;
    try {
      await deletePlaylistMutation.mutateAsync(id);
      refetch();
    } catch (err: any) {
      console.error('Error deleting class:', err);
      alert(err.message || 'Failed to delete class.');
    }
  };

  const handleTogglePublished = async (pl: any) => {
    try {
      await updatePlaylistMutation.mutateAsync({
        id: pl.id,
        payload: { isPublished: !pl.isPublished },
      });
      refetch();
    } catch (err: any) {
      console.error('Error toggling published status:', err);
    }
  };

  // Video Management Handlers
  const handleOpenVideoManager = (pl: any) => {
    setSelectedClassForVideo(pl);
    resetVideoForm();
    setIsVideoModalOpen(true);
  };

  const handleEditVideoItem = (vid: any) => {
    setEditingVideo(vid);
    setVideoForm({
      title: vid.title || '',
      youtubeUrl: vid.youtubeUrl || `https://www.youtube.com/watch?v=${vid.youtubeId || ''}`,
      duration: vid.duration || '15 Mins',
      thumbnailUrl: vid.thumbnailUrl || 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600',
    });
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassForVideo || !videoForm.title.trim() || !videoForm.youtubeUrl.trim()) {
      alert('Please provide video title and YouTube URL.');
      return;
    }

    try {
      if (editingVideo) {
        await updateVideoMutation.mutateAsync({
          videoId: editingVideo.id,
          payload: {
            title: videoForm.title.trim(),
            youtubeUrl: videoForm.youtubeUrl.trim(),
            duration: videoForm.duration.trim(),
            thumbnailUrl: videoForm.thumbnailUrl.trim(),
          },
        });
      } else {
        await addVideoMutation.mutateAsync({
          playlistId: selectedClassForVideo.id,
          payload: {
            title: videoForm.title.trim(),
            youtubeUrl: videoForm.youtubeUrl.trim(),
            duration: videoForm.duration.trim(),
            thumbnailUrl: videoForm.thumbnailUrl.trim(),
          },
        });
      }
      resetVideoForm();
      refetch();
    } catch (err: any) {
      console.error('Error saving video:', err);
      alert(err.message || 'Failed to save video lesson.');
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to remove this video from the class?')) return;
    try {
      await deleteVideoMutation.mutateAsync(videoId);
      refetch();
    } catch (err: any) {
      console.error('Error deleting video:', err);
      alert(err.message || 'Failed to delete video lesson.');
    }
  };

  // Preview YouTube player
  const handlePreviewVideo = (url: string, title: string) => {
    setPreviewVideoUrl(url);
    setPreviewVideoTitle(title);
  };

  // Filtered Playlists
  const filteredPlaylists = playlists.filter((pl: any) => {
    const matchesSearch =
      !searchQuery.trim() ||
      pl.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pl.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pl.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && pl.isPublished) ||
      (statusFilter === 'draft' && !pl.isPublished);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0F172A] text-white p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="font-serif font-extrabold text-2xl tracking-wide flex items-center gap-2">
              Classes &amp; Masterclasses Management
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Create, edit, publish, and link YouTube masterclasses to CINMAX products. Changes sync live to Website &amp; Mobile apps.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="p-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenCreateClass}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold text-xs hover:opacity-95 shadow-md flex items-center gap-2 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> Create New Class
          </button>
        </div>
      </div>

      {/* Control Bar: Search & Status Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0B132B] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search classes by title, description or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status:</span>
          {(['all', 'published', 'draft'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-[#0F172A] text-amber-400 font-extrabold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Classes Grid */}
      {isLoading ? (
        <div className="p-16 text-center text-slate-500 bg-white dark:bg-[#0B132B] rounded-2xl border border-slate-200 dark:border-slate-800">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold">Loading classes repository...</p>
        </div>
      ) : filteredPlaylists.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-[#0B132B] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <GraduationCap className="w-12 h-12 text-slate-400 mx-auto opacity-50" />
          <h3 className="font-serif font-bold text-lg text-slate-800 dark:text-white">No Classes Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all'
              ? 'Try changing your search terms or status filter.'
              : 'Click "Create New Class" above to add your first masterclass.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaylists.map((pl: any) => {
            const videoCount = pl.videos?.length || pl.videoCount || 0;
            const boundProduct = products.find((p) => p.id === pl.productId);

            return (
              <div
                key={pl.id}
                className="bg-white dark:bg-[#0B132B] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail Banner */}
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    <img
                      src={pl.thumbnailUrl || 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800'}
                      alt={pl.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Status Badge */}
                    <button
                      onClick={() => handleTogglePublished(pl)}
                      className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md transition-transform active:scale-95 ${
                        pl.isPublished
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                          : 'bg-amber-500 text-slate-900 hover:bg-amber-600'
                      }`}
                      title="Click to toggle Draft / Published status"
                    >
                      {pl.isPublished ? (
                        <>
                          <CheckCircle className="w-3 h-3" /> Published
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> Draft
                        </>
                      )}
                    </button>

                    {/* Price Pill */}
                    <span className="absolute bottom-3 right-3 bg-[#0F172A]/90 backdrop-blur-md text-amber-400 text-xs font-mono font-bold px-3 py-1 rounded-lg border border-amber-500/30">
                      ₹{pl.price}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span className="uppercase tracking-wider text-amber-600 dark:text-amber-400">{pl.category || 'Masterclass'}</span>
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-slate-400" /> {videoCount} {videoCount === 1 ? 'Video' : 'Videos'}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white line-clamp-1">
                      {pl.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {pl.description || 'No detailed description specified.'}
                    </p>

                    {boundProduct && (
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
                        <span className="font-semibold truncate">Linked Product: {boundProduct.title}</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">₹{boundProduct.basePrice}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenVideoManager(pl)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-900 text-white dark:bg-slate-800 hover:bg-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Video className="w-3.5 h-3.5 text-amber-400" /> Manage Videos ({videoCount})
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditClass(pl)}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                      title="Edit Class Details"
                    >
                      <Edit className="w-4 h-4 text-blue-500" />
                    </button>

                    <button
                      onClick={() => handleDeleteClass(pl.id, pl.title)}
                      className="p-2 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors"
                      title="Delete Class"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT CLASS MODAL */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0B132B] rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-5 bg-[#0F172A] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-amber-400" />
                <h3 className="font-serif font-bold text-lg">
                  {editingClass ? 'Edit Class & Masterclass' : 'Create New Class'}
                </h3>
              </div>
              <button onClick={() => setIsClassModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Class Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Botanical Hydrosol Distillation Masterclass"
                  value={classForm.title}
                  onChange={(e) => setClassForm({ ...classForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe what techniques and formulas customers will learn in this class..."
                  value={classForm.description}
                  onChange={(e) => setClassForm({ ...classForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={classForm.category}
                    onChange={(e) => setClassForm({ ...classForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                    Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={classForm.price}
                    onChange={(e) => setClassForm({ ...classForm, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Bind to CINMAX Product (Optional)
                </label>
                <select
                  value={classForm.productId}
                  onChange={(e) => setClassForm({ ...classForm, productId: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">None (Standalone Masterclass)</option>
                  {products.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.title} (₹{prod.basePrice})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Thumbnail Image URL
                </label>
                <input
                  type="url"
                  value={classForm.thumbnailUrl}
                  onChange={(e) => setClassForm({ ...classForm, thumbnailUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={classForm.isPublished}
                  onChange={(e) => setClassForm({ ...classForm, isPublished: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
                <label htmlFor="isPublished" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Publish class immediately (Visible to Website &amp; Mobile App)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createPlaylistMutation.isPending || updatePlaylistMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold text-xs shadow-md hover:opacity-95 disabled:opacity-50"
                >
                  {editingClass ? 'Update Class Details' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANAGE VIDEOS MODAL */}
      {isVideoModalOpen && selectedClassForVideo && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0B132B] rounded-3xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-[#0F172A] text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <Video className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="font-serif font-bold text-lg">
                    Manage Video Lessons: {selectedClassForVideo.title}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Add YouTube URLs, duration, titles and preview lesson playback.
                  </p>
                </div>
              </div>
              <button onClick={() => setIsVideoModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Form to Add/Edit Video */}
              <form onSubmit={handleSaveVideo} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="font-serif font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  {editingVideo ? 'Edit Video Lesson' : 'Add New Video Lesson to Class'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Lesson Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lesson 1: Botanical Extraction Techniques"
                      value={videoForm.title}
                      onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      YouTube Video URL or Embed Link *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      value={videoForm.youtubeUrl}
                      onChange={(e) => setVideoForm({ ...videoForm, youtubeUrl: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Duration String
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 18 Mins"
                      value={videoForm.duration}
                      onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Thumbnail URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={videoForm.thumbnailUrl}
                      onChange={(e) => setVideoForm({ ...videoForm, thumbnailUrl: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  {editingVideo && (
                    <button
                      type="button"
                      onClick={resetVideoForm}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={addVideoMutation.isPending || updateVideoMutation.isPending}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-sm flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {editingVideo ? 'Update Lesson' : 'Add Lesson to Class'}
                  </button>
                </div>
              </form>

              {/* Videos List */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-slate-900 dark:text-white">
                  Existing Lessons in this Class ({selectedClassForVideo.videos?.length || 0})
                </h4>

                {(!selectedClassForVideo.videos || selectedClassForVideo.videos.length === 0) ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No video lessons added yet. Use the form above to add your first video lesson.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedClassForVideo.videos.map((vid: any, idx: number) => (
                      <div
                        key={vid.id || idx}
                        className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                            {idx + 1}
                          </div>

                          <div className="min-w-0">
                            <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                              {vid.title}
                            </h5>
                            <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {vid.duration || '15 Mins'}
                              </span>
                              <span className="truncate max-w-[200px] text-blue-500 underline font-mono">
                                {vid.youtubeUrl || vid.youtubeId}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handlePreviewVideo(vid.youtubeUrl || `https://www.youtube.com/watch?v=${vid.youtubeId}`, vid.title)}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-[11px] font-bold flex items-center gap-1"
                          >
                            <PlayCircle className="w-3.5 h-3.5" /> Preview
                          </button>

                          <button
                            onClick={() => handleEditVideoItem(vid)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit Lesson"
                          >
                            <Edit className="w-3.5 h-3.5 text-blue-500" />
                          </button>

                          <button
                            onClick={() => handleDeleteVideo(vid.id)}
                            className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20"
                            title="Delete Lesson"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* YOUTUBE EMBED PREVIEW MODAL */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0B132B] rounded-3xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden space-y-4 p-5">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-red-500" />
                <h4 className="font-serif font-bold text-base text-slate-900 dark:text-white truncate">
                  Preview Lesson: {previewVideoTitle}
                </h4>
              </div>
              <button onClick={() => setPreviewVideoUrl(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-inner">
              <iframe
                src={parseYouTubeEmbedUrl(previewVideoUrl) || `https://www.youtube.com/embed/${previewVideoUrl}?autoplay=1`}
                title={previewVideoTitle}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
