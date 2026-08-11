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

export function useCurrentSessionQuery(options?: { enabled?: boolean }) {
  const authService = useAuthService();

  return useQuery<AuthSessionEntity | null>({
    queryKey: queryKeys.auth.session(),
    queryFn: () => authService.getCurrentSession(),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 10,
  });
}

export const useSession = useCurrentSessionQuery;

export function useUser() {
  const { data: session, isLoading } = useCurrentSessionQuery();
  return {
    user: session?.user ?? null,
    isAuthenticated: Boolean(session?.isAuthenticated),
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
