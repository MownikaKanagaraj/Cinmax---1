import * as React from 'react';
import { cn } from '@cinmax/utils';

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  leftActions?: React.ReactNode;
  rightActions?: React.ReactNode;
}

export function Toolbar({
  leftActions,
  rightActions,
  className,
  ...props
}: ToolbarProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-[18px] bg-white dark:bg-[#0A192F] border border-[#0A3D78]/10 shadow-sm',
        className
      )}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-2">{leftActions}</div>
      <div className="flex flex-wrap items-center gap-2">{rightActions}</div>
    </div>
  );
}
