import * as React from 'react';
import { Skeleton } from '../skeleton';

export function CategorySkeleton() {
  return (
    <div className="relative rounded-[24px] overflow-hidden aspect-[4/5] bg-muted animate-pulse">
      <Skeleton className="w-full h-full" />
    </div>
  );
}
