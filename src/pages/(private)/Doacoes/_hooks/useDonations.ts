import { useQuery } from '@tanstack/react-query';
import { getDonations } from '@/services/donations/getDonations';
import type { GetDonationsParams } from '../_types/Donation';

export const useDonations = (params?: GetDonationsParams) => {
  return useQuery({
    queryKey: ['donations', params],
    queryFn: () => getDonations(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });
};
