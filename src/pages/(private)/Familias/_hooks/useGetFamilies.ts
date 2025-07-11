import useQuery from '@/hooks/useQuery';
import { getFamilies, type FamiliesResponse } from '@/services/families/getFamilies';

export default function useGetFamilies(page: number, debouncedSearch: string) {
  return useQuery<FamiliesResponse>({
    queryKey: ['families', page, debouncedSearch],
    service: () => getFamilies(page, debouncedSearch),
    refetchInterval: 30_000,
    autoStart: true,
  });
}
