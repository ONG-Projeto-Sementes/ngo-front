import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postDonation } from '@/services/donations/postDonation';
import type { DonationPayload } from '@/pages/(private)/Doacoes/_types/Donation';

export const useCreateDonation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DonationPayload) => postDonation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      queryClient.invalidateQueries({ queryKey: ['donation-stats'] });
    },
  });
};
