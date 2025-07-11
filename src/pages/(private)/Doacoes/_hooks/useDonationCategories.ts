import { useQuery } from '@tanstack/react-query';
import { getDonationCategories } from '@/services/donationCategories/getDonationCategories';
import type { GetDonationCategoriesParams } from '@/services/donationCategories/getDonationCategories';

export function useDonationCategories(params?: GetDonationCategoriesParams) {
  return useQuery({
    queryKey: ['donation-categories', params],
    queryFn: () => getDonationCategories(params),
  });
}
