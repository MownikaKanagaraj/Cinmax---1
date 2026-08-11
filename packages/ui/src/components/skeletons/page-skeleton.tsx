import * as React from 'react';
import { Skeleton } from '../skeleton';
import { Container } from '../container';

export function PageSkeleton() {
  return (
    <Container className="py-12 space-y-8 animate-pulse">
      {/* Breadcrumb */}
      <Skeleton className="h-4 w-48 rounded" />
      {/* Header */}
      <div className="space-y-3">
        <Skeleton className="h-10 w-2/3 max-w-md rounded-md" />
        <Skeleton className="h-4 w-full max-w-lg rounded" />
      </div>
      {/* Hero Banner / Main Card */}
      <Skeleton className="h-64 sm:h-96 w-full rounded-[24px]" />
      {/* Grid of items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-60 w-full rounded-[18px]" />
            <Skeleton className="h-5 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
        ))}
      </div>
    </Container>
  );
}
