import { useQuery } from '@tanstack/react-query';
import { getWidgetMetrics, type WidgetMetric, type GetWidgetMetricsParams } from '@/services/analytics/getWidgetMetrics';

export default function useGetWidgetMetrics(params?: GetWidgetMetricsParams) {
  return useQuery<WidgetMetric[]>({
    queryKey: ['analytics', 'widgets', params],
    queryFn: () => getWidgetMetrics(params),
    refetchInterval: 30_000,
    throwOnError: false,
  });
}
