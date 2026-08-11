import * as React from 'react';
import { cn } from '@cinmax/utils';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'mineral' | 'deep' | 'accent';
}

const spacingClasses = {
  none: 'py-0',
  sm: 'py-8 sm:py-12',
  md: 'py-12 sm:py-16 lg:py-20',
  lg: 'py-16 sm:py-24 lg:py-32',
  xl: 'py-24 sm:py-32 lg:py-40',
};

const variantClasses = {
  default: 'bg-background text-foreground',
  mineral: 'bg-[#F7F9FB] dark:bg-[#071324] text-foreground',
  deep: 'bg-[#002754] text-white',
  accent: 'bg-[#F0EDE6] dark:bg-[#121E2E] text-foreground',
};

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing = 'md', variant = 'default', ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          'w-full relative',
          spacingClasses[spacing],
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Section.displayName = 'Section';
