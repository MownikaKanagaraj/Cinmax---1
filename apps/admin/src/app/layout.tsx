import type { Metadata } from 'next';
import { AdminProviders } from './providers';
import { AdminSidebar } from '../components/admin-sidebar';
import { AdminHeader } from '../components/admin-header';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'CINMAX Corporate Admin | Store Management',
    template: '%s | CINMAX Admin',
  },
  description: 'Store management, order fulfillment, customer profiles and revenue analytics for CINMAX Global Products.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="font-sans">
      <head>
        {/* Preconnect first, then preload the actual stylesheet for zero render-blocking */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-[#070F1E] font-body text-[#0F172A] dark:text-white antialiased selection:bg-blue-600 selection:text-white">
        <AdminProviders>
          <div className="min-h-screen flex bg-slate-50 dark:bg-[#070F1E]">
            {/* Sidebar is static — never unmounts on navigation */}
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
              <AdminHeader />
              <main className="flex-1 p-6 md:p-8 overflow-y-auto admin-page-enter">{children}</main>
            </div>
          </div>
        </AdminProviders>
      </body>
    </html>
  );
}
