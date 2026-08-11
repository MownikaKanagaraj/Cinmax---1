import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  useCustomerService,
  queryKeys,
  type CustomerEntity,
  type NotificationSettingsData,
  type CustomerPreferencesData,
} from '@cinmax/api';
import type { Address } from '@cinmax/types';

export function useCustomersQuery() {
  const customerService = useCustomerService();

  return useQuery<CustomerEntity[]>({
    queryKey: queryKeys.customers.all,
    queryFn: () => customerService.getCustomers(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCustomerProfileQuery(id?: string, options?: { enabled?: boolean }) {
  const customerService = useCustomerService();

  return useQuery<CustomerEntity | null>({
    queryKey: queryKeys.customers.detail(id || 'current'),
    queryFn: () => (id ? customerService.getProfile(id) : null),
    enabled: Boolean(id) && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateCustomerProfileMutation() {
  const customerService = useCustomerService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CustomerEntity> }) =>
      customerService.updateProfile(id, updates),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.customers.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });
}

export const useUpdateProfile = useUpdateCustomerProfileMutation;

export function useAddressesQuery(userId?: string, options?: { enabled?: boolean }) {
  const customerService = useCustomerService();

  return useQuery<Address[]>({
    queryKey: [...queryKeys.customers.all, 'addresses', userId],
    queryFn: () => (userId ? customerService.getAddresses(userId) : []),
    enabled: Boolean(userId) && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 5,
  });
}

export const useAddresses = useAddressesQuery;

export function useAddCustomerAddressMutation() {
  const customerService = useCustomerService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, address }: { userId: string; address: Omit<Address, 'id'> | Address }) =>
      customerService.addAddress(userId, address),
    onSuccess: (_newAddress, variables) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.customers.all, 'addresses', variables.userId] });
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.detail(variables.userId) });
    },
  });
}

export function useUpdateCustomerAddressMutation() {
  const customerService = useCustomerService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      addressId,
      updates,
    }: {
      userId: string;
      addressId: string;
      updates: Partial<Address>;
    }) => customerService.updateAddress(userId, addressId, updates),
    onSuccess: (_updated, variables) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.customers.all, 'addresses', variables.userId] });
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.detail(variables.userId) });
    },
  });
}

export function useDeleteCustomerAddressMutation() {
  const customerService = useCustomerService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, addressId }: { userId: string; addressId: string }) =>
      customerService.deleteAddress(userId, addressId),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.customers.all, 'addresses', variables.userId] });
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.detail(variables.userId) });
    },
  });
}

export function useSetDefaultAddressMutation() {
  const customerService = useCustomerService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      addressId,
      type,
    }: {
      userId: string;
      addressId: string;
      type?: 'shipping' | 'billing';
    }) => customerService.setDefaultAddress(userId, addressId, type),
    onSuccess: (updatedAddresses, variables) => {
      queryClient.setQueryData([...queryKeys.customers.all, 'addresses', variables.userId], updatedAddresses);
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.detail(variables.userId) });
    },
  });
}

export function useNotificationSettingsQuery(userId?: string, options?: { enabled?: boolean }) {
  const customerService = useCustomerService();

  return useQuery<NotificationSettingsData>({
    queryKey: [...queryKeys.customers.all, 'notification-settings', userId],
    queryFn: () => (userId ? customerService.getNotificationSettings(userId) : {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      marketingEmails: true,
      orderUpdates: true,
    }),
    enabled: Boolean(userId) && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 10,
  });
}

export function useUpdateNotificationSettingsMutation() {
  const customerService = useCustomerService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, settings }: { userId: string; settings: Partial<NotificationSettingsData> }) =>
      customerService.updateNotificationSettings(userId, settings),
    onSuccess: (updated, variables) => {
      queryClient.setQueryData([...queryKeys.customers.all, 'notification-settings', variables.userId], updated);
    },
  });
}

export function useCustomerPreferencesQuery(userId?: string, options?: { enabled?: boolean }) {
  const customerService = useCustomerService();

  return useQuery<CustomerPreferencesData>({
    queryKey: [...queryKeys.customers.all, 'preferences', userId],
    queryFn: () => (userId ? customerService.getCustomerPreferences(userId) : { favoriteIngredients: [] }),
    enabled: Boolean(userId) && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 10,
  });
}

export function useUpdateCustomerPreferencesMutation() {
  const customerService = useCustomerService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, preferences }: { userId: string; preferences: Partial<CustomerPreferencesData> }) =>
      customerService.updateCustomerPreferences(userId, preferences),
    onSuccess: (updated, variables) => {
      queryClient.setQueryData([...queryKeys.customers.all, 'preferences', variables.userId], updated);
    },
  });
}
