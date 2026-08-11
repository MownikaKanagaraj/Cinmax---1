import type { SupabaseClient } from '@supabase/supabase-js';
import type { StorageBucket, StorageFileMeta } from './types';

export async function fetchBucketFiles(
  supabase: SupabaseClient,
  bucket: StorageBucket,
  path: string = ''
): Promise<StorageFileMeta[]> {
  const { data, error } = await supabase.storage.from(bucket).list(path);
  if (error || !data) return [];

  return data.map((item) => {
    const { data: pubData } = supabase.storage
      .from(bucket)
      .getPublicUrl(`${path ? path + '/' : ''}${item.name}`);

    return {
      id: item.id || item.name,
      name: item.name,
      size: item.metadata?.size || 0,
      mimeType: item.metadata?.mimetype || 'image/jpeg',
      createdAt: item.created_at || new Date().toISOString(),
      publicUrl: pubData.publicUrl,
    };
  });
}
