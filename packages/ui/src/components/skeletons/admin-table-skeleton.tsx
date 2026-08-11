import * as React from 'react';
import { Skeleton } from '../skeleton';

export function AdminTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="rounded-[18px] bg-white dark:bg-[#0A192F] border border-[#0A3D78]/10 overflow-hidden">
      {/* Table Header */}
      <div className="p-4 border-b border-[#0A3D78]/10 flex items-center justify-between">
        <Skeleton className="h-6 w-40 rounded" />
        <Skeleton className="h-9 w-32 rounded-full" />
      </div>
      {/* Rows */}
      <div className="divide-y divide-[#0A3D78]/5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <Skeleton className="h-5 w-48 rounded" />
            <Skeleton className="h-5 w-24 rounded" />
            <Skeleton className="h-5 w-32 rounded" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
