import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchDonationCategoryActivation } from '@/services/donationCategories';

export const useToggleDonationCategoryActivation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => patchDonationCategoryActivation(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donation-categories'] });
    },
  });
};
