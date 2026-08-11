import * as React from 'react';
import { cn } from '@cinmax/utils';

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  actions?: React.ReactNode;
}

export function PageHeader({
  badge,
  title,
  subtitle,
  align = 'left',
  actions,
  className,
  ...props
}: PageHeaderProps) {
  const alignClass =
    align === 'center'
      ? 'text-center items-center mx-auto'
      : align === 'right'
      ? 'text-right items-end ml-auto'
      : 'text-left items-start';

  return (
    <div
      className={cn('flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8', className)}
      {...props}
    >
      <div className={cn('flex flex-col max-w-3xl', alignClass)}>
        {badge && (
          <span className="inline-flex items-center px-3 py-1 mb-3 rounded-full text-xs font-semibold tracking-widest uppercase bg-[#0A3D78]/10 text-[#0A3D78] dark:bg-white/10 dark:text-white">
            {badge}
          </span>
        )}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#002754] dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>}
    </div>
  );
}
