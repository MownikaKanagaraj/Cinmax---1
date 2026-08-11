import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminService, queryKeys } from '@cinmax/api';
import type { ReviewStatus, UserRole, Permission } from '@cinmax/types';

export function useExecutiveDashboardQuery() {
  const adminService = useAdminService();

  return useQuery({
    queryKey: [...queryKeys.analytics.all, 'executive-dashboard'],
    queryFn: () => adminService.getDashboardData(),
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useAuditLogsQuery() {
  const adminService = useAdminService();

  return useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => adminService.getAuditLogs(),
    staleTime: 1000 * 15,
  });
}

export function useModerateReviewMutation() {
  const adminService = useAdminService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, status, replyText }: { reviewId: string; status: ReviewStatus; replyText?: string }) =>
      adminService.moderateReview(reviewId, status, replyText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
  });
}

export function useExportReportMutation() {
  const adminService = useAdminService();

  return useMutation({
    mutationFn: (reportType: 'sales' | 'gst' | 'inventory' | 'customers') =>
      adminService.exportReport(reportType),
  });
}

export function useAdminPermissions(role: UserRole, permission: Permission) {
  const adminService = useAdminService();
  return adminService.hasAdminAccess(role, permission);
}
