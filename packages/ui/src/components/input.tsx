import * as React from 'react';
import { cn } from '@cinmax/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-[#434750]"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            'flex h-12 w-full rounded-xl bg-[#F2F4F6] px-4 py-2 text-sm text-[#191C1E] transition-all duration-200 placeholder:text-[#737781] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A3D78] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border border-[#BA1A1A] focus:ring-[#BA1A1A]',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-[#BA1A1A]">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
