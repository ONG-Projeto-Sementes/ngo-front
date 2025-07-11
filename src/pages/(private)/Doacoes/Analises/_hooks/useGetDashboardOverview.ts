import { useQuery } from '@tanstack/react-query';
import { getDashboardOverview, type DashboardOverview, type GetDashboardParams } from '@/services/analytics/getDashboardOverview';

export default function useGetDashboardOverview(params?: GetDashboardParams) {
  return useQuery<DashboardOverview>({
    queryKey: ['analytics', 'dashboard', params],
    queryFn: () => getDashboardOverview(params),
    refetchInterval: 60_000, // Refresh every minute
  });
}
