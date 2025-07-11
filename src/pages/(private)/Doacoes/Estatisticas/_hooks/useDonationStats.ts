import { useQuery } from '@tanstack/react-query';
import { getDonationStats } from '@/services/donations/getDonationStats';

export const useDonationStats = () => {
  return useQuery({
    queryKey: ['donation-stats'],
    queryFn: getDonationStats,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
  });
};
