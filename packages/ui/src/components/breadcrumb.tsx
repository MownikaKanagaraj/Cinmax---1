import * as React from 'react';
import { cn } from '@cinmax/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

export function Breadcrumb({
  items,
  separator = '/',
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-2 text-xs uppercase tracking-widest text-muted-foreground mb-6', className)}
      {...props}
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center space-x-2">
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="hover:text-[#0A3D78] dark:hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={cn(
                    isLast
                      ? 'font-semibold text-[#002754] dark:text-white'
                      : 'text-muted-foreground'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className="text-muted-foreground/50 select-none">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
