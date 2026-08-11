import { useState, useEffect } from 'react';
import type { CustomerProfile } from '@cinmax/types';

export function useAuth() {
  const [user, setUser] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Initial placeholder session hydration
    setIsLoading(false);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    setUser,
  };
}
