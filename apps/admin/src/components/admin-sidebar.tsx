'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@cinmax/utils';
import {
  LayoutDashboard,
  Package,
  Sparkles,
  Tag,
  Warehouse,
  Users,
  Ticket,
  Star,
  Image as ImageIcon,
  TrendingUp,
  Settings,
  Sliders,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();

  const menuGroups = [
    {
      groupTitle: 'Dashboard',
      items: [
        { label: 'Overview', href: '/', icon: LayoutDashboard },
        { label: 'Sales & Analytics', href: '/analytics', icon: TrendingUp },
      ],
    },
    {
      groupTitle: 'Catalog & Orders',
      items: [
        { label: 'Orders', href: '/orders', icon: Package },
        { label: 'Products', href: '/products', icon: Sparkles },
        { label: 'Categories', href: '/categories', icon: Tag },
      ],
    },
    {
      groupTitle: 'Customers & Marketing',
      items: [
        { label: 'Home Page Manager', href: '/home-manager', icon: Sliders },
        { label: 'Customers', href: '/customers', icon: Users },
        { label: 'Discount Coupons', href: '/coupons', icon: Ticket },
      ],
    },
    {
      groupTitle: 'Store Settings',
      items: [
        { label: 'Store Settings', href: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col flex-shrink-0 min-h-screen border-r border-slate-800 select-none shadow-xl z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 bg-[#0B132B] flex items-center justify-between">
        <Link href="/" prefetch={true} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center font-black text-base shadow-md border border-blue-400/30">
            C
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-extrabold tracking-wider text-white uppercase leading-tight">
              CINMAX
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold">
              Store Manager
            </span>
          </div>
        </Link>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3.5 space-y-6 overflow-y-auto custom-scrollbar">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-1.5">
            <h4 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {group.groupTitle}
            </h4>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/'
                    ? pathname === '/' || pathname === '/dashboard'
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    className={cn(
                      'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 group',
                      isActive
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={cn(
                          'w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110',
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Admin User Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-[#0B132B]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800 text-blue-400 border border-slate-700 flex items-center justify-center font-bold text-xs">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">Store Administrator</p>
            <p className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Admin Logged In
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
