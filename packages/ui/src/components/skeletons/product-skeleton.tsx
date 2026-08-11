import * as React from 'react';
import { Skeleton } from '../skeleton';

export function ProductSkeleton() {
  return (
    <div className="rounded-[20px] bg-white dark:bg-[#0A192F] p-4 border border-[#0A3D78]/10 space-y-4">
      {/* Product Image Frame */}
      <Skeleton className="h-64 w-full rounded-[16px]" />
      {/* Category & Process badge */}
      <div className="flex gap-2">
        <Skeleton className="h-4 w-20 rounded-full" />
        <Skeleton className="h-4 w-16 rounded-full" />
      </div>
      {/* Title */}
      <Skeleton className="h-6 w-5/6 rounded-md" />
      {/* Price and CTA */}
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-6 w-20 rounded" />
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-8">
      <Skeleton className="h-[480px] w-full rounded-[24px]" />
      <div className="space-y-6">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-10 w-3/4 rounded-md" />
        <Skeleton className="h-6 w-28 rounded" />
        <Skeleton className="h-20 w-full rounded-[14px]" />
        <div className="flex gap-4 pt-4">
          <Skeleton className="h-12 w-32 rounded-full" />
          <Skeleton className="h-12 flex-1 rounded-full" />
        </div>
      </div>
    </div>
  );
}
