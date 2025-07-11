import { useQuery } from '@tanstack/react-query';
import { getCategoryPerformance, type CategoryPerformance } from '@/services/analytics/getCategoryPerformance';

export default function useGetCategoryPerformance() {
  return useQuery<CategoryPerformance[]>({
    queryKey: ['analytics', 'categories'],
    queryFn: getCategoryPerformance,
    refetchInterval: 60_000,
    throwOnError: false,
  });
}
