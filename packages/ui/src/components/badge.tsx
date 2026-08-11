import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@cinmax/utils';

export const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors select-none',
  {
    variants: {
      variant: {
        default: 'bg-[#EBF3FF] text-[#0A3D78]',
        primary: 'bg-[#0A3D78] text-white',
        secondary: 'bg-[#ECEEF0] text-[#191C1E]',
        success: 'bg-[#EDFAF0] text-[#186832] border border-[#B8E7C5]',
        organic: 'bg-[#EBF3FF] text-[#0A3D78] border border-[#B4CDFE]',
        vegan: 'bg-[#EDFAF0] text-[#186832] border border-[#B8E7C5]',
        scent: 'bg-[#F8EEFC] text-[#6A2A82]',
        gold: 'bg-[#FEF3C7] text-[#92400E]',
        outline: 'border border-[#CBD5E1] text-[#434750]',
        destructive: 'bg-[#FFDAD6] text-[#93000A]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
