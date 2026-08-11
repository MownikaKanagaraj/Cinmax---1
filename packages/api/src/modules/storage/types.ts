import type { StorageBucket, UploadFilePayload, UploadFileResult } from '@cinmax/types';

export { StorageBucket, UploadFilePayload, UploadFileResult };

export interface StorageFileMeta {
  name: string;
  id: string;
  size: number;
  mimeType: string;
  createdAt: string;
  publicUrl: string;
}
