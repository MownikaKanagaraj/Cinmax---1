import * as React from 'react';
import { cn } from '@cinmax/utils';
import { Skeleton } from './skeleton';

export interface SkeletonStateProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number;
}

export function SkeletonState({
  rows = 4,
  className,
  ...props
}: SkeletonStateProps) {
  return (
    <div className={cn('space-y-4 p-6', className)} {...props}>
      <Skeleton className="h-8 w-1/3 rounded-md" />
      <Skeleton className="h-4 w-2/3 rounded-md" />
      <div className="pt-4 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-[14px]" />
        ))}
      </div>
    </div>
  );
}
