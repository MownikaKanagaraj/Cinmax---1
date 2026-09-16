'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, Button } from '@cinmax/ui';
import { formatCurrency } from '@cinmax/utils';
import { useProductsQuery, useCategoriesQuery, useDeleteProductMutation, useUpdateProductMutation } from '@cinmax/hooks';
import type { Product } from '@cinmax/types';
import {
  Sparkles,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Star,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

// Robust botanical image resolver
const getProductImage = (p: Product) => {
  if (p.images?.[0]?.url && p.images[0].url.startsWith('http') && !p.images[0].url.includes('520e7df6504a')) {
    return p.images[0].url;
  }
  const slug = (p.slug || '').toLowerCase();
  const title = (p.title || '').toLowerCase();
  if (slug.includes('pine') || slug.includes('volcanic') || slug.includes('scrub') || title.includes('pine')) {
    return 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&auto=format&fit=crop&q=80';
  }
  if (slug.includes('lavender') || slug.includes('cashmere') || title.includes('lavender')) {
    return 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&auto=format&fit=crop&q=80';
  }
  if (slug.includes('marine') || slug.includes('kelp') || slug.includes('azure') || title.includes('marine')) {
    return 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80';
  }
  if (slug.includes('clay') || slug.includes('eucalyptus') || title.includes('clay')) {
    return 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&auto=format&fit=crop&q=80';
  }
  if (slug.includes('charcoal') || slug.includes('tea-tree') || title.includes('charcoal')) {
    return 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=400&auto=format&fit=crop&q=80';
  }
  return 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&auto=format&fit=crop&q=80';
};

const getNormalizedPrice = (p: Product) => {
  if (p.basePrice >= 100) return { base: p.basePrice, compare: p.compareAtPrice };
  const base = Math.round(p.basePrice * 22); // 18 -> 396, 16.5 -> 363, 20 -> 440
  const compare = p.compareAtPrice ? Math.round(p.compareAtPrice * 22) : null;
  return { base, compare };
};

export default function AdminProductsPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('search') || searchParams.get('q') || '';
  const [search, setSearch] = React.useState(initialQuery);

  React.useEffect(() => {
    const q = searchParams.get('search') || searchParams.get('q');
    if (q !== null) {
      setSearch(q);
    }
  }, [searchParams]);

  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [processFilter, setProcessFilter] = React.useState('all');
  const [stockFilter, setStockFilter] = React.useState('all');
  const [sortBy, setSortBy] = React.useState<'default' | 'price_asc' | 'price_desc' | 'name'>('default');

  const { data: serverProductsData } = useProductsQuery();
  const { data: categories = [] } = useCategoriesQuery();

  const [products, setProducts] = React.useState<Product[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (serverProductsData?.items) {
      setProducts(serverProductsData.items);
    }
  }, [serverProductsData]);

  const deleteProductMutation = useDeleteProductMutation();
  const updateProductMutation = useUpdateProductMutation();

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirmId(null);
    deleteProductMutation.mutate(id);
  };

  const handleToggleFeatured = (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const newFeaturedState = !target.isFeatured;
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFeatured: newFeaturedState } : p))
    );
    updateProductMutation.mutate({
      id,
      isFeatured: newFeaturedState,
    });
  };

  // Filter & Sort Logic
  const filteredProducts = products
    .filter((p) => {
      const matchesSearch =
        search === '' ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase()) ||
        (p.category?.name && p.category.name.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        categoryFilter === 'all' ||
        p.categoryId === categoryFilter ||
        p.category?.slug === categoryFilter;

      const matchesProcess =
        processFilter === 'all' ||
        (p as any).processType === processFilter ||
        (p.subtitle && p.subtitle.toLowerCase().includes(processFilter.toLowerCase()));

      const stock = (p as any).stock ?? 25;
      const matchesStock =
        stockFilter === 'all' ||
        (stockFilter === 'in_stock' && stock > 5) ||
        (stockFilter === 'low_stock' && stock <= 5);

      return matchesSearch && matchesCategory && matchesProcess && matchesStock;
    })
    .sort((a, b) => {
      const priceA = getNormalizedPrice(a).base;
      const priceB = getNormalizedPrice(b).base;
      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      return 0;
    });

  const lowStockCount = products.filter((p) => ((p as any).stock ?? 25) <= 5).length;
  const averagePrice =
    products.length > 0
      ? Math.round(
          products.reduce((acc, p) => acc + getNormalizedPrice(p).base, 0) / products.length
        )
      : 399;

  return (
    <AdminLayout>
      <PageHeader
        badge="Botanical Catalog"
        title="Products & Catalog Management"
        subtitle="Formulate botanical listings, configure variant packaging, manage cure schedules, and track active stock."
        actions={
          <Link
            href="/products/new"
            prefetch={true}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </Link>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between group">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Formulations</p>
            <p className="text-2xl font-black text-[#0F172A] dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{products.length} Items</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800 group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between group">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Featured Best Sellers</p>
            <p className="text-2xl font-black text-amber-500 dark:text-amber-400 mt-1">
              {products.filter((p) => p.isFeatured).length} Active
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-500 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800 group-hover:scale-110 transition-transform">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between group">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Low Stock Warnings</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {lowStockCount === 0 ? '0 Items' : `${lowStockCount} Items`}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between group">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Average Unit Price</p>
            <p className="text-2xl font-black text-[#0F172A] dark:text-white mt-1">
              {formatCurrency(averagePrice)}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800 group-hover:scale-110 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>


      {/* Filters & Search Toolbar */}
      <div className="my-6 space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="w-full lg:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, botanical, or slug..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 text-[#0F172A] dark:text-white outline-none focus:border-blue-600 shadow-sm font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:border-blue-600 shadow-sm font-semibold"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Process Filter */}
            <select
              value={processFilter}
              onChange={(e) => setProcessFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:border-blue-600 shadow-sm font-semibold"
            >
              <option value="all">All Soap Processes</option>
              <option value="cold-process">Cold-Process</option>
              <option value="triple-milled">Triple-Milled</option>
              <option value="melt-and-pour">Melt &amp; Pour</option>
              <option value="liquid-botanical">Liquid Botanical</option>
              <option value="whipped-butter">Whipped Butter</option>
            </select>

            {/* Stock Status Filter */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:border-blue-600 shadow-sm font-semibold"
            >
              <option value="all">All Stock Status</option>
              <option value="in_stock">In Stock (&gt; 5)</option>
              <option value="low_stock">Low Stock (≤ 5)</option>
            </select>

            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:border-blue-600 shadow-sm font-semibold"
            >
              <option value="default">Sort: Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <p className="font-bold text-sm text-[#0F172A] dark:text-white">No products found matching filters</p>
            <p className="text-xs text-slate-400">Try resetting filters or search query to view all catalog items.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="pb-3">Product Name &amp; Formula</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Base Price</th>
                  <th className="pb-3">Stock Level</th>
                  <th className="pb-3">Featured</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredProducts.map((p: Product) => {
                  const stock = (p as any).stock ?? 25;
                  const isLowStock = stock <= 5;
                  const imgUrl = getProductImage(p);
                  const { base, compare } = getNormalizedPrice(p);

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors group"
                    >
                      {/* Product details with resilient image */}
                      <td className="py-4 font-bold text-[#0F172A] dark:text-white flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex-shrink-0 relative shadow-sm">
                          <img
                            src={imgUrl}
                            alt={p.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&auto=format&fit=crop&q=80';
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-xs text-[#0F172A] dark:text-white truncate">
                              {p.title}
                            </p>
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono truncate">{p.slug}</p>
                          <p className="text-[10px] text-slate-500 font-medium truncate">
                            {p.subtitle || 'Organic Cold Process Soap'}
                          </p>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 font-medium text-slate-600 dark:text-slate-300">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          {p.category?.name || 'Cold-Process Soaps'}
                        </span>
                      </td>

                      {/* Price in INR */}
                      <td className="py-4">
                        <p className="font-bold text-xs text-[#0F172A] dark:text-white">
                          {formatCurrency(base)}
                        </p>
                        {compare && compare > base && (
                          <p className="text-[10px] text-slate-400 line-through">
                            {formatCurrency(compare)}
                          </p>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 w-fit ${
                            isLowStock
                              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                              : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isLowStock ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                            }`}
                          ></span>
                          {stock} Units
                        </span>
                      </td>

                      {/* Interactive Featured Toggle Badge */}
                      <td className="py-4">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(p.id)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
                            p.isFeatured
                              ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                          title={p.isFeatured ? 'Click to remove from VIP featured' : 'Click to feature on home'}
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              p.isFeatured ? 'fill-amber-500 text-amber-500' : 'text-slate-400'
                            }`}
                          />
                          <span>{p.isFeatured ? 'Featured' : 'Standard'}</span>
                        </button>
                      </td>

                      {/* Active Status */}
                      <td className="py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          Active
                        </span>
                      </td>

                      {/* Action Links */}
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/products/${p.id}`}
                            prefetch={true}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors inline-flex items-center gap-1 shadow-sm"
                            title="Edit Formulation"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-[#0F172A] dark:text-white">Delete Formulation?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to permanently remove this botanical product from the catalog?
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

