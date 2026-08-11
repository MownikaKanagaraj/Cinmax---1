import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotificationService, queryKeys, type NotificationEntity } from '@cinmax/api';

export function useNotificationsQuery(userId?: string, options?: { enabled?: boolean }) {
  const notificationService = useNotificationService();

  return useQuery<NotificationEntity[]>({
    queryKey: queryKeys.notifications.list(userId),
    queryFn: () => notificationService.getNotifications(userId),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 2,
  });
}

export function useUnreadNotificationsCountQuery(userId?: string) {
  const notificationService = useNotificationService();

  return useQuery<number>({
    queryKey: queryKeys.notifications.unreadCount(userId),
    queryFn: () => notificationService.getUnreadCount(userId),
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}

export function useMarkNotificationReadMutation() {
  const notificationService = useNotificationService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

export function useMarkAllNotificationsReadMutation() {
  const notificationService = useNotificationService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId?: string) => notificationService.markAllAsRead(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}
