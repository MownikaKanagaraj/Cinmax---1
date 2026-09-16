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

// Store starts unauthenticated — real Supabase session populates user on login
export const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  role: 'customer',
  isAuthenticated: false,
  token: null,

  login: (user, token = 'session_token') =>
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
