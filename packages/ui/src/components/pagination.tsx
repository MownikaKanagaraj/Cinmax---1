import * as React from 'react';
import { cn } from '@cinmax/utils';
import { Button } from './button';

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  ...props
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn('flex items-center justify-center space-x-2 py-8', className)}
      {...props}
    >
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </Button>

      <div className="flex items-center space-x-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? 'primary' : 'ghost'}
            size="sm"
            className="w-9 h-9 p-0"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </nav>
  );
}
