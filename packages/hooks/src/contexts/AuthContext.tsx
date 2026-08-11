'use client';

import React, { createContext, useContext } from 'react';
import { useAuthStore, AuthStoreState } from '../stores/useAuthStore';
import type { Permission } from '@cinmax/types';
import { hasPermission } from '@cinmax/utils';

interface AuthContextValue extends AuthStoreState {
  can: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthStore();

  const can = (permission: Permission) => {
    return hasPermission(auth.role, permission);
  };

  return (
    <AuthContext.Provider value={{ ...auth, can }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within AuthProvider');
  return context;
}
