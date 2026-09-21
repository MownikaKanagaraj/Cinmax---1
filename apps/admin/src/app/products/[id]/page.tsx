'use client';

export const runtime = 'edge';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminLayout } from '../../../components/admin-layout';
import { PageHeader } from '@cinmax/ui';
import {
  useProductByIdQuery,
  useCategoriesQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '@cinmax/hooks';
import type { Category } from '@cinmax/types';
import { ProductImagesUploader, type ProductImageItem } from '../../../components/product-images-uploader';
import {
  Sparkles,
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  Image as ImageIcon,
  DollarSign,
  Layers,
  Leaf,
  Info,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  Tag,
  ShieldCheck,
} from 'lucide-react';

export interface VariantItem {
  id?: string;
  title: string;
  sizeValue: string;
  sizeUnit: 'ml' | 'g' | 'oz' | 'units' | 'pack';
  sku: string;
  price: string;
  compareAtPrice: string;
  inventoryQuantity: string;
  lowStockThreshold: string;
  isAvailable: boolean;
  details: string;
}

export default function AdminEditProductPage() {
  const params = useParams();
  const router = useRouter();
  const prodId = (params?.id as string) || '';

  const { data: product, isLoading, error: fetchError } = useProductByIdQuery(prodId, {
    enabled: Boolean(prodId),
  });
  const { data: categories = [] } = useCategoriesQuery();
  const updateProductMutation = useUpdateProductMutation();
  const deleteProductMutation = useDeleteProductMutation();

  // Primary Info
  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [brand, setBrand] = React.useState('CINMAX');
  const [subtitle, setSubtitle] = React.useState('');
  const [categoryId, setCategoryId] = React.useState('');
  const [processType, setProcessType] = React.useState<'cold-process' | 'triple-milled' | 'melt-and-pour' | 'liquid-botanical' | 'whipped-butter'>('cold-process');
  const [cureDuration, setCureDuration] = React.useState('42 Days Slow Cold-Process');
  const [fragranceFamily, setFragranceFamily] = React.useState<'herbal' | 'citrus' | 'woody' | 'floral' | 'earthy' | 'aquatic' | 'spicy' | 'unscented'>('herbal');
  const [description, setDescription] = React.useState('');
  const [howToUse, setHowToUse] = React.useState('');

  // Base Pricing & Inventory
  const [basePrice, setBasePrice] = React.useState('199');
  const [compareAtPrice, setCompareAtPrice] = React.useState('');
  const [stock, setStock] = React.useState('50');
  const [weightGrams, setWeightGrams] = React.useState('100');

  // Images
  const [images, setImages] = React.useState<ProductImageItem[]>([]);
  const [isUploadingImages, setIsUploadingImages] = React.useState(false);

  // Variants
  const [variants, setVariants] = React.useState<VariantItem[]>([]);
  const [activeVariantIndex, setActiveVariantIndex] = React.useState<number>(0);

  // Ingredients
  const [ingredients, setIngredients] = React.useState<
    { name: string; isOrganic: boolean; isKeyBotanical: boolean; purpose?: string }[]
  >([]);
  const [newIngName, setNewIngName] = React.useState('');
  const [newIngPurpose, setNewIngPurpose] = React.useState('');
  const [newIngOrganic, setNewIngOrganic] = React.useState(true);
  const [newIngKey, setNewIngKey] = React.useState(false);

  // Skin / Hair Types
  const [skinTypes, setSkinTypes] = React.useState<string[]>([]);
  const [certifications, setCertifications] = React.useState<string[]>([]);
  const [trustBadges, setTrustBadges] = React.useState<string[]>([]);

  // Visibility Controls
  const [isActive, setIsActive] = React.useState(true);
  const [isFeatured, setIsFeatured] = React.useState(false);
  const [isNew, setIsNew] = React.useState(false);

  // Form State
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);

  // Populate data when loaded
  React.useEffect(() => {
    if (product) {
      setTitle(product.title || '');
      setSlug(product.slug || '');
      setBrand(product.brand || 'CINMAX');
      setSubtitle(product.subtitle || '');
      setCategoryId(product.categoryId || '');
      setProcessType((product.processType as any) || 'cold-process');
      setDescription(product.description || '');
      setHowToUse(product.howToUse || '');
      setBasePrice(String(product.basePrice || 199));
      setCompareAtPrice(product.compareAtPrice ? String(product.compareAtPrice) : '');
      setIsActive(product.isActive !== undefined ? Boolean(product.isActive) : true);
      setIsFeatured(Boolean(product.isFeatured));
      setIsNew(Boolean(product.isNew));
      setFragranceFamily((product.fragranceFamily as any) || 'herbal');
      setSkinTypes(product.skinTypes || ['All Types']);
      setCertifications(product.certifications || []);
      setTrustBadges(product.trustBadges || ['HANDCRAFTED', 'CRUELTY-FREE', 'VEGAN']);

      // Load Images
      if (product.images && product.images.length > 0) {
        setImages(
          product.images.map((img: any, idx: number) => ({
            id: img.id || `img_${idx}`,
            url: img.url,
            previewUrl: img.url,
            alt: img.alt || img.altText || product.title,
            isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0,
            uploading: false,
          }))
        );
      } else {
        setImages([]);
      }

      // Load Variants
      if (product.variants && product.variants.length > 0) {
        setVariants(
          product.variants.map((v) => {
            const isMl = Boolean(v.volumeMl);
            const sizeVal = isMl ? String(v.volumeMl) : v.weightGrams ? String(v.weightGrams) : (v.options?.size?.split(' ')[0] || '100');
            const unitVal = (v.options?.unit as any) || (isMl ? 'ml' : 'g');

            return {
              id: v.id,
              title: v.title,
              sizeValue: sizeVal,
              sizeUnit: unitVal,
              sku: v.sku,
              price: String(v.price),
              compareAtPrice: v.compareAtPrice ? String(v.compareAtPrice) : '',
              inventoryQuantity: String(v.inventoryQuantity ?? 25),
              lowStockThreshold: String(v.lowStockThreshold ?? 10),
              isAvailable: v.isAvailable !== undefined ? v.isAvailable : true,
              details: v.options?.details || '',
            };
          })
        );
      } else {
        setVariants([
          {
            title: 'Standard (100 ml)',
            sizeValue: '100',
            sizeUnit: 'ml',
            sku: `CNX-${(product.slug || 'PROD').toUpperCase()}-100ML`,
            price: String(product.basePrice || 199),
            compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : '',
            inventoryQuantity: '50',
            lowStockThreshold: '10',
            isAvailable: true,
            details: 'Standard edition',
          },
        ]);
      }

      // Load Ingredients
      if (product.ingredients && product.ingredients.length > 0) {
        setIngredients(
          product.ingredients.map((ing: any) => ({
            name: ing.name || ing.commonName || '',
            purpose: ing.purpose || ing.function || '',
            isOrganic: ing.isOrganic !== undefined ? ing.isOrganic : true,
            isKeyBotanical: ing.isKeyBotanical || ing.isHeroIngredient || false,
          }))
        );
      }
    }
  }, [product]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="py-24 text-center text-slate-400 font-sans text-sm flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
          <span>Loading product formulation details from database...</span>
        </div>
      </AdminLayout>
    );
  }

  if (fetchError || !product) {
    return (
      <AdminLayout>
        <div className="py-16 text-center space-y-4">
          <p className="text-rose-600 font-bold text-sm">Product formulation could not be loaded.</p>
          <Link
            href="/products"
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Catalog
          </Link>
        </div>
      </AdminLayout>
    );
  }



  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngName.trim()) return;
    setIngredients([
      ...ingredients,
      {
        name: newIngName.trim(),
        purpose: newIngPurpose.trim() || undefined,
        isOrganic: newIngOrganic,
        isKeyBotanical: newIngKey,
      },
    ]);
    setNewIngName('');
    setNewIngPurpose('');
    setNewIngOrganic(true);
    setNewIngKey(false);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, idx) => idx !== index));
  };

  // Variant Actions
  const handleAddVariant = () => {
    const nextSize = (variants.length + 1) * 100;
    const baseSlug = (slug || 'PROD').toUpperCase();
    const newVar: VariantItem = {
      title: `${nextSize} ml`,
      sizeValue: String(nextSize),
      sizeUnit: 'ml',
      sku: `CNX-${baseSlug}-${nextSize}ML`,
      price: String(Math.round(Number(basePrice || 199) * (1 + variants.length * 0.75))),
      compareAtPrice: '',
      inventoryQuantity: '30',
      lowStockThreshold: '10',
      isAvailable: true,
      details: `Edition ${variants.length + 1}`,
    };
    const updated = [...variants, newVar];
    setVariants(updated);
    setActiveVariantIndex(updated.length - 1);
  };

  const handleDuplicateVariant = (index: number) => {
    const src = variants[index];
    const numSize = Number(src.sizeValue) || 100;
    const newSize = numSize * 2;
    const baseSlug = (slug || 'PROD').toUpperCase();
    const duplicated: VariantItem = {
      ...src,
      id: undefined, // New ID generated by backend
      title: `${newSize} ${src.sizeUnit}`,
      sizeValue: String(newSize),
      sku: `CNX-${baseSlug}-${newSize}${src.sizeUnit.toUpperCase()}`,
      price: String(Math.round(Number(src.price || 199) * 1.8)),
      compareAtPrice: src.compareAtPrice ? String(Math.round(Number(src.compareAtPrice) * 1.8)) : '',
      inventoryQuantity: String(src.inventoryQuantity || 25),
      details: `${src.details || 'Artisanal'} (Double Size)`,
    };
    const updated = [...variants, duplicated];
    setVariants(updated);
    setActiveVariantIndex(updated.length - 1);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 1) return;
    const updated = variants.filter((_, idx) => idx !== index);
    setVariants(updated);
    if (activeVariantIndex >= updated.length) {
      setActiveVariantIndex(Math.max(0, updated.length - 1));
    }
  };

  const updateActiveVariant = (field: keyof VariantItem, value: any) => {
    setVariants((prev) => {
      const copy = [...prev];
      if (!copy[activeVariantIndex]) return prev;
      copy[activeVariantIndex] = {
        ...copy[activeVariantIndex],
        [field]: value,
      };

      if (field === 'sizeValue' || field === 'sizeUnit') {
        const val = field === 'sizeValue' ? value : copy[activeVariantIndex].sizeValue;
        const unit = field === 'sizeUnit' ? value : copy[activeVariantIndex].sizeUnit;
        if (val) {
          copy[activeVariantIndex].title = `${val} ${unit}`;
          if (!copy[activeVariantIndex].sku || copy[activeVariantIndex].sku.startsWith('CNX-')) {
            copy[activeVariantIndex].sku = `CNX-${(slug || 'PROD').toUpperCase()}-${val}${unit.toUpperCase()}`;
          }
        }
      }

      return copy;
    });
  };

  const toggleSkinType = (type: string) => {
    setSkinTypes(
      skinTypes.includes(type) ? skinTypes.filter((t) => t !== type) : [...skinTypes, type]
    );
  };

  const toggleCertification = (cert: string) => {
    setCertifications(
      certifications.includes(cert)
        ? certifications.filter((c) => c !== cert)
        : [...certifications, cert]
    );
  };

  // Active Variant computed discount
  const curVariant = variants[activeVariantIndex] || variants[0];
  const curVarPrice = Number(curVariant?.price) || 0;
  const curVarCompare = Number(curVariant?.compareAtPrice) || 0;
  const curVarDiscount =
    curVarCompare > curVarPrice && curVarCompare > 0
      ? Math.round(((curVarCompare - curVarPrice) / curVarCompare) * 100)
      : 0;
  const curVarSavings = curVarCompare > curVarPrice ? curVarCompare - curVarPrice : 0;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation
    if (!title.trim()) {
      setErrorMessage('Product title is required.');
      return;
    }
    if (!slug.trim()) {
      setErrorMessage('Product URL slug is required.');
      return;
    }
    if (!categoryId) {
      setErrorMessage('Please select a category.');
      return;
    }
    if (variants.length === 0) {
      setErrorMessage('At least one product variant is required.');
      return;
    }

    if (isUploadingImages || images.some((img) => img.uploading)) {
      setErrorMessage('Please wait for product images to finish uploading before saving.');
      return;
    }

    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.title.trim()) {
        setErrorMessage(`Variant #${i + 1} requires a name/title.`);
        setActiveVariantIndex(i);
        return;
      }
      const numP = Number(v.price);
      if (isNaN(numP) || numP <= 0) {
        setErrorMessage(`Variant "${v.title}" must have a price greater than ₹0.`);
        setActiveVariantIndex(i);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const preparedVariants = variants.map((v, idx) => {
        const isMl = v.sizeUnit === 'ml';
        const numVal = Number(v.sizeValue) || undefined;
        return {
          id: v.id,
          title: v.title.trim(),
          sku: v.sku.trim() || `CNX-${slug.toUpperCase()}-${v.sizeValue || idx + 1}${v.sizeUnit.toUpperCase()}`,
          weightGrams: !isMl ? numVal : undefined,
          volumeMl: isMl ? numVal : undefined,
          price: Number(v.price),
          compareAtPrice: v.compareAtPrice && Number(v.compareAtPrice) > 0 ? Number(v.compareAtPrice) : null,
          inventoryQuantity: Number(v.inventoryQuantity) || 0,
          lowStockThreshold: Number(v.lowStockThreshold) || 10,
          isAvailable: v.isAvailable,
          options: {
            size: `${v.sizeValue} ${v.sizeUnit}`,
            unit: v.sizeUnit,
            details: v.details?.trim() || undefined,
          },
        };
      });

      const primaryVariant = preparedVariants[0];
      const mainBasePrice = primaryVariant?.price || Number(basePrice) || 199;
      const mainComparePrice = primaryVariant?.compareAtPrice || (Number(compareAtPrice) > 0 ? Number(compareAtPrice) : null);

      const payload = {
        id: prodId,
        title: title.trim(),
        slug: slug.trim(),
        brand: brand.trim() || 'CINMAX',
        subtitle: subtitle.trim() || undefined,
        description: description.trim(),
        howToUse: howToUse.trim() || undefined,
        processType,
        categoryId,
        basePrice: mainBasePrice,
        compareAtPrice: mainComparePrice,
        currency: 'INR',
        stock: preparedVariants.reduce((acc, v) => acc + (v.inventoryQuantity || 0), 0),
        weightGrams: primaryVariant?.weightGrams || Number(weightGrams) || 100,
        skinTypes,
        fragranceFamily,
        certifications,
        trustBadges,
        isFeatured,
        isNew,
        isActive,
        images: images.map((img, idx) => ({
          url: img.url,
          alt: img.alt || title,
          isPrimary: img.isPrimary,
          sortOrder: idx,
        })),
        variants: preparedVariants,
        ingredients: ingredients.map((ing, idx) => ({
          name: ing.name,
          purpose: ing.purpose,
          isOrganic: ing.isOrganic,
          isKeyBotanical: ing.isKeyBotanical,
          sortOrder: idx,
        })),
      };

      await updateProductMutation.mutateAsync(payload as any);

      setSuccessMessage('Product formulation & variants saved and persisted in the database successfully!');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
      setIsSubmitting(false);
    } catch (err: any) {
      console.error('Failed to update product:', err);
      setErrorMessage(err.message || 'Failed to update product formulation in database.');
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProductMutation.mutateAsync(prodId);
      router.push('/products');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete product.');
      setDeleteConfirm(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-2 mb-6">
        <Link
          href="/products"
          prefetch={true}
          className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Product Catalog
        </Link>
      </div>

      <PageHeader
        badge="Formulation Laboratory"
        title={`Edit: ${title || product.title}`}
        subtitle={`Database ID: ${product.id} • SKU: CNX-${(slug || product.slug || 'PROD').toUpperCase()}`}
        actions={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDeleteConfirm(true)}
              className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Product
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {isSubmitting ? 'Saving to Database...' : 'Save Changes'}
            </button>
          </div>
        }
      />

      {/* Inline Feedback Alerts */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-3 shadow-sm my-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-3 shadow-sm my-4">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="max-w-5xl pt-4 space-y-8 pb-16">
        {/* Section 1: Primary Specifications */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                1. Primary Specifications &amp; Brand
              </h3>
              <p className="text-xs text-slate-400">Core listing identity, brand name, and canonical category</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
                Product Title / Name *
              </label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Herbal Hair Oil"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#0F172A] dark:text-white outline-none focus:border-blue-600 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
                Brand *
              </label>
              <input
                required
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="CINMAX"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#0F172A] dark:text-white outline-none focus:border-blue-600 font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
                URL Slug *
              </label>
              <input
                required
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#0F172A] dark:text-white outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
                Category *
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#0F172A] dark:text-white font-semibold outline-none focus:border-blue-600"
              >
                {categories.map((c: Category) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
                Subtitle / Overview Tagline
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#0F172A] dark:text-white outline-none focus:border-blue-600 font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
                Product Description *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#0F172A] dark:text-white outline-none focus:border-blue-600 leading-relaxed font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 2: PRODUCT VARIANTS MANAGER */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0B132B] border border-blue-200/80 dark:border-blue-900/60 shadow-lg shadow-blue-500/5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/80 flex items-center justify-center text-blue-600">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#0F172A] dark:text-white flex items-center gap-2">
                  <span>2. Product Variants &amp; Independent Pricing</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold">
                    {variants.length} {variants.length === 1 ? 'Variant' : 'Variants'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Each variant has its own independent price, discount, availability, SKU, size, and inventory.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleDuplicateVariant(activeVariantIndex)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Duplicate active variant"
              >
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Clone Active</span>
              </button>
              <button
                type="button"
                onClick={handleAddVariant}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Variant</span>
              </button>
            </div>
          </div>

          {/* Variant Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {variants.map((v, idx) => {
              const isSelected = activeVariantIndex === idx;
              const vPrice = Number(v.price) || 0;
              const vCompare = Number(v.compareAtPrice) || 0;
              const vDisc = vCompare > vPrice && vCompare > 0 ? Math.round(((vCompare - vPrice) / vCompare) * 100) : 0;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveVariantIndex(idx)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 flex-shrink-0 border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-[1.02]'
                      : 'bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                  }`}
                >
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-1.5">
                      <span>{v.title || `Variant ${idx + 1}`}</span>
                      {!v.isAvailable && (
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold ${isSelected ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'}`}>
                          OOS
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-medium opacity-80`}>
                      ₹{vPrice}{vDisc > 0 ? ` (${vDisc}% off)` : ''}
                    </span>
                  </div>
                  {variants.length > 1 && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveVariant(idx);
                      }}
                      className={`p-1 rounded-lg hover:bg-black/10 transition-colors ${isSelected ? 'text-white' : 'text-slate-400 hover:text-rose-600'}`}
                      title="Remove variant"
                    >
                      <Trash2 className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Variant Inspector Card */}
          {curVariant && (
            <div className="p-5 md:p-6 rounded-2xl bg-slate-50/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Editing Variant #{activeVariantIndex + 1}: <span className="text-blue-600 dark:text-blue-400 font-extrabold">{curVariant.title || 'Untitled'}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2 cursor-pointer select-none">
                    <span>Variant Status:</span>
                    <button
                      type="button"
                      onClick={() => updateActiveVariant('isAvailable', !curVariant.isAvailable)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        curVariant.isAvailable
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                      }`}
                    >
                      {curVariant.isAvailable ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                      <span>{curVariant.isAvailable ? 'Available / In Stock' : 'Unavailable / Out of Stock'}</span>
                    </button>
                  </label>
                </div>
              </div>

              {/* Form Fields for Active Variant */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* 1. Variant Title / Name */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
                    Variant Name / Edition *
                  </label>
                  <input
                    required
                    type="text"
                    value={curVariant.title}
                    onChange={(e) => updateActiveVariant('title', e.target.value)}
                    placeholder="e.g. 100 ml, 200 ml, 500 ml"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white font-bold outline-none focus:border-blue-600"
                  />
                </div>

                {/* 2. Size / Value & Unit */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
                    Size Value &amp; Unit
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      value={curVariant.sizeValue}
                      onChange={(e) => updateActiveVariant('sizeValue', e.target.value)}
                      placeholder="100"
                      className="w-2/3 px-3 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white font-medium outline-none focus:border-blue-600"
                    />
                    <select
                      value={curVariant.sizeUnit}
                      onChange={(e) => updateActiveVariant('sizeUnit', e.target.value as any)}
                      className="w-1/3 px-2 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white font-semibold outline-none focus:border-blue-600"
                    >
                      <option value="ml">ml</option>
                      <option value="g">g</option>
                      <option value="oz">oz</option>
                      <option value="units">units</option>
                      <option value="pack">pack</option>
                    </select>
                  </div>
                </div>

                {/* 3. SKU */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
                    Variant SKU
                  </label>
                  <input
                    type="text"
                    value={curVariant.sku}
                    onChange={(e) => updateActiveVariant('sku', e.target.value)}
                    placeholder="e.g. CNX-OIL-100ML"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white font-semibold outline-none focus:border-blue-600"
                  />
                </div>

                {/* 4. Inventory Stock Units */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
                    Stock Quantity (Units)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={curVariant.inventoryQuantity}
                    onChange={(e) => updateActiveVariant('inventoryQuantity', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white font-medium outline-none focus:border-blue-600"
                  />
                </div>

                {/* 5. Variant Selling Price (₹ INR) */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
                    Selling Price (₹ INR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                    <input
                      required
                      type="number"
                      min="1"
                      value={curVariant.price}
                      onChange={(e) => updateActiveVariant('price', e.target.value)}
                      placeholder="199"
                      className="w-full pl-7 pr-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white font-extrabold outline-none focus:border-blue-600 text-emerald-600 dark:text-emerald-400"
                    />
                  </div>
                </div>

                {/* 6. Compare At / MRP (₹ INR) */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
                    Compare At / MRP (₹ INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      min="0"
                      value={curVariant.compareAtPrice}
                      onChange={(e) => updateActiveVariant('compareAtPrice', e.target.value)}
                      placeholder="210"
                      className="w-full pl-7 pr-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white font-medium outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                {/* 7. Low Stock Threshold */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
                    Low Stock Alert Level
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={curVariant.lowStockThreshold}
                    onChange={(e) => updateActiveVariant('lowStockThreshold', e.target.value)}
                    placeholder="10"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white font-medium outline-none focus:border-blue-600"
                  />
                </div>

                {/* 8. Variant-specific Details */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
                    Variant-Specific Details
                  </label>
                  <input
                    type="text"
                    value={curVariant.details}
                    onChange={(e) => updateActiveVariant('details', e.target.value)}
                    placeholder="e.g. Glass dropper bottle"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white font-medium outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Real-time Discount & Summary Banner */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-blue-950 dark:text-blue-200">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>
                    <b>{curVariant.title} Price Tag:</b> ₹{curVarPrice}.00
                    {curVarCompare > curVarPrice ? (
                      <span className="line-through text-slate-400 ml-1.5">MRP ₹{curVarCompare}.00</span>
                    ) : null}
                  </span>
                </div>
                {curVarDiscount > 0 && (
                  <div className="flex items-center gap-2 font-bold">
                    <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-[10px]">
                      {curVarDiscount}% DISCOUNT
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400">
                      Save ₹{curVarSavings}.00 per unit
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Product Imagery & Gallery */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <ImageIcon className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                3. High-Resolution Product Photography
              </h3>
              <p className="text-xs text-slate-400">Upload primary thumbnail and editorial gallery perspectives directly from your computer</p>
            </div>
          </div>

          <ProductImagesUploader
            images={images}
            onChange={setImages}
            productTitle={title || 'Product'}
            onUploadingChange={setIsUploadingImages}
          />
        </div>

        {/* Section 4: Botanical Ingredients */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Leaf className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                4. Key Botanicals &amp; Formulation Chemistry
              </h3>
              <p className="text-xs text-slate-400">Specify active organic botanical ingredients and purpose</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={newIngName}
                onChange={(e) => setNewIngName(e.target.value)}
                placeholder="Botanical Ingredient (e.g. Rosemary Extract)"
                className="px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white font-medium"
              />
              <input
                type="text"
                value={newIngPurpose}
                onChange={(e) => setNewIngPurpose(e.target.value)}
                placeholder="Key Purpose (e.g. Stimulates Growth)"
                className="px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white font-medium"
              />
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIngOrganic}
                    onChange={(e) => setNewIngOrganic(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>100% Organic</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIngKey}
                    onChange={(e) => setNewIngKey(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Hero Botanical</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="px-4 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold hover:bg-slate-900 ml-auto"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <div className="truncate">
                      <span className="text-xs font-bold text-[#0F172A] dark:text-white block truncate">
                        {ing.name}
                      </span>
                      {ing.purpose && (
                        <span className="text-[10px] text-slate-400 truncate block">
                          {ing.purpose}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {ing.isKeyBotanical && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[9px] font-bold">
                        Hero
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: Target Skin Types & Certifications */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                5. Skin Types &amp; Certifications
              </h3>
              <p className="text-xs text-slate-400">Target audience compatibility and laboratory seals</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 block">
                Target Suitability
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'All Types',
                  'Dry & Sensitive',
                  'Oily & Scalp Balance',
                  'Normal to Damaged',
                  'Color-Treated',
                  'Mature & Aging',
                ].map((type) => {
                  const selected = skinTypes.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleSkinType(type)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selected
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 block">
                Certifications &amp; Ethical Badges
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'USDA Organic Certified',
                  '100% Vegan Certified',
                  'Cruelty-Free International',
                  'Zero Synthetic Fragrance',
                  'Ayush Premium Mark',
                  'Eco-Cert Standard',
                ].map((cert) => {
                  const selected = certifications.includes(cert);
                  return (
                    <button
                      key={cert}
                      type="button"
                      onClick={() => toggleCertification(cert)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selected
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {cert}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: Visibility & Publish Settings */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[#0F172A] dark:text-white">Storefront Display Controls</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-xs font-bold text-[#0F172A] dark:text-white block">Active in Store</span>
                <span className="text-[10px] text-slate-400">Available to customers</span>
              </div>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600"
              />
            </label>

            <label className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-xs font-bold text-[#0F172A] dark:text-white block">Featured Showcase</span>
                <span className="text-[10px] text-slate-400">Highlight on home &amp; catalog</span>
              </div>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600"
              />
            </label>

            <label className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-xs font-bold text-[#0F172A] dark:text-white block">New Batch Badge</span>
                <span className="text-[10px] text-slate-400">Display "New" ribbon</span>
              </div>
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600"
              />
            </label>
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/products"
            className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
          >
            {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-[#0F172A] dark:text-white">Delete Formulation?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to permanently delete this product and all its variants from the database? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
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
