'use client';

import * as React from 'react';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, Button } from '@cinmax/ui';
import {
  usePlaylistsQuery,
  useProductsQuery,
  useCreatePlaylistMutation,
  useUpdatePlaylistMutation,
  useDeletePlaylistMutation,
  useAddVideoToPlaylistMutation,
  useUpdatePlaylistVideoMutation,
  useDeletePlaylistVideoMutation,
} from '@cinmax/hooks';
import { getYouTubeVideoId, getYouTubeThumbnailUrl, parseYouTubeEmbedUrl } from '@cinmax/utils';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X,
  PlayCircle,
  ExternalLink,
  Package,
  Layers,
  ArrowUp,
  ArrowDown,
  Clock,
  Video,
} from 'lucide-react';

export default function AdminPlaylistsPage() {
  const { data: playlists = [], isLoading } = usePlaylistsQuery(false);
  const { data: rawProducts } = useProductsQuery();
  const products: any[] = Array.isArray(rawProducts) ? rawProducts : (rawProducts as any)?.data || [];

  const createPlaylist = useCreatePlaylistMutation();
  const updatePlaylist = useUpdatePlaylistMutation();
  const deletePlaylist = useDeletePlaylistMutation();
  const addVideo = useAddVideoToPlaylistMutation();
  const updateVideo = useUpdatePlaylistVideoMutation();
  const deleteVideo = useDeletePlaylistVideoMutation();

  // Selected Playlist & Modals State
  const [selectedPlaylist, setSelectedPlaylist] = React.useState<any | null>(null);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = React.useState(false);
  const [editingPlaylistId, setEditingPlaylistId] = React.useState<string | null>(null);

  const [isVideoModalOpen, setIsVideoModalOpen] = React.useState(false);
  const [editingVideoId, setEditingVideoId] = React.useState<string | null>(null);
  const [selectedPreviewVideo, setSelectedPreviewVideo] = React.useState<any | null>(null);

  // Playlist Form State
  const [playlistForm, setPlaylistForm] = React.useState({
    productId: '',
    title: '',
    description: '',
    thumbnailUrl: '',
    price: 299,
    isPublished: true,
  });

  // Video Form State
  const [videoForm, setVideoForm] = React.useState({
    title: '',
    youtubeUrl: '',
    thumbnailUrl: '',
    duration: '15 Mins',
    sortOrder: 1,
  });
  const [extractedYtId, setExtractedYtId] = React.useState<string | null>(null);

  // Set active preview when playlists load
  React.useEffect(() => {
    if (playlists.length > 0 && !selectedPlaylist) {
      setSelectedPlaylist(playlists[0]);
    }
  }, [playlists]);

  // Keep selectedPlaylist updated when playlists data changes
  React.useEffect(() => {
    if (selectedPlaylist) {
      const updated = playlists.find((p: any) => p.id === selectedPlaylist.id);
      if (updated) setSelectedPlaylist(updated);
    }
  }, [playlists]);

  const activePreviewVideo = selectedPreviewVideo || selectedPlaylist?.videos?.[0];

  // --- Playlist Modal Handlers ---
  const handleOpenCreatePlaylist = () => {
    setEditingPlaylistId(null);
    setPlaylistForm({
      productId: products[0]?.id || '',
      title: '',
      description: '',
      thumbnailUrl: '',
      price: 299,
      isPublished: true,
    });
    setIsPlaylistModalOpen(true);
  };

  const handleOpenEditPlaylist = (pl: any) => {
    setEditingPlaylistId(pl.id);
    setPlaylistForm({
      productId: pl.productId || products[0]?.id || '',
      title: pl.title || '',
      description: pl.description || '',
      thumbnailUrl: pl.thumbnailUrl || '',
      price: Math.max(0, Number(pl.price) || 299),
      isPublished: pl.isPublished ?? true,
    });
    setIsPlaylistModalOpen(true);
  };

  const handleSavePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistForm.productId) {
      alert('Please select a product for this playlist.');
      return;
    }

    if (editingPlaylistId) {
      updatePlaylist.mutate(
        { id: editingPlaylistId, payload: playlistForm },
        { onSuccess: () => setIsPlaylistModalOpen(false) }
      );
    } else {
      createPlaylist.mutate(playlistForm, {
        onSuccess: (newPl: any) => {
          setSelectedPlaylist(newPl);
          setIsPlaylistModalOpen(false);
        },
      });
    }
  };

  const handleTogglePublished = (pl: any) => {
    updatePlaylist.mutate({ id: pl.id, payload: { isPublished: !pl.isPublished } });
  };

  const handleDeletePlaylist = (id: string) => {
    if (confirm('Are you sure you want to delete this product playlist? All included videos will be deleted.')) {
      deletePlaylist.mutate(id, {
        onSuccess: () => {
          if (selectedPlaylist?.id === id) setSelectedPlaylist(null);
        },
      });
    }
  };

  // --- Video Management Handlers ---
  const handleYoutubeUrlChange = (url: string) => {
    const extracted = getYouTubeVideoId(url);
    setExtractedYtId(extracted);
    const autoThumb = extracted ? getYouTubeThumbnailUrl(url) : '';
    setVideoForm((prev) => ({
      ...prev,
      youtubeUrl: url,
      thumbnailUrl: prev.thumbnailUrl || autoThumb,
    }));
  };

  const handleOpenAddVideo = () => {
    if (!selectedPlaylist) return;
    setEditingVideoId(null);
    setExtractedYtId(null);
    setVideoForm({
      title: '',
      youtubeUrl: '',
      thumbnailUrl: '',
      duration: '15 Mins',
      sortOrder: (selectedPlaylist.videos?.length || 0) + 1,
    });
    setIsVideoModalOpen(true);
  };

  const handleOpenEditVideo = (vid: any) => {
    setEditingVideoId(vid.id);
    const extracted = vid.youtubeId || getYouTubeVideoId(vid.youtubeUrl);
    setExtractedYtId(extracted);
    setVideoForm({
      title: vid.title || '',
      youtubeUrl: vid.youtubeUrl || '',
      thumbnailUrl: vid.thumbnailUrl || '',
      duration: vid.duration || '15 Mins',
      sortOrder: vid.sortOrder || 1,
    });
    setIsVideoModalOpen(true);
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlaylist) return;

    const ytId = extractedYtId || getYouTubeVideoId(videoForm.youtubeUrl);
    if (!videoForm.youtubeUrl || !ytId) {
      alert('Please enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=... or https://youtu.be/...).');
      return;
    }

    const payload = {
      ...videoForm,
      youtubeId: ytId,
      thumbnailUrl: videoForm.thumbnailUrl || `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
    };

    if (editingVideoId) {
      updateVideo.mutate(
        { videoId: editingVideoId, payload },
        { onSuccess: () => setIsVideoModalOpen(false) }
      );
    } else {
      addVideo.mutate(
        { playlistId: selectedPlaylist.id, payload },
        { onSuccess: () => setIsVideoModalOpen(false) }
      );
    }
  };

  const handleDeleteVideo = (videoId: string) => {
    if (confirm('Are you sure you want to remove this video from the playlist?')) {
      deleteVideo.mutate(videoId);
    }
  };

  const handleReorderVideo = (index: number, direction: 'up' | 'down') => {
    if (!selectedPlaylist || !selectedPlaylist.videos) return;
    const videos = [...selectedPlaylist.videos];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= videos.length) return;

    // Swap videos
    const temp = videos[index];
    videos[index] = videos[targetIdx];
    videos[targetIdx] = temp;

    // Update sortOrder values
    const updatedVideos = videos.map((v, i) => ({
      ...v,
      sortOrder: i + 1,
    }));

    updatePlaylist.mutate({
      id: selectedPlaylist.id,
      payload: { videos: updatedVideos },
    });
  };

  return (
    <AdminLayout>
      <PageHeader
        badge="Academy & Playlists Manager"
        title="Product-Wise Playlist Management"
        subtitle="Create dedicated product playlists, attach YouTube videos, set playlist prices, and publish complete masterclass courses to Customer Web and Mobile apps."
        actions={
          <Button variant="primary" size="sm" className="rounded-full flex items-center gap-2" onClick={handleOpenCreatePlaylist}>
            <Plus className="w-4 h-4" /> Create New Playlist
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        
        {/* Left Column (4 cols): Playlist Cards List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-[#002754] dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#C5A880]" /> Product Playlists ({playlists.length})
            </h3>
            <span className="text-[11px] text-slate-500">Select to manage</span>
          </div>

          {isLoading ? (
            <div className="p-8 bg-white dark:bg-[#071324] rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
              Loading product playlists...
            </div>
          ) : playlists.length === 0 ? (
            <div className="p-8 bg-white dark:bg-[#071324] rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <GraduationCap className="w-10 h-10 text-[#002754] mx-auto opacity-60" />
              <p className="text-xs font-bold text-[#002754] dark:text-white">No playlists created yet.</p>
              <Button variant="outline" size="sm" onClick={handleOpenCreatePlaylist}>
                + Create First Playlist
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {playlists.map((pl: any) => {
                const isSelected = selectedPlaylist?.id === pl.id;
                const relatedProduct = products.find((p: any) => p.id === pl.productId);
                const videoCount = pl.videos?.length || pl.videoCount || 0;

                return (
                  <div
                    key={pl.id}
                    onClick={() => {
                      setSelectedPlaylist(pl);
                      setSelectedPreviewVideo(null);
                    }}
                    className={`p-4 rounded-2xl bg-white dark:bg-[#071324] border transition-all cursor-pointer shadow-xs hover:shadow-md space-y-3 ${
                      isSelected
                        ? 'border-[#002754] ring-2 ring-[#002754]/20'
                        : 'border-slate-200 dark:border-slate-800'
                    } ${!pl.isPublished ? 'opacity-65' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 relative">
                        <img
                          src={pl.thumbnailUrl || relatedProduct?.images?.[0]?.url || 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400'}
                          alt={pl.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          {videoCount} vids
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 truncate">
                            {relatedProduct?.title || pl.productTitle || 'Product Linked'}
                          </span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            pl.isPublished ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {pl.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>

                        <h4 className="font-serif font-bold text-xs text-[#002754] dark:text-white truncate">
                          {pl.title}
                        </h4>

                        <div className="flex items-center justify-between text-[11px] font-bold pt-1">
                          <span className="text-[#C5A880] font-serif">₹{pl.price} (Entire Playlist)</span>
                          <span className="text-slate-400 font-mono text-[9px]">ID: {pl.id.slice(0, 8)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Video className="w-3 h-3 text-slate-400" /> {videoCount} Classes / Videos Included
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleTogglePublished(pl)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            pl.isPublished
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                              : 'bg-slate-100 text-slate-400 border-slate-200'
                          }`}
                          title={pl.isPublished ? 'Unpublish Playlist' : 'Publish Playlist'}
                        >
                          {pl.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleOpenEditPlaylist(pl)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 dark:text-white"
                          title="Edit Playlist Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePlaylist(pl.id)}
                          className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                          title="Delete Playlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column (8 cols): Playlist Video Manager & Interactive Player Preview */}
        <div className="lg:col-span-8 space-y-6">
          {selectedPlaylist ? (
            <div className="space-y-6">
              
              {/* Selected Playlist Header Banner */}
              <div className="p-6 rounded-3xl bg-[#002754] text-white space-y-4 shadow-xl border border-[#C5A880]/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#C5A880] text-[#002754] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        PRODUCT PLAYLIST
                      </span>
                      <span className="text-[11px] text-slate-300 font-mono">Playlist ID: {selectedPlaylist.id}</span>
                    </div>
                    <h2 className="font-serif text-xl font-bold text-white">{selectedPlaylist.title}</h2>
                    <p className="text-xs text-slate-300 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-[#C5A880]" /> Linked Product: {' '}
                      <strong className="text-white">
                        {products.find((p: any) => p.id === selectedPlaylist.productId)?.title || selectedPlaylist.productTitle || selectedPlaylist.productId}
                      </strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-300 uppercase block font-semibold">Playlist Price</span>
                      <span className="text-xl font-serif font-bold text-[#C5A880]">₹{selectedPlaylist.price}</span>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleOpenAddVideo}
                      className="bg-[#C5A880] hover:bg-[#b0936b] text-[#002754] font-bold rounded-xl flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Add Video
                    </Button>
                  </div>
                </div>

                {selectedPlaylist.description && (
                  <p className="text-xs text-slate-300 leading-relaxed">{selectedPlaylist.description}</p>
                )}
              </div>

              {/* Video Player Preview Section */}
              {activePreviewVideo ? (
                <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-300 px-1">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <PlayCircle className="w-4 h-4 text-emerald-400" /> Previewing Video: {activePreviewVideo.title}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">YouTube ID: {activePreviewVideo.youtubeId}</span>
                  </div>
                  <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-inner">
                    <iframe
                      src={parseYouTubeEmbedUrl(activePreviewVideo.youtubeUrl) || `https://www.youtube.com/embed/${activePreviewVideo.youtubeId}`}
                      title={activePreviewVideo.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : null}

              {/* Videos List Table / Cards */}
              <div className="bg-white dark:bg-[#071324] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white flex items-center gap-2">
                      <Video className="w-5 h-5 text-blue-600" /> Playlist Videos ({selectedPlaylist.videos?.length || 0})
                    </h3>
                    <p className="text-xs text-slate-500">Arrange order, edit titles, or remove videos from this playlist.</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleOpenAddVideo} className="rounded-xl flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Add Video
                  </Button>
                </div>

                {(!selectedPlaylist.videos || selectedPlaylist.videos.length === 0) ? (
                  <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                    <Video className="w-10 h-10 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">No YouTube videos added to this playlist yet.</p>
                    <Button variant="primary" size="sm" onClick={handleOpenAddVideo}>
                      + Add First YouTube Video
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedPlaylist.videos.map((vid: any, idx: number) => {
                      const isPreviewing = activePreviewVideo?.id === vid.id;

                      return (
                        <div
                          key={vid.id || idx}
                          className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                            isPreviewing
                              ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800'
                              : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Sort Order Reorder Controls */}
                            <div className="flex flex-col gap-0.5">
                              <button
                                disabled={idx === 0}
                                onClick={() => handleReorderVideo(idx, 'up')}
                                className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                disabled={idx === selectedPlaylist.videos.length - 1}
                                onClick={() => handleReorderVideo(idx, 'down')}
                                className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Video Thumbnail */}
                            <div
                              onClick={() => setSelectedPreviewVideo(vid)}
                              className="w-16 h-10 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0 cursor-pointer relative group"
                            >
                              <img
                                src={vid.thumbnailUrl || `https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                                alt={vid.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <PlayCircle className="w-5 h-5 text-white opacity-90" />
                              </div>
                            </div>

                            {/* Video Metadata */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-extrabold bg-[#002754] text-white px-2 py-0.5 rounded-full">
                                  #{idx + 1}
                                </span>
                                <h4 className="font-bold text-xs text-[#002754] dark:text-white truncate">
                                  {vid.title}
                                </h4>
                              </div>
                              <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-0.5">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" /> {vid.duration || '15 Mins'}
                                </span>
                                <span className="font-mono text-slate-400 truncate">ID: {vid.youtubeId}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            <a
                              href={vid.youtubeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg"
                              title="Open on YouTube"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => handleOpenEditVideo(vid)}
                              className="p-1.5 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg"
                              title="Edit Video Details"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteVideo(vid.id)}
                              className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-950/50 rounded-lg"
                              title="Remove Video from Playlist"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="p-12 bg-white dark:bg-[#071324] rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <Layers className="w-12 h-12 text-[#002754] mx-auto opacity-50" />
              <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">Select a Playlist to Manage</h3>
              <p className="text-xs text-slate-500">Choose a product playlist from the left catalog or create a new one.</p>
            </div>
          )}
        </div>

      </div>

      {/* --- CREATE / EDIT PLAYLIST MODAL --- */}
      {isPlaylistModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#071324] rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
              <h3 className="font-serif text-xl font-bold text-[#002754] dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#C5A880]" />
                {editingPlaylistId ? 'Edit Playlist Details' : 'Create New Product Playlist'}
              </h3>
              <button onClick={() => setIsPlaylistModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlaylist} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                  Select Related Product *
                </label>
                <select
                  required
                  value={playlistForm.productId}
                  onChange={(e) => setPlaylistForm({ ...playlistForm, productId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold text-[#002754] dark:text-white"
                >
                  <option value="">-- Choose Product --</option>
                  {products.map((prod: any) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.title} (₹{prod.basePrice})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">Each playlist must be linked directly to its intended product.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                  Playlist Title *
                </label>
                <input
                  type="text"
                  required
                  value={playlistForm.title}
                  onChange={(e) => setPlaylistForm({ ...playlistForm, title: e.target.value })}
                  placeholder="e.g. Master Botanical Soapmaking Class"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                  Playlist Description
                </label>
                <textarea
                  rows={3}
                  value={playlistForm.description}
                  onChange={(e) => setPlaylistForm({ ...playlistForm, description: e.target.value })}
                  placeholder="Describe the topics, formulation secrets, or botanical craftsmanship taught in this playlist..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                    Entire Playlist Price (₹ INR) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={playlistForm.price}
                    onChange={(e) => setPlaylistForm({ ...playlistForm, price: Math.max(0, Number(e.target.value)) })}
                    placeholder="299"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">One single payment unlocks all videos inside</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                    Custom Thumbnail Image URL
                  </label>
                  <input
                    type="url"
                    value={playlistForm.thumbnailUrl}
                    onChange={(e) => setPlaylistForm({ ...playlistForm, thumbnailUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-[#002754] dark:text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={playlistForm.isPublished}
                    onChange={(e) => setPlaylistForm({ ...playlistForm, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-[#002754]"
                  />
                  Publish Playlist Immediately on Customer Web &amp; Mobile Apps
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsPlaylistModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  {editingPlaylistId ? 'Save Playlist' : 'Create Playlist'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT VIDEO MODAL --- */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#071324] rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
              <h3 className="font-serif text-xl font-bold text-[#002754] dark:text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-600" />
                {editingVideoId ? 'Edit Playlist Video' : 'Add YouTube Video to Playlist'}
              </h3>
              <button onClick={() => setIsVideoModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                  YouTube Video Link / URL *
                </label>
                <input
                  type="url"
                  required
                  value={videoForm.youtubeUrl}
                  onChange={(e) => handleYoutubeUrlChange(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                />
                {extractedYtId && (
                  <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Extracted YouTube ID: {extractedYtId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                  Video Title / Lesson Name *
                </label>
                <input
                  type="text"
                  required
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  placeholder="e.g. Lesson 1: Introduction to Botanical Soap Chemistry"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                    Estimated Duration
                  </label>
                  <input
                    type="text"
                    value={videoForm.duration}
                    onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                    placeholder="15 Mins"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                    Display Sequence Order
                  </label>
                  <input
                    type="number"
                    value={videoForm.sortOrder}
                    onChange={(e) => setVideoForm({ ...videoForm, sortOrder: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                  Custom Video Thumbnail URL (Optional)
                </label>
                <input
                  type="url"
                  value={videoForm.thumbnailUrl}
                  onChange={(e) => setVideoForm({ ...videoForm, thumbnailUrl: e.target.value })}
                  placeholder="Auto-generated from YouTube if left blank"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsVideoModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  {editingVideoId ? 'Save Video' : 'Add to Playlist'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
