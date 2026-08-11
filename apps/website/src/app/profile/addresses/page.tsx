'use client';

import * as React from 'react';
import { Header } from '../../../components/header';
import { Footer } from '../../../components/footer';
import { Container, PageHeader, Breadcrumb, Button, Badge } from '@cinmax/ui';

export default function AddressesPage() {
  const addresses = [
    {
      id: 'addr_1',
      isDefault: true,
      label: 'Home Atelier',
      fullName: 'Aurora Vance',
      street: '742 Evergreen Terrace, Suite 400',
      city: 'Beverly Hills',
      state: 'CA',
      postalCode: '90210',
      country: 'United States',
    },
    {
      id: 'addr_2',
      isDefault: false,
      label: 'Studio Office',
      fullName: 'Aurora Vance',
      street: '100 Ocean Avenue, Floor 12',
      city: 'Santa Monica',
      state: 'CA',
      postalCode: '90401',
      country: 'United States',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] dark:bg-[#040C18] text-[#191C1E] dark:text-white">
      <Header />

      <main className="flex-1 py-10">
        <Container size="xl">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Profile', href: '/profile' },
              { label: 'Addresses', isCurrent: true },
            ]}
          />

          <PageHeader
            badge="Shipping Directory"
            title="Saved Addresses"
            subtitle="Manage your primary and auxiliary delivery locations for seamless order processing."
            actions={
              <Button variant="primary" size="sm" className="rounded-full">
                + Add New Address
              </Button>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#002754] dark:text-white">
                    {addr.label}
                  </span>
                  {addr.isDefault && <Badge variant="gold">Default</Badge>}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {addr.fullName}<br />
                  {addr.street}<br />
                  {addr.city}, {addr.state} {addr.postalCode}<br />
                  {addr.country}
                </p>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" size="sm" className="rounded-full text-xs">
                    Edit
                  </Button>
                  {!addr.isDefault && (
                    <Button variant="outline" size="sm" className="rounded-full text-xs">
                      Set as Default
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
