import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDonation } from '@/services/donations/createDonation';
import type { DonationFormData } from '../_types/Donation';

export const useCreateDonation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DonationFormData) => createDonation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      queryClient.invalidateQueries({ queryKey: ['donation-stats'] });
    },
  });
};
