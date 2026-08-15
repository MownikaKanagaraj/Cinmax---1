'use client';

import * as React from 'react';
import { Search, Bell, Shield } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function AdminHeader() {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    if (path === '/' || path === '/dashboard') return 'Store Dashboard Overview';
    if (path.startsWith('/home-manager')) return 'Home Page Marketing Manager';
    if (path.startsWith('/orders')) return 'Customer Orders & Shipments';
    if (path.startsWith('/products')) return 'Products & Catalog';
    if (path.startsWith('/categories')) return 'Product Categories';
    if (path.startsWith('/inventory')) return 'Stock & Warehouse Inventory';
    if (path.startsWith('/customers')) return 'Customer Management';
    if (path.startsWith('/banners')) return 'Homepage Banners';
    if (path.startsWith('/coupons')) return 'Discount Coupons & Offers';
    if (path.startsWith('/reviews')) return 'Customer Reviews & Feedback';
    if (path.startsWith('/media')) return 'Image & Media Gallery';
    if (path.startsWith('/analytics')) return 'Sales & Revenue Reports';
    if (path.startsWith('/settings')) return 'Store Settings & Configuration';
    return 'Store Administration';
  };

  return (
    <header className="h-16 bg-white dark:bg-[#0B132B] border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between select-none shadow-sm z-10">
      {/* Left: Section Title */}
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-bold text-[#0F172A] dark:text-white font-sans tracking-tight">
          {getPageTitle(pathname)}
        </h2>
        <span className="hidden md:inline-flex px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Store Online
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Quick Search */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 w-60">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders, products, customers..."
            className="w-full text-xs bg-transparent outline-none text-[#0F172A] dark:text-white placeholder-slate-400 font-medium"
          />
        </div>

        {/* Database Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <Shield className="w-3.5 h-3.5 text-blue-500" />
          <span>Status: <strong className="text-[#0F172A] dark:text-white">Connected</strong></span>
        </div>

        {/* Notification Icon */}
        <button
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600"></span>
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            A
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-[#0F172A] dark:text-white leading-none">Admin User</p>
            <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Store Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}
