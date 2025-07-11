import { useQuery } from '@tanstack/react-query';
import { getTrendAnalysis, type TrendData, type GetTrendParams } from '@/services/analytics/getTrendAnalysis';

export default function useGetTrendAnalysis(params?: GetTrendParams) {
  return useQuery<TrendData>({
    queryKey: ['analytics', 'trends', params],
    queryFn: () => getTrendAnalysis(params),
    refetchInterval: 60_000,
  });
}
