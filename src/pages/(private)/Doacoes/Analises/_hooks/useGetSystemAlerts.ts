import { useQuery } from '@tanstack/react-query';
import { getSystemAlerts, type SystemAlert } from '@/services/analytics/getSystemAlerts';

export default function useGetSystemAlerts() {
  return useQuery<SystemAlert[]>({
    queryKey: ['analytics', 'alerts'],
    queryFn: getSystemAlerts,
    refetchInterval: 30_000,
    throwOnError: false,
  });
}
