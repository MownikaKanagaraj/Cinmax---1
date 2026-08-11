/**
 * Order Number Generator
 * Creates standardized brand order numbers (e.g., CNX-20260802-8492)
 */

export function generateOrderNumber(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);

  return `CNX-${year}${month}${day}-${randomSuffix}`;
}
