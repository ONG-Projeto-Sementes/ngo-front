import useQuery from '@/hooks/useQuery';
import { getFamilies, type FamilyDTO } from '@/services/families/getFamilies';

export default function useGetFamilies(page: number, debouncedSearch: string) {
  return useQuery<FamilyDTO[]>({
    queryKey: ['families', page, debouncedSearch],
    service: getFamilies,
    refetchInterval: 30_000,
    autoStart: true,
  });
}
