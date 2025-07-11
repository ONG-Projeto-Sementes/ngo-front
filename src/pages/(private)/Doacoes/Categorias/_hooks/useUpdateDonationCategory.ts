import { useMutation, useQueryClient } from '@tanstack/react-query';
import { putDonationCategory } from '@/services/donationCategories/putDonationCategory';
import type { DonationCategoryPayload } from '@/pages/(private)/Doacoes/_types/DonationCategory';

export const useUpdateDonationCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DonationCategoryPayload }) => 
      putDonationCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donation-categories'] });
    },
  });
};
