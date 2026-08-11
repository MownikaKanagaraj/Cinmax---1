/**
 * Slug and SKU generation utilities
 */

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function generateSKU(
  categoryCode: string,
  title: string,
  variantOption?: string
): string {
  const cleanCat = categoryCode.slice(0, 3).toUpperCase();
  const cleanTitle = title.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase();
  const cleanVar = variantOption ? `-${variantOption.replace(/[^A-Za-z0-9]/g, '').slice(0, 3).toUpperCase()}` : '';
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `CNX-${cleanCat}-${cleanTitle}${cleanVar}-${randomSuffix}`;
}

export function truncate(text: string, maxLength: number = 80): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}
