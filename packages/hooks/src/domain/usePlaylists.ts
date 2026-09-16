import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getContainer, queryKeys } from '@cinmax/api';
import type {
  CreatePlaylistPayload,
  UpdatePlaylistPayload,
  CreatePlaylistVideoPayload,
  UpdatePlaylistVideoPayload,
  RecordPlaylistPurchasePayload,
} from '@cinmax/types';

export function usePlaylistsQuery(publishedOnly = true, productId?: string) {
  return useQuery({
    queryKey: productId ? queryKeys.playlists.byProduct(productId) : queryKeys.playlists.list(publishedOnly),
    queryFn: async () => {
      const container = getContainer();
      if (productId) {
        return container.playlistRepo.getPlaylistsByProduct(productId);
      }
      if (publishedOnly) {
        return container.playlistRepo.getPublishedPlaylists();
      }
      return container.playlistRepo.getAllAdminPlaylists();
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function usePlaylistDetailsQuery(playlistId: string) {
  return useQuery({
    queryKey: queryKeys.playlists.detail(playlistId),
    queryFn: async () => {
      if (!playlistId) return null;
      const container = getContainer();
      return container.playlistRepo.getPlaylistById(playlistId);
    },
    enabled: Boolean(playlistId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUserPlaylistPurchasesQuery(userId?: string) {
  return useQuery({
    queryKey: queryKeys.playlists.userPurchases(userId),
    queryFn: async () => {
      if (!userId) return [];
      const container = getContainer();
      return container.playlistRepo.getUserPurchases(userId);
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 2,
  });
}

export function usePlaylistAccessQuery(userId?: string, playlistId?: string) {
  return useQuery({
    queryKey: queryKeys.playlists.access(userId, playlistId),
    queryFn: async () => {
      if (!userId || !playlistId) return false;
      const container = getContainer();
      return container.playlistRepo.verifyPlaylistAccess(userId, playlistId);
    },
    enabled: Boolean(userId && playlistId),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreatePlaylistMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreatePlaylistPayload) => {
      const container = getContainer();
      return container.playlistRepo.createPlaylist(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.playlists.all });
    },
  });
}

export function useUpdatePlaylistMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdatePlaylistPayload }) => {
      const container = getContainer();
      return container.playlistRepo.updatePlaylist(id, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.playlists.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.playlists.detail(variables.id) });
    },
  });
}

export function useDeletePlaylistMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const container = getContainer();
      return container.playlistRepo.deletePlaylist(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.playlists.all });
    },
  });
}

export function useAddVideoToPlaylistMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ playlistId, payload }: { playlistId: string; payload: CreatePlaylistVideoPayload }) => {
      const container = getContainer();
      return container.playlistRepo.addVideoToPlaylist(playlistId, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.playlists.detail(variables.playlistId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.playlists.all });
    },
  });
}

export function useUpdatePlaylistVideoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ videoId, payload }: { videoId: string; payload: UpdatePlaylistVideoPayload }) => {
      const container = getContainer();
      return container.playlistRepo.updatePlaylistVideo(videoId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.playlists.all });
    },
  });
}

export function useDeletePlaylistVideoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (videoId: string) => {
      const container = getContainer();
      return container.playlistRepo.deletePlaylistVideo(videoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.playlists.all });
    },
  });
}

export function useRecordPlaylistPurchaseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: RecordPlaylistPurchasePayload) => {
      const container = getContainer();
      return container.playlistRepo.recordPlaylistPurchase(payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.playlists.userPurchases(variables.userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.playlists.access(variables.userId, variables.playlistId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.playlists.all });
    },
  });
}
