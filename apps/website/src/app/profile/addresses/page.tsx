'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../../components/header';
import { Footer } from '../../../components/footer';
import { Container, PageHeader, Breadcrumb, Button, Badge, Input } from '@cinmax/ui';
import {
  useUser,
  useAddressesQuery,
  useAddCustomerAddressMutation,
  useDeleteCustomerAddressMutation,
  useSetDefaultAddressMutation,
} from '@cinmax/hooks';
import { MapPin, Trash2, AlertCircle } from 'lucide-react';

export default function AddressesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useUser();

  const { data: addresses = [], isLoading } = useAddressesQuery(user?.id, {
    enabled: Boolean(user?.id),
  });

  const addAddressMutation = useAddCustomerAddressMutation();
  const deleteAddressMutation = useDeleteCustomerAddressMutation();
  const setDefaultAddressMutation = useSetDefaultAddressMutation();

  const [showAddForm, setShowAddForm] = React.useState(false);
  const [message, setMessage] = React.useState('');

  // Form State
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [streetLine1, setStreetLine1] = React.useState('');
  const [streetLine2, setStreetLine2] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('Tamil Nadu');
  const [postalCode, setPostalCode] = React.useState('');

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    if (!streetLine1 || !city || !postalCode) {
      setMessage('Please fill in required fields (Street, City, Pincode).');
      return;
    }

    try {
      setMessage('');
      await addAddressMutation.mutateAsync({
        userId: user.id,
        address: {
          firstName: firstName || user.firstName || 'Valued',
          lastName: lastName || user.lastName || 'Patron',
          phone: phone || user.phone || '9876543210',
          streetLine1,
          streetLine2,
          city,
          state,
          postalCode,
          country: 'India',
          isDefaultShipping: addresses.length === 0,
          isDefaultBilling: addresses.length === 0,
        },
      });

      setShowAddForm(false);
      setStreetLine1('');
      setStreetLine2('');
      setCity('');
      setPostalCode('');
    } catch (err: any) {
      setMessage(err.message || 'Failed to save address to Supabase.');
    }
  };

  const handleSetDefault = async (addressId: string) => {
    if (!user?.id) return;
    try {
      await setDefaultAddressMutation.mutateAsync({
        userId: user.id,
        addressId,
        type: 'shipping',
      });
    } catch (err: any) {
      console.error('Set default address failed:', err);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!user?.id) return;
    try {
      await deleteAddressMutation.mutateAsync({
        userId: user.id,
        addressId,
      });
    } catch (err: any) {
      console.error('Delete address failed:', err);
    }
  };

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
            badge="Customer Directory"
            title="Saved Addresses"
            subtitle="Manage your primary and secondary shipping locations for rapid checkout."
            actions={
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddForm(!showAddForm)}
                className="rounded-full font-bold bg-[#002754] hover:bg-[#0A3D78] text-white cursor-pointer"
              >
                {showAddForm ? 'Cancel' : '+ Add New Address'}
              </Button>
            }
          />

          {/* Add Address Form Box */}
          {showAddForm && (
            <div className="mt-6 p-6 sm:p-8 rounded-[24px] bg-white dark:bg-[#071324] border-2 border-[#002754] shadow-xl space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#002754] dark:text-white">
                Add New Shipping Address
              </h3>
              {message && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  {message}
                </div>
              )}
              <form onSubmit={handleAddAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                    First Name
                  </label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={user?.firstName || 'Valued'}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                    Last Name
                  </label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={user?.lastName || 'Patron'}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                    Phone Number
                  </label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={user?.phone || '9876543210'}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                    State (Tariff Zone)
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-[12px] text-xs bg-[#F7F9FB] dark:bg-[#0A192F] border border-[#0A3D78]/20 font-bold"
                  >
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Puducherry">Puducherry</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Other States">Other States</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                    Street Address *
                  </label>
                  <Input
                    value={streetLine1}
                    onChange={(e) => setStreetLine1(e.target.value)}
                    placeholder="House/Door No, Building Name, Street Name"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                    Landmark / Line 2
                  </label>
                  <Input
                    value={streetLine2}
                    onChange={(e) => setStreetLine2(e.target.value)}
                    placeholder="Near Park / Landmark"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                    City *
                  </label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Chennai"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                    Postal Pincode *
                  </label>
                  <Input
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="600001"
                    required
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddForm(false)}
                    className="rounded-full"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={addAddressMutation.isPending}
                    className="rounded-full bg-[#002754] text-white font-bold"
                  >
                    {addAddressMutation.isPending ? 'Saving...' : 'Save Address to Supabase'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Addresses Grid */}
          <div className="pt-6">
            {!isAuthenticated ? (
              <div className="p-8 text-center rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-4">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <h3 className="font-serif text-lg font-bold">Authentication Required</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Please log in to view and manage your saved shipping addresses.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => router.push('/login?redirect=/profile/addresses')}
                  className="rounded-full bg-[#002754] text-white font-bold"
                >
                  Sign In Now →
                </Button>
              </div>
            ) : isLoading ? (
              <p className="text-center py-12 text-sm text-muted-foreground">Loading saved addresses from Supabase...</p>
            ) : addresses.length === 0 ? (
              <div className="p-8 text-center rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-4">
                <MapPin className="w-10 h-10 text-[#C5A880] mx-auto" />
                <h3 className="font-serif text-lg font-bold">No Saved Addresses Found</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Add your primary delivery address for faster one-click checkout.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowAddForm(true)}
                  className="rounded-full bg-[#002754] text-white font-bold"
                >
                  + Add Primary Address
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-6 rounded-[24px] bg-white dark:bg-[#071324] border transition-all space-y-4 shadow-sm relative ${
                      addr.isDefaultShipping
                        ? 'border-[#002754] bg-[#002754]/5 dark:bg-[#002754]/20'
                        : 'border-[#0A3D78]/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#002754] dark:text-[#C5A880]" />
                        <span className="font-bold text-sm text-[#002754] dark:text-white">
                          {addr.firstName} {addr.lastName}
                        </span>
                      </div>
                      {addr.isDefaultShipping && <Badge variant="gold">Primary Default</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {addr.streetLine1} {addr.streetLine2 ? `, ${addr.streetLine2}` : ''}<br />
                      {addr.city}, {addr.state} - {addr.postalCode}<br />
                      Phone: {addr.phone || 'N/A'}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-[#0A3D78]/10">
                      {!addr.isDefaultShipping && (
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          disabled={setDefaultAddressMutation.isPending}
                          className="text-xs font-bold text-[#002754] dark:text-[#C5A880] hover:underline"
                        >
                          Set as Primary Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(addr.id)}
                        disabled={deleteAddressMutation.isPending}
                        className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}

