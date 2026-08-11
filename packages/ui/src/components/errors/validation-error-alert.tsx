import * as React from 'react';
import { cn } from '@cinmax/utils';

export interface ValidationErrorAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  errors: string[];
}

export function ValidationErrorAlert({
  errors,
  className,
  ...props
}: ValidationErrorAlertProps) {
  if (!errors || errors.length === 0) return null;

  return (
    <div
      className={cn(
        'p-4 rounded-[16px] bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200',
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest font-bold">Please resolve the following:</p>
          <ul className="list-disc list-inside text-xs space-y-0.5">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
