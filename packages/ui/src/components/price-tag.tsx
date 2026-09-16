import * as React from 'react';
import { formatPrice, cn } from '@cinmax/utils';

export interface PriceTagProps {
  price: number;
  compareAtPrice?: number | null;
  currency?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function PriceTag({
  price,
  compareAtPrice,
  currency = 'INR',
  size = 'md',
  className,
}: PriceTagProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base font-semibold',
    lg: 'text-xl font-bold',
    xl: 'text-2xl font-bold',
  };

  const safePrice = typeof price === 'number' && !isNaN(price) ? price : 0;
  const safeCompareAt = typeof compareAtPrice === 'number' && !isNaN(compareAtPrice) ? compareAtPrice : null;
  const hasDiscount = Boolean(safeCompareAt && safeCompareAt > safePrice);

  return (
    <div className={cn('inline-flex items-baseline space-x-2', className)}>
      <span className={cn('text-[#002754]', sizeClasses[size])}>
        {formatPrice(safePrice, currency)}
      </span>
      {hasDiscount && safeCompareAt !== null && (
        <span className="text-xs text-[#737781] line-through">
          {formatPrice(safeCompareAt, currency)}
        </span>
      )}
    </div>
  );
}
