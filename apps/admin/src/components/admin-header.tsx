'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Search, Menu, LogOut, ChevronDown, User, ShieldCheck, ExternalLink, X, Sparkles, Package } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useSidebar } from '../context/sidebar-context';
import { useProductsQuery } from '@cinmax/hooks';
import type { Product } from '@cinmax/types';

interface SearchItem {
  title: string;
  category: string;
  url: string;
  keywords: string;
  subtitle?: string;
  price?: string;
}

const ADMIN_MODULES_INDEX: SearchItem[] = [
  { title: 'Store Dashboard Overview', category: 'Module', url: '/', keywords: 'dashboard main home metrics revenue sales stats' },
  { title: 'Products & Catalog', category: 'Module', url: '/products', keywords: 'products catalog items stock inventory pricing bar soap rose' },
  { title: 'Add New Product', category: 'Action', url: '/products/new', keywords: 'add new product create variant catalog' },
  { title: 'Customer Orders & Fulfillment', category: 'Module', url: '/orders', keywords: 'orders fulfillment delivery tracking razorpay sales paid' },
  { title: 'Product Categories & Hierarchy', category: 'Module', url: '/categories', keywords: 'categories botanical soaps scrubs skincare' },
  { title: 'Customer Database & CRM', category: 'Module', url: '/customers', keywords: 'customers users profiles clients crm' },
  { title: 'Discount Coupons & Offers', category: 'Module', url: '/coupons', keywords: 'coupons discount promo vouchers code botanical10' },
  { title: 'Loyalty Points Program', category: 'Module', url: '/loyalty', keywords: 'loyalty points tier gold bronze rewards' },
  { title: 'Push Notification Campaigns', category: 'Module', url: '/notifications', keywords: 'notifications push alerts messages telegram' },
  { title: 'Hero Sliders & Banners', category: 'Module', url: '/banners', keywords: 'banners hero sliders images marketing' },
  { title: 'Review Moderation', category: 'Module', url: '/reviews', keywords: 'reviews ratings feedback comments' },
  { title: 'Sales & Revenue Analytics', category: 'Module', url: '/analytics', keywords: 'analytics revenue report graphs statistics' },
  { title: 'Razorpay Payments', category: 'Module', url: '/payments', keywords: 'payments razorpay transactions gateways refund' },
  { title: 'State-Based Delivery Rules', category: 'Module', url: '/delivery', keywords: 'delivery shipping tariff state fee tamil nadu' },
  { title: 'Platform Settings & RBAC', category: 'Module', url: '/settings', keywords: 'settings config telegram bot rbac permissions' },
];

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleSidebar } = useSidebar();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ firstName: string; email: string; role: string } | null>(null);

  const { data: productsData } = useProductsQuery();
  const dbProducts: Product[] = productsData?.items || [];

  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cinmax_admin_session');
      if (stored) {
        setAdminUser(JSON.parse(stored));
      } else {
        setAdminUser({ firstName: 'Admin', email: 'admin.test@cinmax.com', role: 'super_admin' });
      }
    } catch (e) {
      setAdminUser({ firstName: 'Admin', email: 'admin.test@cinmax.com', role: 'super_admin' });
    }
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Combine static modules + live database products
  const productSearchResults: SearchItem[] = dbProducts
    .filter((p) => {
      const query = searchQuery.trim().toLowerCase();
      if (!query) return false;
      return (
        p.title.toLowerCase().includes(query) ||
        p.slug.toLowerCase().includes(query) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(query)) ||
        (p.category?.name && p.category.name.toLowerCase().includes(query))
      );
    })
    .map((p) => ({
      title: p.title,
      category: 'Botanical Product',
      url: `/products?search=${encodeURIComponent(p.title)}`,
      keywords: `${p.title} ${p.slug} ${p.subtitle || ''}`,
      subtitle: p.subtitle || p.category?.name || 'Botanical Item',
      price: `₹${p.basePrice}`,
    }));

  const moduleSearchResults: SearchItem[] = searchQuery.trim()
    ? ADMIN_MODULES_INDEX.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.keywords.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Product results first, then module results
  const filteredResults = [...productSearchResults, ...moduleSearchResults];

  const handleSelectResult = (url: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    router.push(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredResults.length > 0) {
      handleSelectResult(filteredResults[0].url);
    }
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem('cinmax_admin_session');
    } catch (e) {}
    setIsProfileMenuOpen(false);
    router.push('/login');
  };

  const getPageTitle = (path: string) => {
    if (path === '/' || path === '/dashboard') return 'Store Dashboard Overview';
    if (path.startsWith('/orders')) return 'Customer Orders & Fulfillment';
    if (path.startsWith('/products')) return 'Products & Catalog Management';
    if (path.startsWith('/categories')) return 'Product Categories & Hierarchy';
    if (path.startsWith('/customers')) return 'Customer Database & CRM';
    if (path.startsWith('/reviews')) return 'Review Moderation & Loyalty Points';
    if (path.startsWith('/banners')) return 'Hero Sliders & Promotional Banners';
    if (path.startsWith('/coupons')) return 'Discount Coupons & Offers';
    if (path.startsWith('/loyalty')) return 'Loyalty Points Program & Ledger';
    if (path.startsWith('/notifications')) return 'Push Notification Campaigns';
    if (path.startsWith('/analytics')) return 'Sales & Business Analytics';
    if (path.startsWith('/payments')) return 'Razorpay Payments & Transactions';
    if (path.startsWith('/delivery')) return 'State-Based Delivery Charge Engine';
    if (path.startsWith('/settings')) return 'Platform Settings & RBAC Permissions';
    return 'Store Administration';
  };

  // If on login route, don't show admin header
  if (pathname === '/login') return null;

  return (
    <header className="h-16 bg-white dark:bg-[#0B132B] border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between select-none shadow-xs z-30 relative">
      {/* Left: Mobile Toggle & Section Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition-colors flex-shrink-0"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </button>

        <h2 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white font-sans tracking-tight truncate">
          {getPageTitle(pathname)}
        </h2>

        <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 items-center gap-1 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          System Live
        </span>
      </div>

      {/* Right: Search & Admin Profile */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Interactive Global Live Search */}
        <div ref={searchRef} className="relative hidden md:block">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 w-48 lg:w-64 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search products (e.g. Rose, Saffron), modules..."
              className="w-full text-xs bg-transparent outline-none text-[#0F172A] dark:text-white placeholder-slate-400 font-medium"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Popup */}
          {isSearchOpen && searchQuery.trim() !== '' && (
            <div className="absolute right-0 top-full mt-2 w-84 bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 max-h-96 overflow-y-auto space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span>Matching Results ({filteredResults.length})</span>
                <span className="font-mono text-[9px] text-slate-400">Press Enter ↵</span>
              </div>

              {filteredResults.length > 0 ? (
                filteredResults.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectResult(item.url)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors flex items-center justify-between group border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold">
                        {item.category === 'Botanical Product' ? <Sparkles className="w-3.5 h-3.5" /> : <Package className="w-3.5 h-3.5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0F172A] dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                          {item.title}
                        </p>
                        <span className="text-[10px] font-semibold text-slate-400 block truncate">
                          {item.subtitle || item.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                      {item.price && (
                        <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400">
                          {item.price}
                        </span>
                      )}
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No products or modules found for &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Admin Profile & Logout Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center font-bold text-xs shadow-sm border border-blue-400/20">
              {adminUser?.firstName ? adminUser.firstName[0].toUpperCase() : 'A'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-[#0F172A] dark:text-white leading-none">
                {adminUser?.firstName || 'Admin Control'}
              </p>
              <p className="text-[10px] text-emerald-500 font-semibold leading-tight mt-0.5 capitalize">
                {adminUser?.role?.replace('_', ' ') || 'Super Admin'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {/* Profile Dropdown */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 space-y-1">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 space-y-0.5">
                <p className="text-xs font-bold text-[#0F172A] dark:text-white">
                  {adminUser?.firstName || 'Admin Director'}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{adminUser?.email || 'admin.test@cinmax.com'}</p>
                <span className="inline-flex px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-1">
                  Role: {adminUser?.role || 'super_admin'}
                </span>
              </div>

              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  router.push('/settings');
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>Account Settings</span>
              </button>

              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Sign Out of Admin</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
