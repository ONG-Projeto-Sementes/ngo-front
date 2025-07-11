import { useQuery } from '@tanstack/react-query';
import { getDonationStatsByCategory } from '@/services/donations/getDonationStatsByCategory';

export const useDonationStatsByCategory = () => {
  return useQuery({
    queryKey: ['donation-stats-by-category'],
    queryFn: getDonationStatsByCategory,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
  });
};
