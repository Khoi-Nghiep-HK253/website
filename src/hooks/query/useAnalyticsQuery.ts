import { useQuery } from '@tanstack/react-query';
import { analyticsService, type GetAnalyticsParams } from '@/services/analyticsService';

export const useAnalyticsSummary = (params?: GetAnalyticsParams) => {
  return useQuery({
    queryKey: ['analytics', 'summary', params],
    queryFn: () => analyticsService.getAnalyticsSummary(params),
  });
};
