import useQuery from '@/hooks/useQuery';
import { getEvents } from '@/services/events';
import type { PaginatedEvents } from '@/services/events';

export function useGetEvents(page: number, search: string) {
  return useQuery<PaginatedEvents, { page: number; limit: number; search: string }>({
    queryKey: ['events', { page, limit: 10, search }],
    service: (filters) => getEvents({ 
      page: filters?.page || 1, 
      limit: filters?.limit || 10, 
      search: filters?.search || '' 
    }),
    autoStart: true,
  });
}

export default useGetEvents;
