import * as React from 'react';
import { Skeleton } from '../skeleton';

export function ProfileSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6 p-6 rounded-[20px] bg-white dark:bg-[#0A192F] border border-[#0A3D78]/10">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-48 rounded" />
          <Skeleton className="h-4 w-36 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-32 rounded-[18px]" />
        <Skeleton className="h-32 rounded-[18px]" />
      </div>
    </div>
  );
}
