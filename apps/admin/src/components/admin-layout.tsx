'use client';

import * as React from 'react';
import { AdminSidebar } from './admin-sidebar';
import { AdminHeader } from './admin-header';

export interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen flex bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
