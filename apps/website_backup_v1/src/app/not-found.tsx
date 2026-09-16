'use client';

import * as React from 'react';
import Link from 'next/link';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { Container, Button } from '@cinmax/ui';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />

      <main className="flex-1 py-20 flex items-center justify-center">
        <Container size="md">
          <div className="text-center p-12 rounded-[28px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-xl space-y-6">
            <span className="text-xs uppercase tracking-widest font-bold text-[#C5A880]">
              Error 404
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#002754] dark:text-white">
              Formulation Not Located
            </h1>
            <p className="text-base text-muted-foreground max-w-md mx-auto">
              The page or botanical blend you were seeking may have been retired or moved to another section of our catalog.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Button variant="primary" size="md" className="rounded-full">
                <Link href="/">Return to Home</Link>
              </Button>
              <Button variant="outline" size="md" className="rounded-full">
                <Link href="/shop">Explore Catalog</Link>
              </Button>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
