import * as React from 'react';
import { cn } from '@cinmax/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-[#ECEEF0]', className)}
      {...props}
    />
  );
}
