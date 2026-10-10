import { getYouTubeThumbnailUrl } from './youtube';

export const CINMAX_SOAP_SLUGS = [
  'aroma-soap',
  'aloe-vera-soap',
  'kasturi-manjal-soap',
  'neem-oil-soap',
  'manjistha-soap',
  'charcoal-soap',
  'avarampoo-soap',
  'rose-soap',
  'vettiver-soap',
  'veppalai-soap',
  'papaya-soap',
] as const;

export type CinmaxSoapSlug = (typeof CINMAX_SOAP_SLUGS)[number];

const SUPABASE_STORAGE_BASE =
  'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products';

/**
 * Maps any product slug, title, or keyword to its canonical soap slug.
 */
export function matchSoapSlug(slugOrTitle?: string): CinmaxSoapSlug {
  if (!slugOrTitle) return 'aroma-soap';
  const clean = slugOrTitle.toLowerCase().replace(/[^a-z0-9-]/g, '-');

  for (const s of CINMAX_SOAP_SLUGS) {
    if (clean === s || clean.includes(s)) return s;
  }

  if (clean.includes('aloe')) return 'aloe-vera-soap';
  if (clean.includes('kasturi') || clean.includes('manjal') || clean.includes('turmeric')) return 'kasturi-manjal-soap';
  if (clean.includes('neem')) return 'neem-oil-soap';
  if (clean.includes('manjistha')) return 'manjistha-soap';
  if (clean.includes('charcoal')) return 'charcoal-soap';
  if (clean.includes('avarampoo') || clean.includes('cassia')) return 'avarampoo-soap';
  if (clean.includes('rose') || clean.includes('damask')) return 'rose-soap';
  if (clean.includes('vettiver') || clean.includes('vetiver') || clean.includes('khus')) return 'vettiver-soap';
  if (clean.includes('veppalai') || clean.includes('tinctoria')) return 'veppalai-soap';
  if (clean.includes('papaya') || clean.includes('papain')) return 'papaya-soap';

  return 'aroma-soap';
}

/**
 * Returns the exact public storage image URL for a given soap slug and image index (1-4).
 */
export function getProductFallbackImage(slugOrTitle?: string, index: number = 1): string {
  const matchedSlug = matchSoapSlug(slugOrTitle);
  const safeIndex = Math.min(4, Math.max(1, index));
  return `${SUPABASE_STORAGE_BASE}/${matchedSlug}/${safeIndex}.jpg`;
}

/**
 * Returns all 4 high-res gallery images for a given soap.
 */
export function getProductFallbackGallery(slugOrTitle?: string): string[] {
  const matchedSlug = matchSoapSlug(slugOrTitle);
  return [
    `${SUPABASE_STORAGE_BASE}/${matchedSlug}/1.jpg`,
    `${SUPABASE_STORAGE_BASE}/${matchedSlug}/2.jpg`,
    `${SUPABASE_STORAGE_BASE}/${matchedSlug}/3.jpg`,
    `${SUPABASE_STORAGE_BASE}/${matchedSlug}/4.jpg`,
  ];
}

/**
 * Resolves a safe thumbnail for playlists or video classes.
 * If given a YouTube link or YouTube Shorts link, automatically generates the HQ YouTube thumbnail image.
 */
export function getPlaylistThumbnail(thumbnailUrl?: string, fallbackUrl?: string): string {
  if (thumbnailUrl && typeof thumbnailUrl === 'string' && thumbnailUrl.trim() !== '') {
    const trimmed = thumbnailUrl.trim();
    if (
      trimmed.includes('youtube.com') ||
      trimmed.includes('youtu.be') ||
      trimmed.includes('shorts/')
    ) {
      return getYouTubeThumbnailUrl(trimmed);
    }
    return trimmed;
  }

  if (fallbackUrl && typeof fallbackUrl === 'string' && fallbackUrl.trim() !== '') {
    const trimmed = fallbackUrl.trim();
    if (
      trimmed.includes('youtube.com') ||
      trimmed.includes('youtu.be') ||
      trimmed.includes('shorts/')
    ) {
      return getYouTubeThumbnailUrl(trimmed);
    }
    return trimmed;
  }

  return `${SUPABASE_STORAGE_BASE}/aroma-soap/1.jpg`;
}
