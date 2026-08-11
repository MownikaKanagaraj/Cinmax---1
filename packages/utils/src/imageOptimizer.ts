export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'origin';
}

/**
 * Generates optimized image URL with resizing and WebP transformations.
 */
export function getOptimizedImageUrl(
  rawUrl: string,
  options: ImageOptimizationOptions = {}
): string {
  if (!rawUrl) return '';

  const { width, height, quality = 85, format = 'webp' } = options;

  // Unsplash Image optimization
  if (rawUrl.includes('images.unsplash.com')) {
    const url = new URL(rawUrl);
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    url.searchParams.set('q', quality.toString());
    url.searchParams.set('auto', 'format');
    url.searchParams.set('fit', 'crop');
    return url.toString();
  }

  // Supabase Storage Image transformation
  if (rawUrl.includes('supabase.co/storage/v1/object/public/')) {
    const renderUrl = rawUrl.replace(
      '/storage/v1/object/public/',
      '/storage/v1/render/image/public/'
    );
    const url = new URL(renderUrl);
    if (width) url.searchParams.set('width', width.toString());
    if (height) url.searchParams.set('height', height.toString());
    url.searchParams.set('quality', quality.toString());
    url.searchParams.set('format', format);
    return url.toString();
  }

  return rawUrl;
}
