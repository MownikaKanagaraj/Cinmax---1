import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContainer } from './useContainer';
import type { HomeMarketingSettings } from '@cinmax/types';

export const HOME_MARKETING_QUERY_KEY = ['home-marketing-settings'];

export function useHomeMarketingQuery() {
  const container = useContainer();

  return useQuery<HomeMarketingSettings>({
    queryKey: HOME_MARKETING_QUERY_KEY,
    queryFn: async () => {
      return container.homeMarketing.getSettings();
    },
    staleTime: 1000 * 60 * 5, // 5 mins
  });
}

export function useUpdateHomeMarketingMutation() {
  const container = useContainer();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<HomeMarketingSettings>) => {
      return container.homeMarketing.updateSettings(settings);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(HOME_MARKETING_QUERY_KEY, data);
      queryClient.invalidateQueries({ queryKey: HOME_MARKETING_QUERY_KEY });
    },
  });
}
