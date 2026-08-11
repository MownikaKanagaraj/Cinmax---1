import * as React from 'react';
import { cn } from '@cinmax/utils';

export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export function LoadingState({
  message = 'Brewing botanical essences...',
  className,
  ...props
}: LoadingStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center p-12 text-center', className)}
      {...props}
    >
      <div className="w-12 h-12 mb-4 border-2 border-[#0A3D78]/20 border-t-[#0A3D78] rounded-full animate-spin dark:border-white/20 dark:border-t-white" />
      <p className="text-sm font-medium text-muted-foreground tracking-wider uppercase">
        {message}
      </p>
    </div>
  );
}
