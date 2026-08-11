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
  currency = 'USD',
  size = 'md',
  className,
}: PriceTagProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base font-semibold',
    lg: 'text-xl font-bold',
    xl: 'text-2xl font-bold',
  };

  const hasDiscount = compareAtPrice && compareAtPrice > price;

  return (
    <div className={cn('inline-flex items-baseline space-x-2', className)}>
      <span className={cn('text-[#002754]', sizeClasses[size])}>
        {formatPrice(price, currency)}
      </span>
      {hasDiscount && (
        <span className="text-xs text-[#737781] line-through">
          {formatPrice(compareAtPrice, currency)}
        </span>
      )}
    </div>
  );
}
