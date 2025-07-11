import { useQuery } from '@tanstack/react-query';
import { getDonationById } from '@/services/donations/getDonationById';

export const useDonationById = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['donation', id],
    queryFn: () => getDonationById(id),
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });
};
