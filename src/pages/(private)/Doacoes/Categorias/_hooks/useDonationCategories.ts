import { useQuery } from '@tanstack/react-query';
import { getDonationCategories } from '@/services/donationCategories/getDonationCategories';
import type { GetDonationCategoriesParams } from '@/pages/(private)/Doacoes/_types/DonationCategory';

export const useDonationCategories = (params?: GetDonationCategoriesParams) => {
  return useQuery({
    queryKey: ['donation-categories', params],
    queryFn: () => getDonationCategories(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    throwOnError: false,
  });
};
