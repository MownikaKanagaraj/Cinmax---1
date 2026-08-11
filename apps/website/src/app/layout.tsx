import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'CINMAX Global Products | Artisanal Soaps & Personal Care',
    template: '%s | CINMAX Global Products',
  },
  description:
    'Experience pure botanical luxury. Hand-crafted cold-process soaps, organic balms, and natural personal care formulated with organic oils and botanical extracts.',
  keywords: [
    'luxury soap',
    'cold process soap',
    'artisan soap',
    'botanical skincare',
    'organic body wash',
    'vegan personal care',
  ],
};

export default function RootLayout({
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
