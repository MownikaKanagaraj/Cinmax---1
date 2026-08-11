import { create } from 'zustand';
import type { CustomerProfile, UserRole } from '@cinmax/types';

export interface AuthStoreState {
  user: CustomerProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  token: string | null;
  login: (user: CustomerProfile, token?: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<CustomerProfile>) => void;
  setRole: (role: UserRole) => void;
}

const mockCustomer: CustomerProfile = {
  id: 'usr_mock_001',
  authId: 'auth_mock_001',
  email: 'aurora.vance@cinmaxglobal.com',
  firstName: 'Aurora',
  lastName: 'Vance',
  phone: '+1 (555) 234-5678',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'super_admin', // Default to super_admin in mock architecture mode for instant previewing
  loyaltyTier: 'platinum',
  loyaltyPoints: 4800,
  savedAddresses: [
    {
      id: 'addr_1',
      firstName: 'Aurora',
      lastName: 'Vance',
      streetLine1: '742 Evergreen Terrace',
      city: 'Beverly Hills',
      state: 'CA',
      postalCode: '90210',
      country: 'United States',
      phone: '+1 (555) 234-5678',
      isDefaultShipping: true,
      isDefaultBilling: true,
    },
  ],
  wishlistProductIds: ['p1000000-0000-0000-0000-000000000001'],
  createdAt: '2026-01-15T08:00:00Z',
  updatedAt: '2026-08-01T12:00:00Z',
};

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: mockCustomer,
  role: mockCustomer.role,
  isAuthenticated: true,
  token: 'mock_jwt_token_azure_luxe',

  login: (user, token = 'mock_jwt_token') =>
    set({ user, role: user.role, isAuthenticated: true, token }),

  logout: () =>
    set({ user: null, role: 'customer', isAuthenticated: false, token: null }),

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),

  setRole: (role) =>
    set((state) => ({
      role,
      user: state.user ? { ...state.user, role } : null,
    })),
}));
