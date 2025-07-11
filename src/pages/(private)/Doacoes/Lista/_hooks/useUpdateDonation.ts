import { useMutation, useQueryClient } from '@tanstack/react-query';
import { putDonation } from '@/services/donations/putDonation';
import type { DonationPayload } from '@/pages/(private)/Doacoes/_types/Donation';

export const useUpdateDonation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DonationPayload }) => 
      putDonation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      queryClient.invalidateQueries({ queryKey: ['donation-stats'] });
    },
  });
};
