import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@cinmax/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-[#0A3D78] to-[#1E5AAD] text-white shadow-ambient hover:shadow-ambient-hover hover:from-[#002754] hover:to-[#0A3D78] rounded-full font-semibold',
        primary:
          'bg-gradient-to-r from-[#0A3D78] to-[#1E5AAD] text-white shadow-ambient hover:shadow-ambient-hover hover:from-[#002754] hover:to-[#0A3D78] rounded-full font-semibold',
        luxury:
          'bg-[#002754] text-white hover:bg-[#0A3D78] shadow-ambient rounded-full font-semibold tracking-wide',
        secondary:
          'bg-[#ECEEF0] text-[#191C1E] hover:bg-[#E0E3E5] rounded-full',
        outline:
          'border border-[#E2E8F0] bg-transparent text-[#191C1E] hover:bg-[#F2F4F6] hover:border-[#CBD5E1] rounded-full',
        ghost:
          'text-[#191C1E] hover:bg-[#ECEEF0] rounded-full',
        link:
          'text-[#0A3D78] underline-offset-4 hover:underline',
        destructive:
          'bg-[#BA1A1A] text-white hover:bg-[#93000A] rounded-full',
      },
      size: {
        default: 'h-11 px-6 py-2.5',
        md: 'h-11 px-6 py-2.5',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-13 px-8 py-3 text-base',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
