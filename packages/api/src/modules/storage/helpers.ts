import type { SupabaseClient } from '@supabase/supabase-js';
import type { StorageBucket, UploadFilePayload, UploadFileResult } from '@cinmax/types';
import { uploadStorageFile, deleteStorageFile } from './mutations';

export async function uploadImage(
  supabase: SupabaseClient,
  payload: UploadFilePayload
): Promise<UploadFileResult> {
  return uploadStorageFile(supabase, payload);
}

export async function deleteImage(
  supabase: SupabaseClient,
  bucket: StorageBucket,
  path: string
): Promise<void> {
  return deleteStorageFile(supabase, bucket, path);
}

export function getPublicUrl(
  supabase: SupabaseClient,
  bucket: StorageBucket,
  path: string
): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export function optimizeImageUrl(
  url: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'origin';
  }
): string {
  if (!url) return '';
  if (!options) return url;

  // Unsplash image parameter handling
  if (url.includes('images.unsplash.com')) {
    const urlObj = new URL(url);
    if (options.width) urlObj.searchParams.set('w', options.width.toString());
    if (options.quality) urlObj.searchParams.set('q', options.quality.toString());
    urlObj.searchParams.set('auto', 'format');
    urlObj.searchParams.set('fit', 'crop');
    return urlObj.toString();
  }

  // Supabase Storage Transformation API handling
  if (url.includes('.supabase.co/storage/v1/object/public/')) {
    const renderUrl = url.replace('/object/public/', '/render/image/public/');
    const urlObj = new URL(renderUrl);
    if (options.width) urlObj.searchParams.set('width', options.width.toString());
    if (options.height) urlObj.searchParams.set('height', options.height.toString());
    if (options.quality) urlObj.searchParams.set('quality', options.quality.toString());
    if (options.format && options.format !== 'origin') {
      urlObj.searchParams.set('format', options.format);
    }
    return urlObj.toString();
  }

  return url;
}
