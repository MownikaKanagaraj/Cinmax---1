import type { SupabaseClient } from '@supabase/supabase-js';
import type { UploadFilePayload, UploadFileResult } from './types';

/**
 * Universal file upload handler integrating with Supabase Storage
 * Supports: product-images, category-images, profile-avatars, banner-assets, review-attachments, blog-media
 */
export async function uploadStorageFile(
  supabase: SupabaseClient,
  payload: UploadFilePayload
): Promise<UploadFileResult> {
  const { file, bucket, path = '', fileName } = payload;

  const generatedName =
    fileName ||
    `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`;
  const filePath = path ? `${path}/${generatedName}` : generatedName;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      upsert: true,
      contentType: (file as any).type || 'image/webp',
    });

  if (error) throw error;

  const { data: pubData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return {
    url: pubData.publicUrl,
    path: filePath,
    bucket,
  };
}

export async function deleteStorageFile(
  supabase: SupabaseClient,
  bucket: string,
  path: string
) {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}
