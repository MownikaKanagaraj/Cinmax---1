'use client';

import * as React from 'react';

export interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return <div className="space-y-6">{children}</div>;
}
