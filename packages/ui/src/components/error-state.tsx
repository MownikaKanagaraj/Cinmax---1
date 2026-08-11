import * as React from 'react';
import { cn } from '@cinmax/utils';
import { Button } from './button';

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Unable to Load Content',
  message,
  onRetry,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-[20px] bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/40',
        className
      )}
      {...props}
    >
      <div className="w-14 h-14 mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="font-serif text-lg font-bold text-red-950 dark:text-red-200 mb-1">
        {title}
      </h3>
      <p className="text-sm text-red-700 dark:text-red-300/80 max-w-md mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          Try Again
        </Button>
      )}
    </div>
  );
}
