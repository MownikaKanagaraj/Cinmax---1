import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getContainer, queryKeys } from '@cinmax/api';
import type { CreateVideoPayload, UpdateVideoPayload, RecordVideoPurchasePayload } from '@cinmax/api';

export function useVideosQuery(publishedOnly = true) {
  return useQuery({
    queryKey: queryKeys.videos.list(publishedOnly),
    queryFn: async () => {
      const container = getContainer();
      if (publishedOnly) {
        return container.videoRepo.getPublishedVideos();
      }
      return container.videoRepo.getAllAdminVideos();
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useUserVideoPurchasesQuery(userId?: string) {
  return useQuery({
    queryKey: queryKeys.videos.userPurchases(userId),
    queryFn: async () => {
      if (!userId) return [];
      const container = getContainer();
      return container.videoRepo.getUserPurchases(userId);
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateVideoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateVideoPayload) => {
      const container = getContainer();
      return container.videoRepo.createVideo(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.all });
    },
  });
}

export function useUpdateVideoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateVideoPayload }) => {
      const container = getContainer();
      return container.videoRepo.updateVideo(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.all });
    },
  });
}

export function useDeleteVideoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const container = getContainer();
      return container.videoRepo.deleteVideo(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.all });
    },
  });
}

export function usePurchaseVideoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: RecordVideoPurchasePayload) => {
      const container = getContainer();
      return container.videoRepo.recordVideoPurchase(payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.userPurchases(variables.userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.all });
    },
  });
}
