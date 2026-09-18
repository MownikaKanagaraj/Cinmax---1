export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nthyavlzdgucrldtgjeo.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aHlhdmx6ZGd1Y3JsZHRnamVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTc1NTYwMCwiZXhwIjoyMTAxMzMxNjAwfQ.WhVVQo2bsvvo3NN8isPSbaQNUPef8MloYdjG3B_LaU0';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml',
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB per image

function getSupabaseClient() {
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { success: false, error: 'Content-Type must be multipart/form-data' },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const bucket = (formData.get('bucket') as string) || 'products';
    const folder = (formData.get('folder') as string) || 'products';

    // Extract all file entries from formData
    const rawFiles: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (value instanceof File && (key === 'file' || key === 'files' || key.startsWith('file_'))) {
        rawFiles.push(value);
      }
    }

    // Also check if multiple files were sent under a single key "files"
    const filesList = formData.getAll('files').filter((f): f is File => f instanceof File);
    const fileSingle = formData.get('file');
    const combinedFiles = Array.from(
      new Set([...rawFiles, ...filesList, ...(fileSingle instanceof File ? [fileSingle] : [])])
    );

    if (combinedFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No image files provided in upload request.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    const uploadedFiles: Array<{
      url: string;
      path: string;
      fileName: string;
      originalName: string;
      size: number;
      mimeType: string;
    }> = [];

    for (const file of combinedFiles) {
      // 1. Validate MIME type
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid file type "${file.type || 'unknown'}". Allowed formats: JPG, PNG, WebP, AVIF, GIF, SVG.`,
          },
          { status: 400 }
        );
      }

      // 2. Validate file size
      if (file.size > MAX_FILE_SIZE_BYTES) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        return NextResponse.json(
          {
            success: false,
            error: `File "${file.name}" is too large (${sizeMb} MB). Maximum allowed size is 10 MB.`,
          },
          { status: 400 }
        );
      }

      // 3. Sanitize and generate unique safe filename
      const originalExt = file.name.split('.').pop()?.toLowerCase() || 'webp';
      const cleanBase = file.name
        .replace(/\.[^/.]+$/, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 40);
      const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const safeFileName = `${cleanBase || 'product'}-${uniqueSuffix}.${originalExt}`;
      const filePath = folder ? `${folder}/${safeFileName}` : safeFileName;

      // 4. Convert File to ArrayBuffer/Buffer for Supabase upload
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, buffer, {
          contentType: file.type || 'image/webp',
          upsert: true,
        });

      if (uploadError) {
        console.error(`[Upload API Error] Failed to upload ${file.name}:`, uploadError);
        return NextResponse.json(
          {
            success: false,
            error: `Storage upload failed for ${file.name}: ${uploadError.message}`,
          },
          { status: 500 }
        );
      }

      // 5. Retrieve public URL
      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

      uploadedFiles.push({
        url: publicUrlData.publicUrl,
        path: filePath,
        fileName: safeFileName,
        originalName: file.name,
        size: file.size,
        mimeType: file.type,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${uploadedFiles.length} ${uploadedFiles.length === 1 ? 'image' : 'images'}.`,
      files: uploadedFiles,
    });
  } catch (error: any) {
    console.error('[Upload API Fatal Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An unexpected error occurred during image upload.',
      },
      { status: 500 }
    );
  }
}
