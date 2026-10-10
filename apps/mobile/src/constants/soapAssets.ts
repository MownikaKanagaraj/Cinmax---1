import { matchSoapSlug, getProductFallbackImage } from '@cinmax/utils';

/**
 * High-performance local asset map for instant 0ms offline image rendering in React Native APK.
 */
export const LOCAL_SOAP_ASSETS: Record<string, any> = {
  'aroma-soap': require('../../assets/products/aroma-soap/1.jpg'),
  'aloe-vera-soap': require('../../assets/products/aloe-vera-soap/1.jpg'),
  'avarampoo-soap': require('../../assets/products/avarampoo-soap/1.jpg'),
  'charcoal-soap': require('../../assets/products/charcoal-soap/1.jpg'),
  'kasturi-manjal-soap': require('../../assets/products/kasturi-manjal-soap/1.jpg'),
  'manjistha-soap': require('../../assets/products/manjistha-soap/1.jpg'),
  'neem-oil-soap': require('../../assets/products/neem-oil-soap/1.jpg'),
  'papaya-soap': require('../../assets/products/papaya-soap/1.jpg'),
  'rose-soap': require('../../assets/products/rose-soap/1.jpg'),
  'veppalai-soap': require('../../assets/products/veppalai-soap/1.jpg'),
  'vettiver-soap': require('../../assets/products/vettiver-soap/1.jpg'),
};

export const LOCAL_SOAP_GALLERY: Record<string, any[]> = {
  'aroma-soap': [
    require('../../assets/products/aroma-soap/1.jpg'),
    require('../../assets/products/aroma-soap/2.jpg'),
    require('../../assets/products/aroma-soap/3.jpg'),
    require('../../assets/products/aroma-soap/4.jpg'),
  ],
  'aloe-vera-soap': [
    require('../../assets/products/aloe-vera-soap/1.jpg'),
    require('../../assets/products/aloe-vera-soap/2.jpg'),
    require('../../assets/products/aloe-vera-soap/3.jpg'),
    require('../../assets/products/aloe-vera-soap/4.jpg'),
  ],
  'avarampoo-soap': [
    require('../../assets/products/avarampoo-soap/1.jpg'),
    require('../../assets/products/avarampoo-soap/2.jpg'),
    require('../../assets/products/avarampoo-soap/3.jpg'),
    require('../../assets/products/avarampoo-soap/4.jpg'),
  ],
  'charcoal-soap': [
    require('../../assets/products/charcoal-soap/1.jpg'),
    require('../../assets/products/charcoal-soap/2.jpg'),
    require('../../assets/products/charcoal-soap/3.jpg'),
    require('../../assets/products/charcoal-soap/4.jpg'),
  ],
  'kasturi-manjal-soap': [
    require('../../assets/products/kasturi-manjal-soap/1.jpg'),
    require('../../assets/products/kasturi-manjal-soap/2.jpg'),
    require('../../assets/products/kasturi-manjal-soap/3.jpg'),
    require('../../assets/products/kasturi-manjal-soap/4.jpg'),
  ],
  'manjistha-soap': [
    require('../../assets/products/manjistha-soap/1.jpg'),
    require('../../assets/products/manjistha-soap/2.jpg'),
    require('../../assets/products/manjistha-soap/3.jpg'),
    require('../../assets/products/manjistha-soap/4.jpg'),
  ],
  'neem-oil-soap': [
    require('../../assets/products/neem-oil-soap/1.jpg'),
    require('../../assets/products/neem-oil-soap/2.jpg'),
    require('../../assets/products/neem-oil-soap/3.jpg'),
    require('../../assets/products/neem-oil-soap/4.jpg'),
  ],
  'papaya-soap': [
    require('../../assets/products/papaya-soap/1.jpg'),
    require('../../assets/products/papaya-soap/2.jpg'),
    require('../../assets/products/papaya-soap/3.jpg'),
    require('../../assets/products/papaya-soap/4.jpg'),
  ],
  'rose-soap': [
    require('../../assets/products/rose-soap/1.jpg'),
    require('../../assets/products/rose-soap/2.jpg'),
    require('../../assets/products/rose-soap/3.jpg'),
    require('../../assets/products/rose-soap/4.jpg'),
  ],
  'veppalai-soap': [
    require('../../assets/products/veppalai-soap/1.jpg'),
    require('../../assets/products/veppalai-soap/2.jpg'),
    require('../../assets/products/veppalai-soap/3.jpg'),
    require('../../assets/products/veppalai-soap/4.jpg'),
  ],
  'vettiver-soap': [
    require('../../assets/products/vettiver-soap/1.jpg'),
    require('../../assets/products/vettiver-soap/2.jpg'),
    require('../../assets/products/vettiver-soap/3.jpg'),
    require('../../assets/products/vettiver-soap/4.jpg'),
  ],
};

/**
 * Returns a guaranteed ImageSource for React Native (local asset or remote URL).
 */
export function getSoapImageSource(rawUrlOrSlug?: string, slugOrTitle?: string): any {
  if (rawUrlOrSlug && typeof rawUrlOrSlug === 'string' && rawUrlOrSlug.startsWith('http') && !rawUrlOrSlug.includes('audit-test')) {
    return { uri: rawUrlOrSlug.trim() };
  }

  const matched = matchSoapSlug(slugOrTitle || rawUrlOrSlug);
  if (LOCAL_SOAP_ASSETS[matched]) {
    return LOCAL_SOAP_ASSETS[matched];
  }

  return { uri: getProductFallbackImage(matched, 1) };
}

/**
 * Returns gallery sources for a given soap.
 */
export function getSoapGallerySources(slugOrTitle?: string, remoteUrls?: string[]): any[] {
  if (remoteUrls && remoteUrls.length > 0) {
    const valid = remoteUrls.filter((u) => u && typeof u === 'string' && u.startsWith('http') && !u.includes('audit-test'));
    if (valid.length > 0) {
      return valid.map((u) => ({ uri: u }));
    }
  }

  const matched = matchSoapSlug(slugOrTitle);
  if (LOCAL_SOAP_GALLERY[matched]) {
    return LOCAL_SOAP_GALLERY[matched];
  }

  return [
    { uri: getProductFallbackImage(matched, 1) },
    { uri: getProductFallbackImage(matched, 2) },
    { uri: getProductFallbackImage(matched, 3) },
    { uri: getProductFallbackImage(matched, 4) },
  ];
}
