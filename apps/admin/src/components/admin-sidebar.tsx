'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@cinmax/utils';
import { useSidebar } from '../context/sidebar-context';
import {
  LayoutDashboard,
  Package,
  Sparkles,
  Tag,
  Users,
  Ticket,
  TrendingUp,
  Settings,
  ChevronRight,
  ShieldCheck,
  X,
  GraduationCap,
  CreditCard,
  Truck,
  Award,
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();
  const { isOpen, closeSidebar } = useSidebar();

  if (pathname === '/login') return null;

  // ESSENTIAL OPERATIONS WITH FULL BRIGHT GLOWING GRADIENTS WHEN ACTIVE
  const menuGroups = [
    {
      groupTitle: 'Core Operations',
      items: [
        {
          label: 'Dashboard',
          href: '/',
          icon: LayoutDashboard,
          gradient: 'from-blue-600 to-indigo-600',
          shadowColor: 'shadow-blue-500/30',
        },
        {
          label: 'Products',
          href: '/products',
          icon: Sparkles,
          gradient: 'from-emerald-500 to-teal-600',
          shadowColor: 'shadow-emerald-500/30',
        },
        {
          label: 'Categories',
          href: '/categories',
          icon: Tag,
          gradient: 'from-amber-500 to-orange-600',
          shadowColor: 'shadow-amber-500/30',
        },
        {
          label: 'Orders',
          href: '/orders',
          icon: Package,
          gradient: 'from-purple-600 to-violet-700',
          shadowColor: 'shadow-purple-500/30',
        },
        {
          label: 'Delivery & Shipping',
          href: '/delivery',
          icon: Truck,
          gradient: 'from-blue-500 to-cyan-600',
          shadowColor: 'shadow-blue-500/30',
        },
        {
          label: 'Payments & Ledger',
          href: '/payments',
          icon: CreditCard,
          gradient: 'from-emerald-600 to-teal-700',
          shadowColor: 'shadow-emerald-500/30',
        },
        {
          label: 'Classes & Masterclasses',
          href: '/classes',
          icon: GraduationCap,
          gradient: 'from-amber-500 to-rose-600',
          shadowColor: 'shadow-amber-500/30',
        },
      ],
    },
    {
      groupTitle: 'Management & Marketing',
      items: [
        {
          label: 'Customers',
          href: '/customers',
          icon: Users,
          gradient: 'from-rose-500 to-pink-600',
          shadowColor: 'shadow-rose-500/30',
        },
        {
          label: 'Loyalty & Rewards',
          href: '/loyalty',
          icon: Award,
          gradient: 'from-amber-400 to-yellow-600',
          shadowColor: 'shadow-amber-500/30',
        },
        {
          label: 'Coupons & Offers',
          href: '/coupons',
          icon: Ticket,
          gradient: 'from-cyan-500 to-blue-600',
          shadowColor: 'shadow-cyan-500/30',
        },
        {
          label: 'Analytics & Reports',
          href: '/analytics',
          icon: TrendingUp,
          gradient: 'from-indigo-600 to-blue-700',
          shadowColor: 'shadow-indigo-500/30',
        },
        {
          label: 'Settings & Roles',
          href: '/settings',
          icon: Settings,
          gradient: 'from-blue-600 via-indigo-600 to-purple-700',
          shadowColor: 'shadow-indigo-500/30',
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] text-slate-300 flex flex-col flex-shrink-0 min-h-screen border-r border-slate-800/80 select-none shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 bg-[#0B132B] flex items-center justify-between">
          <Link href="/" prefetch={true} onClick={closeSidebar} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-base shadow-lg shadow-blue-500/30 border border-blue-400/30 group-hover:scale-105 transition-transform">
              C
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-extrabold tracking-wider text-white uppercase leading-tight">
                CINMAX
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Store Manager
              </span>
            </div>
          </Link>

          {/* Close button on Mobile */}
          <button
            onClick={closeSidebar}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden transition-colors"
            title="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav List */}
        <nav className="flex-1 p-3.5 space-y-6 overflow-y-auto custom-scrollbar">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span>{group.groupTitle}</span>
                <span className="h-px flex-1 bg-slate-800" />
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
                      onClick={closeSidebar}
                      className={cn(
                        'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 group active:scale-[0.98]',
                        isActive
                          ? `bg-gradient-to-r ${item.gradient} text-white font-bold shadow-lg ${item.shadowColor} border border-white/20 scale-[1.01]`
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Icon Container */}
                        <div
                          className={cn(
                            'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 shadow-xs border text-white',
                            isActive
                              ? 'bg-white/20 border-white/30 text-white font-bold'
                              : `bg-gradient-to-br ${item.gradient} border-white/10`
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="truncate">{item.label}</span>
                      </div>
                      <ChevronRight
                        className={cn(
                          'w-3.5 h-3.5 transition-transform',
                          isActive ? 'text-white translate-x-0.5' : 'text-slate-500 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5'
                        )}
                      />
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
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white border border-blue-400/30 flex items-center justify-center font-bold text-xs shadow-md">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Store Administrator</p>
              <p className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                System Live &amp; Protected
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
