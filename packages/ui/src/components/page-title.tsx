import * as React from 'react';
import { cn } from '@cinmax/utils';

export interface PageTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3;
}

export function PageTitle({
  level = 1,
  className,
  children,
  ...props
}: PageTitleProps) {
  if (level === 1) {
    return (
      <h1
        className={cn(
          'font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#002754] dark:text-white',
          className
        )}
        {...props}
      >
        {children}
      </h1>
    );
  }
  if (level === 2) {
    return (
      <h2
        className={cn(
          'font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#002754] dark:text-white',
          className
        )}
        {...props}
      >
        {children}
      </h2>
    );
  }
  return (
    <h3
      className={cn(
        'font-serif text-xl sm:text-2xl font-medium tracking-tight text-[#002754] dark:text-white',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}
