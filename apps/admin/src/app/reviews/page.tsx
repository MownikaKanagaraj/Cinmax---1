'use client';

import * as React from 'react';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, Badge, RatingStars, Button } from '@cinmax/ui';
import { useReviewsQuery, useUpdateReviewStatusMutation } from '@cinmax/hooks';
import type { ReviewEntity } from '@cinmax/api';
import { Sparkles, Plus, Trash2, Edit2, Star, Image as ImageIcon, X } from 'lucide-react';

export default function AdminReviewsPage() {
  const { data: reviewsData } = useReviewsQuery();
  const updateStatusMutation = useUpdateReviewStatusMutation();

  const [activeTab, setActiveTab] = React.useState<'reviews' | 'results'>('results');

  const [realResults, setRealResults] = React.useState([
    {
      id: 'r1',
      before: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5BOW-AMfn4OYmw2raRZLFjyAXl9_Og2oljlyp6Ey3blAt0F58rE21Yc2kFmrF_m8w0_bszNhtfNPcsATPHO3DTKc5-xaT7Y0ZjBW1_TNzJioa5TZURDMTRt1t9pX3z-tlGfEKQwtCCItGZeCLGFICOAr2rCVYxeE6NlxuyABQQ3_aEL3gjrXGthTSnEDu44eD7saHOsvmf4hq5dtRwLMPjiu3W-zO2yCyhMDJBYPlz9EKgQiy_WhT',
      after: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBYYqfLzkyDJCgmUIN62zfpDnVNi80xAnbOwXMzWR_EC665r4W7a8jgxawqehE-NsGCjsao-u0awGHY1IawWevNQcSWP5uOLvmXo8iVoso9HXauK_4wWL6zedipG6xSlBnZ7PvBUQQw8SDi5OQEIzGlroqvATlo8emGKQmNpZkYbPTV5kb74HCXzfWSSdwZ-feAljIXulzIuzrRfkFuPTBDYlbTWpuPRjpYWGCmJD3d7oLoTXmRmLR',
      quote: '"My acne cleared in just 3 weeks!"',
      user: 'Ananya V. used Neem & Tea Tree Soap',
      isActive: true,
    },
    {
      id: 'r2',
      before: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSmwCmvA7_D8HomTuRM1h4-XIekacntzbTsKXAOZG-yS7i__CLwkYk_ZZ_UOnBrjjU8xOv5kTZV5YSZTE1ASD_krTM85OV_eoo2-OdqxYoW3fFM68y1SFpuzcDcdVOne23KTXLBIjJE2wpjkz-UngniFKww-KJQ-RfOZtIPghQaj9f-nc5GqCXz92BG7S8HGuPprjsgHU5ZXUr3XrOx9B1l-p0YjEDb7TIcTa1rXXxTZZvg6k87pnV',
      after: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4Vn-kpObT8hA33krBjhT874sGUANPgaNnCqeLWi4cdTn7XPL8hHvwiWiOJy8s4pA2TeUfQLer9uuetutL-BqlbyfGUwRXlbsDku2FVeRYPqNkvVUfUBU9DOrX137dmO2fuSNWqiEJUGpHxZUarqOK4deyr8MvM26JYCwqdoH2f6nR5-fDNBBjptXUum-NGLugvCOsk6E9eLos1suar0a-SACWpOkirGvowgxOjlO7t7OpaA5tfimw',
      quote: '"The glow is actually visible now."',
      user: 'Rahul S. used Sandalwood Serum',
      isActive: true,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    quote: '',
    user: '',
    before: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    after: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  });

  const handleCreateResult = (e: React.FormEvent) => {
    e.preventDefault();
    const newResult = {
      id: `r_${Date.now()}`,
      ...formData,
      isActive: true,
    };
    setRealResults([...realResults, newResult]);
    setIsModalOpen(false);
  };

  const handleDeleteResult = (id: string) => {
    setRealResults(realResults.filter((r) => r.id !== id));
  };

  const reviewsList: ReviewEntity[] = reviewsData?.items || [];
  const reviews = reviewsList.map((r: ReviewEntity) => ({
    id: r.id,
    author: r.authorName || 'Verified Customer',
    rating: r.rating,
    product: r.title || 'Store Product',
    comment: r.content,
    date: new Date(r.createdAt).toLocaleDateString(),
    status: r.isApproved ? 'published' : 'pending_moderation',
  }));

  return (
    <AdminLayout>
      <PageHeader
        badge="Customer Feedback"
        title="Customer Reviews & Feedback"
        subtitle="Manage customer reviews, star ratings, and customer transformation stories."
        actions={
          activeTab === 'results' ? (
            <Button variant="primary" size="sm" className="rounded-xl flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4" /> Add Before &amp; After Story
            </Button>
          ) : undefined
        }
      />

      {/* Tab Selector */}
      <div className="flex items-center gap-4 border-b border-[#0A3D78]/15 pt-4 pb-1">
        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'results'
              ? 'border-[#002754] text-[#002754] dark:text-[#C5A880]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Real Results (Before &amp; After) ({realResults.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'reviews'
              ? 'border-[#002754] text-[#002754] dark:text-[#C5A880]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Star className="w-4 h-4" /> Product Reviews ({reviews.length})
        </button>
      </div>

      {activeTab === 'results' ? (
        <div className="pt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C5A880]" /> Active Transformation Stories
            </h3>
            <span className="text-xs text-muted-foreground">Rendered live on Mobile &amp; Web Home Pages</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {realResults.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#071324] border border-[#0A3D78]/15 shadow-sm space-y-4 relative"
              >
                <div className="flex gap-3">
                  <div className="flex-1 aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 relative">
                    <img src={item.before} alt="Before" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Before
                    </span>
                  </div>
                  <div className="flex-1 aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 relative">
                    <img src={item.after} alt="After" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 bg-[#002754] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      After
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-xs text-[#002754] dark:text-white italic">
                    {item.quote}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {item.user}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteResult(item.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                  title="Remove Result"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4 pt-6">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-[#002754] dark:text-white">
                    {r.author}
                  </span>
                  <RatingStars rating={r.rating} size="sm" />
                  <Badge variant={r.status === 'published' ? 'success' : 'gold'}>
                    {r.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs font-semibold text-[#0A3D78] dark:text-[#C5A880]">
                  {r.product}
                </p>
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  "{r.comment}"
                </p>
                <p className="text-[10px] text-muted-foreground">Submitted on {r.date}</p>
              </div>

              <div className="flex gap-2">
                {r.status !== 'published' ? (
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-full text-xs"
                    onClick={() => updateStatusMutation.mutate({ id: r.id, status: 'approved' })}
                  >
                    Approve Review
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs"
                    onClick={() => updateStatusMutation.mutate({ id: r.id, status: 'rejected' })}
                  >
                    Unpublish
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Transformation Story Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#071324] rounded-3xl p-6 max-w-lg w-full border border-[#0A3D78]/20 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
              <h3 className="font-serif text-xl font-bold text-[#002754] dark:text-white">
                Add Real Result (Before &amp; After)
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateResult} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                  Customer Quote
                </label>
                <input
                  type="text"
                  required
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder='e.g. "My acne cleared in just 3 weeks!"'
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                  User &amp; Product Details
                </label>
                <input
                  type="text"
                  required
                  value={formData.user}
                  onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                  placeholder="e.g. Ananya V. used Neem & Tea Tree Soap"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                  Before Image URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.before}
                  onChange={(e) => setFormData({ ...formData, before: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002754] dark:text-white uppercase mb-1">
                  After Image URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.after}
                  onChange={(e) => setFormData({ ...formData, after: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Publish Transformation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
