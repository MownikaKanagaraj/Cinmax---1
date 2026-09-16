import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  useAuthService,
  queryKeys,
  type AuthSessionEntity,
  type LoginPayload,
  type RegisterPayload,
  type VerifyOTPPayload,
  type OAuthLoginOptions,
} from '@cinmax/api';
import { useAuthStore } from '../stores/useAuthStore';

export function useCurrentSessionQuery(options?: { enabled?: boolean }) {
  const authService = useAuthService();

  return useQuery<AuthSessionEntity | null>({
    queryKey: queryKeys.auth.session(),
    queryFn: () => authService.getCurrentSession(),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 30,
  });
}

export const useSession = useCurrentSessionQuery;

export function useUser() {
  const { data: session, isLoading } = useCurrentSessionQuery();
  const authUser = useAuthStore((s) => s.user);
  const authToken = useAuthStore((s) => s.token);
  const isAuthInStore = useAuthStore((s) => s.isAuthenticated);
  const storeLogin = useAuthStore((s) => s.login);

  React.useEffect(() => {
    if (session?.user && session?.isAuthenticated) {
      const u = session.user as any;
      const targetToken = session.token || 'session_token';
      if (authUser?.id === u.id && authToken === targetToken) {
        return;
      }

      const rawRole = u.role;
      const parsedRole = (rawRole === 'admin' || rawRole === 'super_admin') ? rawRole : 'customer';

      storeLogin(
        {
          id: u.id,
          authId: u.id,
          email: u.email,
          firstName: u.firstName || u.user_metadata?.first_name || u.email?.split('@')[0] || 'Valued',
          lastName: u.lastName || u.user_metadata?.last_name || 'Customer',
          phone: u.phone || u.user_metadata?.phone || '',
          role: parsedRole as any,
          loyaltyTier: u.loyaltyTier || u.loyalty_tier || 'bronze',
          loyaltyPoints: Math.max(0, u.loyaltyPoints ?? u.loyalty_points ?? 0),
          savedAddresses: [],
          wishlistProductIds: [],
          createdAt: u.created_at || new Date().toISOString(),
          updatedAt: u.updated_at || new Date().toISOString(),
        },
        session.token || undefined
      );
    }
  }, [session, authUser?.id, authToken, storeLogin]);

  const activeUser = React.useMemo(() => {
    if (authUser) return authUser;
    if (!session?.user) return null;
    const u = session.user as any;
    const rawRole = u.role;
    const parsedRole = (rawRole === 'admin' || rawRole === 'super_admin') ? rawRole : 'customer';
    return {
      id: u.id,
      authId: u.id,
      email: u.email,
      firstName: u.firstName || u.user_metadata?.first_name || u.email?.split('@')[0] || 'Valued',
      lastName: u.lastName || u.user_metadata?.last_name || 'Customer',
      phone: u.phone || u.user_metadata?.phone || '',
      role: parsedRole as any,
      loyaltyTier: u.loyaltyTier || u.loyalty_tier || 'bronze',
      loyaltyPoints: Math.max(0, u.loyaltyPoints ?? u.loyalty_points ?? 0),
      savedAddresses: [],
      wishlistProductIds: [],
      createdAt: u.created_at || new Date().toISOString(),
      updatedAt: u.updated_at || new Date().toISOString(),
    };
  }, [authUser, session?.user]);

  return {
    user: activeUser,
    isAuthenticated: Boolean(isAuthInStore || session?.isAuthenticated),
    isLoading,
  };
}

export function useLoginMutation() {
  const authService = useAuthService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (session) => {
      queryClient.setQueryData(queryKeys.auth.session(), session);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });

      if (session?.user) {
        const u = session.user as any;
        const rawRole = u.role;
        const parsedRole = (rawRole === 'admin' || rawRole === 'super_admin') ? rawRole : 'customer';

        useAuthStore.getState().login(
          {
            id: u.id,
            authId: u.id,
            email: u.email,
            firstName: u.firstName || u.user_metadata?.first_name || u.email?.split('@')[0] || 'Valued',
            lastName: u.lastName || u.user_metadata?.last_name || 'Customer',
            phone: u.phone || u.user_metadata?.phone || '',
            role: parsedRole as any,
            loyaltyTier: u.loyaltyTier || u.loyalty_tier || 'bronze',
            loyaltyPoints: Math.max(0, u.loyaltyPoints ?? u.loyalty_points ?? 0),
            savedAddresses: [],
            wishlistProductIds: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          session.token || undefined
        );
      }
    },
  });
}

export const useLogin = useLoginMutation;

export function useRegisterMutation() {
  const authService = useAuthService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (session) => {
      queryClient.setQueryData(queryKeys.auth.session(), session);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });

      if (session?.user) {
        const u = session.user as any;
        useAuthStore.getState().login(
          {
            id: u.id,
            authId: u.id,
            email: u.email,
            firstName: u.firstName || u.user_metadata?.first_name || u.email?.split('@')[0] || 'Valued',
            lastName: u.lastName || u.user_metadata?.last_name || 'Customer',
            phone: u.phone || u.user_metadata?.phone || '',
            role: 'customer',
            loyaltyTier: u.loyaltyTier || u.loyalty_tier || 'bronze',
            loyaltyPoints: Math.max(0, u.loyaltyPoints ?? u.loyalty_points ?? 0),
            savedAddresses: [],
            wishlistProductIds: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          session.token || undefined
        );
      }
    },
  });
}

export const useRegister = useRegisterMutation;

export function useLogoutMutation() {
  const authService = useAuthService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.auth.session(), null);
      queryClient.invalidateQueries();
      useAuthStore.getState().logout();
    },
  });
}

export const useLogout = useLogoutMutation;

export function useForgotPasswordMutation() {
  const authService = useAuthService();

  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
}

export function useResetPasswordMutation() {
  const authService = useAuthService();

  return useMutation({
    mutationFn: (newPassword: string) => authService.resetPassword(newPassword),
  });
}

export function useVerifyOTPMutation() {
  const authService = useAuthService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VerifyOTPPayload) => authService.verifyOTP(payload),
    onSuccess: (session) => {
      queryClient.setQueryData(queryKeys.auth.session(), session);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });

      if (session?.user) {
        const u = session.user as any;
        const rawRole = u.role;
        const parsedRole = (rawRole === 'admin' || rawRole === 'super_admin') ? rawRole : 'customer';

        useAuthStore.getState().login(
          {
            id: u.id,
            authId: u.id,
            email: u.email || `${u.phone || 'patron'}@cinmax.com`,
            firstName: u.firstName || u.user_metadata?.first_name || 'Valued',
            lastName: u.lastName || u.user_metadata?.last_name || 'Patron',
            phone: u.phone || u.user_metadata?.phone || '',
            role: parsedRole as any,
            loyaltyTier: u.loyaltyTier || u.loyalty_tier || 'bronze',
            loyaltyPoints: Math.max(0, u.loyaltyPoints ?? u.loyalty_points ?? 0),
            savedAddresses: [],
            wishlistProductIds: [],
            createdAt: u.created_at || new Date().toISOString(),
            updatedAt: u.updated_at || new Date().toISOString(),
          },
          session.token || undefined
        );
      }
    },
  });
}

export function useOAuthLoginMutation() {
  const authService = useAuthService();

  return useMutation({
    mutationFn: ({ provider, options }: { provider: 'google' | 'apple'; options?: OAuthLoginOptions }) => {
      if (provider === 'google') return authService.loginWithGoogle(options);
      return authService.loginWithApple(options);
    },
  });
}

export function usePhoneLoginMutation() {
  const authService = useAuthService();

  return useMutation({
    mutationFn: (phone: string) => authService.loginWithPhone(phone),
  });
}
