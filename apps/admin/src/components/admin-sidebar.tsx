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
  Hourglass,
  Users,
  Ticket,
  Star,
  Image as ImageIcon,
  TrendingUp,
  Settings,
  Sliders,
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/', icon: LayoutDashboard },
    { label: 'Orders', href: '/orders', icon: Package },
    { label: 'Products', href: '/products', icon: Sparkles },
    { label: 'Categories', href: '/categories', icon: Tag },
    { label: 'Inventory & Curing', href: '/inventory', icon: Hourglass },
    { label: 'Customers', href: '/customers', icon: Users },
    { label: 'Hero Banners & Sliders', href: '/banners', icon: Sliders },
    { label: 'Coupons & Passes', href: '/coupons', icon: Ticket },
    { label: 'Reviews & Feedback', href: '/reviews', icon: Star },
    { label: 'Media & Storage', href: '/media', icon: ImageIcon },
    { label: 'Analytics & Revenue', href: '/analytics', icon: TrendingUp },
    { label: 'Store Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#002754] text-white flex flex-col flex-shrink-0 min-h-screen border-r border-[#0A3D78]/20">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <Link href="/" className="flex flex-col">
          <span className="font-serif text-2xl font-black tracking-widest text-white uppercase">
            CINMAX
          </span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#C5A880] font-bold">
            Operations Portal
          </span>
        </Link>
      </div>

      {/* Nav list */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/'
              ? pathname === '/' || pathname === '/dashboard'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-[14px] text-xs font-semibold uppercase tracking-wider transition-all duration-200',
                isActive
                  ? 'bg-[#0A3D78] text-white shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Operator Info */}
      <div className="p-4 border-t border-white/10 bg-[#001D40]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#C5A880] text-[#002754] flex items-center justify-center font-bold text-xs">
            OP
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">Administrator</p>
            <p className="text-[10px] text-[#C5A880] truncate">Master Atelier Role</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
