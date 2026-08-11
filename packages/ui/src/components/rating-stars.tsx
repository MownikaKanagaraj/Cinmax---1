import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@cinmax/utils';

export interface RatingStarsProps {
  rating: number; // 0 to 5
  reviewCount?: number;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RatingStars({
  rating,
  reviewCount,
  showCount = true,
  size = 'sm',
  className,
}: RatingStarsProps) {
  const starSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className={cn('inline-flex items-center space-x-1', className)}>
      <div className="flex text-[#F59E0B]">
        {[1, 2, 3, 4, 5].map((index) => (
          <Star
            key={index}
            className={cn(
              starSizes[size],
              index <= Math.round(rating)
                ? 'fill-[#F59E0B] text-[#F59E0B]'
                : 'text-[#D8DADC]'
            )}
          />
        ))}
      </div>
      {showCount && reviewCount !== undefined && (
        <span className="ml-1 text-xs text-[#737781]">({reviewCount})</span>
      )}
    </div>
  );
}
