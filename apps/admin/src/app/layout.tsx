import type { Metadata } from 'next';
import { AdminProviders } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'CINMAX Admin Portal | Operations & Inventory Management',
    template: '%s | CINMAX Admin',
  },
  description: 'Enterprise inventory, order fulfillment, customer profiles and revenue analytics for CINMAX Global Products.',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F7F9FB] font-body text-[#191C1E] antialiased selection:bg-[#0A3D78] selection:text-white">
        <AdminProviders>{children}</AdminProviders>
      </body>
    </html>
  );
}
