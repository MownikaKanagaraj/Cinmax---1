import * as React from 'react';
import { cn } from '@cinmax/utils';
import { Button } from '../button';

export interface ApiErrorHandlerProps extends React.HTMLAttributes<HTMLDivElement> {
  error: Error | { message?: string; status?: number } | null | unknown;
  onRetry?: () => void;
}

export function ApiErrorHandler({
  error,
  onRetry,
  className,
  ...props
}: ApiErrorHandlerProps) {
  if (!error) return null;

  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error && 'message' in error
      ? String((error as any).message)
      : 'Network communication interrupted. Please check your connectivity.';

  return (
    <div
      className={cn(
        'p-4 rounded-[16px] bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 flex items-center justify-between gap-4',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium">{errorMessage}</span>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="border-red-500/30 hover:bg-red-500/10">
          Retry
        </Button>
      )}
    </div>
  );
}
