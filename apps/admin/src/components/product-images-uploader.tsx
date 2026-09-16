'use client';

import * as React from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Star,
  Plus,
} from 'lucide-react';

export interface ProductImageItem {
  id?: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  file?: File;
  previewUrl?: string;
  uploading?: boolean;
  progress?: number;
  error?: string;
  isNew?: boolean;
}

interface ProductImagesUploaderProps {
  images: ProductImageItem[];
  onChange: (images: ProductImageItem[]) => void;
  productTitle?: string;
  onUploadingChange?: (isUploading: boolean) => void;
  maxFiles?: number;
  maxSizeMb?: number;
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml',
];

export function ProductImagesUploader({
  images,
  onChange,
  productTitle = 'Product',
  onUploadingChange,
  maxFiles = 10,
  maxSizeMb = 10,
}: ProductImagesUploaderProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [isUploadingGlobal, setIsUploadingGlobal] = React.useState(false);

  // Sync uploading state upwards
  React.useEffect(() => {
    onUploadingChange?.(isUploadingGlobal);
  }, [isUploadingGlobal, onUploadingChange]);

  const handleFilesSelected = async (files: FileList | File[]) => {
    setValidationError(null);
    const fileArray = Array.from(files);

    if (fileArray.length === 0) return;

    if (images.length + fileArray.length > maxFiles) {
      setValidationError(`You can upload a maximum of ${maxFiles} images per product.`);
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    for (const file of fileArray) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        setValidationError(
          `Invalid file format "${file.name}". Please upload JPG, PNG, WebP, AVIF, or GIF images.`
        );
        return;
      }
      if (file.size > maxSizeMb * 1024 * 1024) {
        setValidationError(
          `File "${file.name}" exceeds the ${maxSizeMb}MB maximum file size limit.`
        );
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Create temporary preview items
    const tempItems: ProductImageItem[] = validFiles.map((file, idx) => ({
      id: `temp_${Date.now()}_${idx}`,
      url: URL.createObjectURL(file),
      previewUrl: URL.createObjectURL(file),
      alt: `${productTitle} Image ${images.length + idx + 1}`,
      isPrimary: images.length === 0 && idx === 0,
      file,
      uploading: true,
      progress: 20,
      isNew: true,
    }));

    const nextImages = [...images, ...tempItems];
    onChange(nextImages);
    setIsUploadingGlobal(true);

    // Perform multipart upload
    try {
      const formData = new FormData();
      formData.append('bucket', 'products');
      formData.append('folder', 'products');
      validFiles.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to upload images to cloud storage.');
      }

      // Merge uploaded public URLs back into the state
      const uploadedDataList: Array<{ url: string; path: string }> = result.files;

      let uploadIdx = 0;
      const finalImages = nextImages.map((img) => {
        if (img.uploading && uploadIdx < uploadedDataList.length) {
          const uploaded = uploadedDataList[uploadIdx++];
          return {
            ...img,
            url: uploaded.url,
            previewUrl: uploaded.url,
            uploading: false,
            progress: 100,
            error: undefined,
          };
        }
        return img;
      });
      onChange(finalImages);
    } catch (err: any) {
      console.error('[ProductImagesUploader Upload Error]', err);
      setValidationError(err.message || 'Image upload failed. Please try again.');
      const erroredImages = nextImages.map((img) =>
        img.uploading ? { ...img, uploading: false, error: err.message } : img
      );
      onChange(erroredImages);
    } finally {
      setIsUploadingGlobal(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleSetPrimary = (index: number) => {
    const updated = images.map((img, idx) => ({
      ...img,
      isPrimary: idx === index,
    }));
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const target = images[index];
    if (target?.previewUrl && target.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(target.previewUrl);
    }
    const updated = images.filter((_, idx) => idx !== index);
    if (updated.length > 0 && !updated.some((i) => i.isPrimary)) {
      updated[0].isPrimary = true;
    }
    onChange(updated);
  };

  return (
    <div className="space-y-5">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/avif,image/gif,image/svg+xml"
        onChange={(e) => e.target.files && handleFilesSelected(e.target.files)}
        className="hidden"
      />

      {/* Validation Error Alert */}
      {validationError && (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center justify-between gap-3 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{validationError}</span>
          </div>
          <button
            type="button"
            onClick={() => setValidationError(null)}
            className="text-rose-600 hover:text-rose-800 text-[11px] underline font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploadingGlobal && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/40 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 hover:bg-slate-100/80 dark:hover:bg-slate-900 hover:border-blue-400'
        } ${isUploadingGlobal ? 'opacity-70 cursor-wait' : ''}`}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
            {isUploadingGlobal ? (
              <RefreshCw className="w-7 h-7 animate-spin text-blue-600" />
            ) : (
              <UploadCloud className="w-7 h-7" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-100">
              {isUploadingGlobal ? (
                'Uploading images to cloud storage...'
              ) : (
                <>
                  <span className="text-blue-600 dark:text-blue-400 font-extrabold hover:underline">
                    Click to browse files
                  </span>{' '}
                  or drag and drop images here
                </>
              )}
            </p>
            <p className="text-[11px] text-slate-400 font-medium">
              High-resolution JPG, PNG, WebP, AVIF or GIF • Max 10MB per file • Up to {maxFiles} images
            </p>
          </div>

          <button
            type="button"
            disabled={isUploadingGlobal}
            className="mt-1 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-blue-500/20 inline-flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Select Images from Computer</span>
          </button>
        </div>
      </div>

      {/* Uploaded Gallery Grid */}
      {images.length > 0 ? (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span>Product Image Gallery ({images.length} {images.length === 1 ? 'image' : 'images'})</span>
            </span>
            <span className="text-[11px] text-slate-400">
              Click &quot;Make Primary&quot; to set the storefront thumbnail
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div
                key={img.id || img.url || idx}
                className={`relative group rounded-2xl overflow-hidden border-2 transition-all bg-white dark:bg-slate-900 ${
                  img.isPrimary
                    ? 'border-blue-600 ring-2 ring-blue-500/30 shadow-md scale-[1.01]'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Image Aspect Container */}
                <div className="aspect-square relative bg-slate-100 dark:bg-slate-950 overflow-hidden flex items-center justify-center">
                  <img
                    src={img.previewUrl || img.url}
                    alt={img.alt || `${productTitle} image ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      // Fallback if image fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />

                  {/* Primary Badge */}
                  {img.isPrimary && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-blue-600 text-white text-[10px] font-bold shadow-md flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Primary</span>
                    </div>
                  )}

                  {/* Uploading Spinner Overlay */}
                  {img.uploading && (
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2 p-3 text-white">
                      <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
                      <span className="text-[10px] font-bold tracking-wide">Uploading...</span>
                    </div>
                  )}

                  {/* Error Overlay */}
                  {img.error && (
                    <div className="absolute inset-0 bg-rose-950/80 backdrop-blur-xs flex flex-col items-center justify-center gap-1 p-2 text-rose-200 text-center">
                      <AlertCircle className="w-5 h-5 text-rose-400" />
                      <span className="text-[9px] font-semibold">{img.error}</span>
                    </div>
                  )}

                  {/* Hover Overlay Actions */}
                  {!img.uploading && (
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                      {!img.isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(idx)}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold shadow-md flex items-center gap-1 transition-transform hover:scale-105"
                        >
                          <Star className="w-3 h-3" />
                          <span>Make Primary</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemove(idx)}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold shadow-md flex items-center gap-1 transition-transform hover:scale-105"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer Label */}
                <div className="p-2.5 bg-slate-50/80 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[110px]">
                    {img.isPrimary ? 'Primary Thumbnail' : `Perspective ${idx + 1}`}
                  </span>
                  {img.url.includes('supabase.co') ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold" title="Saved to cloud storage">
                      <CheckCircle2 className="w-3 h-3" /> Cloud
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            No images uploaded yet. Select high-resolution photos of the botanical product from your device.
          </p>
        </div>
      )}
    </div>
  );
}
