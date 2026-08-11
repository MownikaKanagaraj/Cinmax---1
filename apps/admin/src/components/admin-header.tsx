'use client';

import * as React from 'react';
import { Button } from '@cinmax/ui';

export function AdminHeader() {
  return (
    <header className="h-16 bg-white dark:bg-[#071324] border-b border-[#0A3D78]/10 px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Atelier Edge Node Active
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="px-3 py-1 rounded-full bg-[#F7F9FB] dark:bg-[#0A192F] border border-[#0A3D78]/10 text-xs text-muted-foreground">
          Database: <span className="font-bold text-foreground">Supabase Edge Mock</span>
        </div>
        <button
          onClick={() => alert('Atelier Cache Purged')}
          className="px-3 py-1 rounded-full bg-[#0A3D78]/10 hover:bg-[#0A3D78]/20 text-[#0A3D78] dark:text-white text-xs font-bold transition-colors"
        >
          Purge Cache
        </button>
      </div>
    </header>
  );
}
