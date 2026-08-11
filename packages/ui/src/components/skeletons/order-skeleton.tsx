import * as React from 'react';
import { Skeleton } from '../skeleton';

export function OrderSkeleton() {
  return (
    <div className="rounded-[20px] bg-white dark:bg-[#0A192F] p-6 border border-[#0A3D78]/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-5 w-40 rounded" />
          <Skeleton className="h-4 w-28 rounded" />
        </div>
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>
      <div className="border-t border-[#0A3D78]/10 pt-4 flex gap-4">
        <Skeleton className="h-16 w-16 rounded-[12px]" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-1/2 rounded" />
          <Skeleton className="h-4 w-1/4 rounded" />
        </div>
        <Skeleton className="h-6 w-16 rounded" />
      </div>
    </div>
  );
}
