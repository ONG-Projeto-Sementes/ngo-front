import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postDonationCategory } from '@/services/donationCategories/postDonationCategory';
import type { DonationCategoryPayload } from '@/pages/(private)/Doacoes/_types/DonationCategory';

export const useCreateDonationCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DonationCategoryPayload) => postDonationCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donation-categories'] });
    },
  });
};
