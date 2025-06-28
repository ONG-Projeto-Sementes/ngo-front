import { getVolunteers, type PaginatedVolunteers } from '@/services/volunteer/getVolunteers';
import { useQuery } from '@tanstack/react-query';

export default function useGetVolunteers(page: number, debouncedSearch: string) {
  return useQuery<PaginatedVolunteers>({
    queryKey: ['volunteers', page, debouncedSearch],
    queryFn: () => getVolunteers({ page, limit: 10, search: debouncedSearch }),
    refetchInterval: 30_000,
  });
}
