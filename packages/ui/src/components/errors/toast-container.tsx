'use client';

import * as React from 'react';
import { useToastContext } from '@cinmax/hooks';
import { cn } from '@cinmax/utils';

export function ToastContainer() {
  const { toasts, removeToast } = useToastContext();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const bgType =
          t.type === 'success'
            ? 'bg-[#002754] text-white border-[#C5A880]/40'
            : t.type === 'error'
            ? 'bg-red-900 text-white border-red-500/50'
            : t.type === 'warning'
            ? 'bg-amber-900 text-white border-amber-500/50'
            : 'bg-[#0A192F] text-white border-white/20';

        return (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-start justify-between p-4 rounded-[16px] border shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-5',
              bgType
            )}
          >
            <div className="space-y-0.5">
              {t.title && (
                <h4 className="font-bold text-xs uppercase tracking-widest text-[#C5A880]">
                  {t.title}
                </h4>
              )}
              <p className="text-sm font-medium leading-snug">{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-3 text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}
