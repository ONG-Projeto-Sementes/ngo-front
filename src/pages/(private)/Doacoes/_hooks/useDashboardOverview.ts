import { useQuery } from '@tanstack/react-query';
import { getDashboardOverview, type GetDashboardParams } from '@/services/analytics/getDashboardOverview';

export function useDashboardOverview(params?: GetDashboardParams) {
  return useQuery({
    queryKey: ['dashboard-overview', params],
    queryFn: () => getDashboardOverview(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    throwOnError: false,
  });
}

export default useDashboardOverview;
