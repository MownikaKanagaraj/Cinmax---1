/**
 * Date Formatting & Delivery Estimation Utilities
 */

export function formatDate(
  dateString: string | Date,
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatRelativeTime(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(date);
}

export function estimateDeliveryDate(daysFromNow: number = 3): {
  minDate: string;
  maxDate: string;
  formattedRange: string;
} {
  const now = new Date();
  const min = new Date(now);
  min.setDate(min.getDate() + daysFromNow);

  const max = new Date(now);
  max.setDate(max.getDate() + daysFromNow + 2);

  const minFormatted = min.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const maxFormatted = max.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return {
    minDate: min.toISOString(),
    maxDate: max.toISOString(),
    formattedRange: `${minFormatted} – ${maxFormatted}`,
  };
}
