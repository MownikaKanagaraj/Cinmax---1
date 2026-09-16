'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  LuxurySearchIcon,
  LuxuryTruckIcon,
  LuxuryGiftIcon,
  LuxuryLeafIcon,
} from './luxury-icons';

export function SearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
      <form onSubmit={handleSearchSubmit} className="relative w-full flex-1">
        <LuxurySearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search artisanal soaps, botanical serums, hair oils..."
          className="w-full bg-white dark:bg-slate-900 text-[#191C1E] dark:text-white text-xs sm:text-sm rounded-full py-3.5 pl-12 pr-4 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A3D78] dark:focus:ring-blue-500 transition-all shadow-sm placeholder:text-slate-400 min-h-[44px]"
        />
      </form>

      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full md:w-auto pb-1 md:pb-0">
        <div className="flex items-center gap-1.5 bg-[#0A3D78]/10 text-[#0A3D78] dark:bg-blue-950/80 dark:text-blue-300 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap border border-[#0A3D78]/15 dark:border-blue-800 flex-shrink-0">
          <LuxuryTruckIcon size={16} className="text-[#0A3D78] dark:text-blue-300" />
          <span>Free Shipping above ₹499</span>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap border border-amber-500/20 flex-shrink-0">
          <LuxuryGiftIcon size={16} className="text-amber-600" />
          <span>Buy 2 Get 1 Free</span>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap border border-emerald-500/20 flex-shrink-0">
          <LuxuryLeafIcon size={16} className="text-emerald-600" />
          <span>100% Organic Cured</span>
        </div>
      </div>
    </div>
  );
}
