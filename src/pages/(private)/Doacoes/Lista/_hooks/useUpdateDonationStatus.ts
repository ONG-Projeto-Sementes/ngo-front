import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchDonationStatus } from '@/services/donations/patchDonationStatus';

export const useUpdateDonationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'pending' | 'received' | 'distributed' }) => 
      patchDonationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      queryClient.invalidateQueries({ queryKey: ['donation-stats'] });
    },
  });
};
