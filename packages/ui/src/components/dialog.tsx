import * as React from 'react';
import { cn } from '@cinmax/utils';
import { X } from 'lucide-react';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative z-50 w-full max-w-lg rounded-[24px] bg-white dark:bg-[#071324] p-6 shadow-ambient-lg transition-all duration-300 animate-in fade-in zoom-in-95 border border-[#0A3D78]/10 dark:border-slate-800',
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-[#737781] hover:bg-[#F2F4F6] hover:text-[#191C1E] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>
        {title && (
          <h2 className="font-headline text-2xl font-semibold text-[#002754] dark:text-white">{title}</h2>
        )}
        {description && (
          <p className="mt-1 text-sm text-[#434750] dark:text-slate-300">{description}</p>
        )}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
